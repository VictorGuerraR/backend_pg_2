import db from '#conexion';
import logger from '#logs';
import { Knex } from 'knex';
import paginate from '#pagination'
import {
  CreacionMP,
  ActualizacionMP,
  DesactivacionMP,
  creacionMateriaPrima,
  actualizacionMateriaPrima,
  desactivacionMateriaPrima,
} from '#types/materiaPrima';
import { Request, Response } from 'express';

function whereMateriasPrimas(params: any, query: Knex.QueryBuilder, prefix: string): Knex.QueryBuilder {
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue
    switch (key) {
      case 'cod_materia_prima':
      case 'activo':
      case 'cantidad':
      case 'cod_usuario_anulacion':
      case 'cod_usuario_creacion':
      case 'codigo_moneda':
      case 'codigo_unidad':
        query.where(`${prefix}.${key}`, value)
        break;
      case 'monto':
      case 'fecha_anulacion':
      case 'fecha_creacion':
        query.whereBetween(`${prefix}.${key}`, [value, value])
        break;
      case 'descripcion':
        query.whereILike(`${prefix}.${key}`, value)
        break;

      default:
        break;
    }
  }
  return query
}

const consultaMateriasPrimas = () => db({ mp: 'registros.materia_prima' })
  .innerJoin({ uc: 'registros.usuarios' }, 'mp.cod_usuario_creacion', 'uc.cod_usuario')
  .leftJoin({ mmp: 'registros.movimiento_materia_prima' }, 'mmp.cod_materia_prima', 'mp.cod_materia_prima')
  .select(
    'mp.cod_materia_prima',
    'mp.activo',
    'mp.cantidad',
    'mp.cod_usuario_creacion',
    'mp.codigo_moneda',
    'mp.codigo_unidad',
    'mp.descripcion',
    'mp.fecha_creacion',
    'mp.monto',
    { usuario_creacion: db.raw("concat(uc.nombres, ' ', uc.apellidos)") },
    { ingresos: db.raw('sum(case when mmp.cantidad >= 0 and mmp.activo = true then mmp.cantidad else 0 end)') },
    { egresos: db.raw('sum(case when mmp.cantidad < 0 and mmp.activo = true then mmp.cantidad else 0 end)') }
  )
  .groupBy(
    'mp.cod_materia_prima',
    'uc.nombres',
    'uc.apellidos'
  )
  .orderBy('mp.cod_materia_prima', 'desc')

export async function obtenerMateriasPrimas(req: Request, res: Response) {
  try {
    const { page, limit, ...parametros } = req.query
    const currentPage = Number(req.query.page) || 1;
    const pageSize = Number(req.query.limit) || 10;

    const respuesta = await paginate({
      query: whereMateriasPrimas(parametros, consultaMateriasPrimas(), 'mp'),
      currentPage,
      pageSize
    })

    res.status(200).json({ respuesta })
    logger.info({
      message: 'Respuesta exitosa en materia-prima',
      labels: { code: 200, scope: 'get', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.info({
      message: 'Respuesta con errores en materia-prima',
      labels: { code: 418, scope: 'get', ususario: req.usuario?.usuario, error }
    });
  }
}

export async function crearMateriaPrima(req: Request, res: Response) {
  try {
    let respuesta
    const materiPrima: CreacionMP = creacionMateriaPrima
      .parse(
        { cod_usuario_creacion: req.usuario?.cod_usuario, ...req.body }
      )
    await db.transaction(async (trx) => {
      respuesta = await trx('registros.materia_prima')
        .insert(materiPrima)
        .returning('cod_materia_prima')
    })

    res.status(200).json(respuesta)
    logger.info({
      message: 'Respuesta exitosa en materia-prima',
      labels: { code: 200, scope: 'post', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.info({
      message: 'Respuesta con errores en materia-prima',
      labels: { code: 418, scope: 'post', ususario: req.usuario?.usuario, error }
    });
  }
}

export async function actualizarMateriaPrima(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_materia_prima, ...materiPrima }: ActualizacionMP = actualizacionMateriaPrima.parse(req.body)
    await db.transaction(async (trx) => {
      respuesta = await trx('registros.materia_prima')
        .update(materiPrima)
        .where({ cod_materia_prima })
        .returning('cod_materia_prima')
    })

    res.status(200).json(respuesta)
    logger.info({
      message: 'Respuesta exitosa en materia-prima',
      labels: { code: 200, scope: 'patch', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.info({
      message: 'Respuesta con errores en materia-prima',
      labels: { code: 418, scope: 'patch', ususario: req.usuario?.usuario, error }
    });
  }
}

export async function desactivarMateriaPrima(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_materia_prima, ...materiPrima }: DesactivacionMP = desactivacionMateriaPrima
      .parse(
        { cod_usuario_anulacion: req.usuario?.cod_usuario, ...req.body }
      )

    await db.transaction(async (trx) => {
      respuesta = await trx('registros.materia_prima')
        .update(materiPrima)
        .where({ cod_materia_prima })
        .returning('cod_materia_prima')
    })

    res.status(200).json(respuesta)
    logger.info({
      message: 'Respuesta exitosa en materia-prima',
      labels: { code: 200, scope: 'delete', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.info({
      message: 'Respuesta con errores en materia-prima',
      labels: { code: 418, scope: 'delete', ususario: req.usuario?.usuario, error }
    });
  }
}
