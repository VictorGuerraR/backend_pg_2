import db from '#conexion';
import logger from '#logs';
import { Request, Response } from 'express';

const consultaReporteDepreciacion = () => db({ ds: 'registros.detalle_servicio' })
  .innerJoin({ m: 'registros.maestro' }, 'ds.cod_maestro', 'm.cod_maestro')
  .innerJoin({ h: 'registros.herramienta' }, 'h.cod_herramienta', 'ds.cod_herramienta')
  .select(
    'h.cod_herramienta',
    'h.descripcion',
    'h.monto',
    'h.codigo_moneda',
    { servicios_brindados: db.raw('count(ds.cod_detalle_servicio)') },
    { depreciacion_maquinaria: db.raw('sum(ds.total_depreciacion)') },
    { porcentaje_depreciacion_herramienta: db.raw('round((sum(ds.total_depreciacion)/ h.monto) * 100,2)') }
  )
  .where('m.activo', true)
  .groupBy('h.cod_herramienta')

export async function reporteDepreciacion(req: Request, res: Response) {
  try {
    const respuesta = await consultaReporteDepreciacion()
    res.status(200).json(respuesta)
    logger.info({
      message: 'Respuesta exitosa en reportes:reporteDepreciacion',
      labels: { code: 200, scope: 'delete', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.error({
      message: 'Respuesta con errores en reportes:reporteDepreciacion',
      labels: { code: 418, scope: 'delete', ususario: req.usuario?.usuario, error }
    });
  }
}