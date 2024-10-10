import db from '#conexion';
import logger from '#logs';
import { Request, Response } from 'express';

const consultaReporteDepreciacion = () => db({ ds: 'registros.detalle_servicio' })
  .innerJoin({ m: 'registros.maestro' }, 'ds.cod_maestro', 'm.cod_maestro')
  .innerJoin({ h: 'registros.herramienta' }, 'h.cod_herramienta', 'ds.cod_herramienta')
  .innerJoin({ ur: 'registros.usuarios' }, 'ur.cod_usuario', 'h.cod_usuario_responsable')
  .select(
    'h.cod_herramienta',
    'h.descripcion',
    'h.fecha_adquisicion',
    'h.monto',
    'h.codigo_moneda',
    { usuario_responsable: db.raw("CONCAT(ur.nombres, ' ', ur.apellidos)") },
    { servicios_brindados: db.raw('COUNT(ds.cod_detalle_servicio)') },
    { depreciacion_maquinaria: db.raw('SUM(ds.total_depreciacion)') },
    { porcentaje_depreciacion_herramienta: db.raw('ROUND((SUM(ds.total_depreciacion)/ h.monto) * 100,2)') }
  )
  .where('m.activo', true)
  .groupBy('h.cod_herramienta', 'ur.nombres', 'ur.apellidos')

export async function reporteDepreciacion(req: Request, res: Response) {
  try {
    const respuesta = await consultaReporteDepreciacion()
    res.status(200).json(respuesta)
    logger.info({
      message: 'Respuesta exitosa en reportes:reporteDepreciacion',
      labels: { code: 200, scope: 'get', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.error({
      message: 'Respuesta con errores en reportes:reporteDepreciacion',
      labels: { code: 418, scope: 'get', ususario: req.usuario?.usuario, error }
    });
  }
}

const consultaReporteGananciaPorUsuario = () => db({ m: 'registros.maestro' })
  .innerJoin({ u: 'registros.usuarios' }, 'u.cod_usuario', 'h.cod_usuario_creacion')
  .select(
    { usuario: db.raw("CONCAT(u.nombres, ' ', u.apellidos)") },
    { ganancia: db.raw('SUM(m.monto_ganacia)') },
    { impuesto: db.raw('SUM(m.monto_impuesto)') }
  )
  .where('m.activo', true)


export async function reporteGananciaPorUsuario(req: Request, res: Response) {
  try {
    const respuesta = await consultaReporteGananciaPorUsuario()
    res.status(200).json(respuesta)
    logger.info({
      message: 'Respuesta exitosa en reportes:reporteGananciaPorUsuario',
      labels: { code: 200, scope: 'get', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.error({
      message: 'Respuesta con errores en reportes:reporteGananciaPorUsuario',
      labels: { code: 418, scope: 'get', ususario: req.usuario?.usuario, error }
    });
  }
}