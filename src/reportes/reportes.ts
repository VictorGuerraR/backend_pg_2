import dayjs from 'dayjs';
import db from '#conexion';
import logger from '#logs';
import { Knex } from 'knex';
import { Request, Response } from 'express';

function whereReportes(params: any, query: Knex.QueryBuilder, prefix: string): Knex.QueryBuilder {
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue;
    switch (key) {
      case 'fecha_creacion': {
        const fechas = Array.isArray(value) ? value : [value, value];
        fechas[0] = dayjs(fechas[0]).startOf('month').format('YYYY-MM-DD');
        fechas[1] = dayjs(fechas[1]).endOf('month').format('YYYY-MM-DD');
        query.whereBetween(`${prefix}.${key}`, [fechas[0], fechas[1]]);
        break;
      }

      default:
        break;
    }
  }

  return query;
}

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

const consultaCostosFijos = () => db({ c: 'registros.costo_fijos' })
  .select(
    { costos: db.raw('SUM(c.monto_total)') }
  )
  .where('c.activo', true)

const consultaReporteGananciaPorUsuario = () => db({ m: 'registros.maestro' })
  .innerJoin({ ds: 'registros.detalle_servicio' }, 'ds.cod_maestro', 'm.cod_maestro')
  .innerJoin({ u: 'registros.usuarios' }, 'u.cod_usuario', 'm.cod_usuario_creacion')
  .with('cs', consultaCostosFijos())
  .select(
    'm.codigo_moneda',
    { usuario: db.raw("CONCAT(u.nombres, ' ', u.apellidos)") },
    { ganancia: db.raw('SUM(m.monto_ganacia)') },
    { impuesto: db.raw('SUM(m.monto_impuesto)') },
    { cobertura_costos: db.raw("SUM(ds.total_horas_servicio)") },
    { cobertura_costos_porcentaje: db.raw("ROUND( (SUM(ds.total_horas_servicio) / (select cs.costos from cs))*100,2 ) ") }
  )
  .where('m.activo', true)
  .groupBy(
    'u.nombres',
    'u.apellidos',
    'm.codigo_moneda'
  )

export async function reporteGananciaPorUsuario(req: Request, res: Response) {
  try {
    const { fecha_creacion = [dayjs(), dayjs()] } = req.query;
    const respuesta = await
      whereReportes(
        { fecha_creacion },
        consultaReporteGananciaPorUsuario(),
        'm'
      )
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