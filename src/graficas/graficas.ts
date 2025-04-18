import dayjs from 'dayjs';
import logger from '#logs';
import db from '#conexion';
import { Knex } from 'knex';
import { Request, Response } from 'express';
import { Stat, maxValues, StatKey } from './typesGraficas';

function whereGraficas(params: any, query: Knex.QueryBuilder, prefix: string): Knex.QueryBuilder {
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

const consultaGraficasEncabezados = () => db({ m: 'registros.maestro' })
  .innerJoin(db('registros.detalle_servicio')
    .select('cod_maestro')
    .sum('monto_total as monto_total')
    .groupBy('cod_maestro').as('ds')
    , 'ds.cod_maestro', 'm.cod_maestro')
  .innerJoin(db('registros.detalle_bien')
    .select('cod_maestro')
    .sum('monto_total as monto_total')
    .groupBy('cod_maestro').as('db')
    , 'db.cod_maestro', 'm.cod_maestro')
  .select(
    { "Total Ganancia": db.raw('COALESCE(SUM(m.monto_ganancia), 0) - COALESCE(SUM(m.monto_impuesto), 0)') },
    { "Total Impuesto": db.raw('COALESCE(SUM(m.monto_impuesto), 0)') },
    { "Monto Total Servicio": db.raw('COALESCE(SUM(ds.monto_total), 0)') },
    { "Monto Total Bien": db.raw('COALESCE(SUM(db.monto_total), 0)') }
  )
  .where('m.activo', true);


function parseDataToStats(data: any) {
  const stats: Stat[] = Object.entries(data).map(([key, value]) => {
    const maxValue = maxValues[key as StatKey] || 1;
    const currentValue = parseFloat(value as string) || 0;
    const progressValue = (currentValue / maxValue) * 100;

    let color = 'bg-gray-50';
    switch (key) {
      case 'Total Ganancia':
        color = 'bg-azure-50';
        break;
      case 'Total Impuesto':
        color = 'bg-green-50';
        break;
      case 'Monto Total Servicio':
        color = 'bg-orange-50';
        break;
      case 'Monto Total Bien':
        color = 'bg-cyan-50';
        break;
    }

    return {
      title: key,
      amount: currentValue.toString(),
      progress: {
        value: Math.min(progressValue, 100)
      },
      color: color
    };
  });

  return stats
}

export async function obtenerGraficasEncabezado(req: Request, res: Response) {
  try {
    const { fecha_creacion = [dayjs(), dayjs()] } = req.query;
    const [data] = await whereGraficas({ fecha_creacion }, consultaGraficasEncabezados(), 'm')
    const stats = parseDataToStats(data);
    res.status(200).json(stats);
    logger.info({
      message: 'Respuesta exitosa en graficas:obtenerGraficasEncabezado',
      labels: { code: 200, scope: 'get', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.info({
      message: 'Respuesta con error en graficas:obtenerGraficasEncabezado',
      labels: { code: 418, scope: 'get', ususario: req.usuario?.usuario, error }
    });
  }
}
