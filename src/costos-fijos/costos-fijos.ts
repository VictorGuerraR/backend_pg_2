import logger from '#logs';
import db from '#conexion';
import { Knex } from 'knex';
import paginate from '#pagination';
import { Request, Response } from 'express';
import {
  ActualizacionCF,
  CreacionCF,
  DesactivacionCF,
  actualizacionCostoFijo,
  creacionCostoFijo,
  desactivacionCostoFijo
} from '#types/costosFijos';


function whereCostosFijos(params: any, query: Knex.QueryBuilder, prefix: string): Knex.QueryBuilder {
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue
    switch (key) {
      case 'cod_costo_fijo':
      case 'cod_usuario_creacion':
      case 'cod_usuario_anulacion':
        query.where(`${prefix}.${key}`, Number(value))
        break;
      case 'activo':
        query.where(`${prefix}.${key}`, Boolean(value))
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

const consultaCostosFijos = () => db({ cf: 'registros.costo_fijos' })
  .innerJoin({ uc: 'registros.usuarios' }, 'uc.cod_usuario', 'cf.cod_usuario_creacion')
  .select(
    { usuario_creacion: db.raw("concat(uc.nombres, ' ', uc.apellidos)") },
    'cf.cod_costo_fijo',
    'cf.cod_usuario_creacion',
    'cf.fecha_creacion',
    'cf.activo',
    'cf.descripcion',
    'cf.codigo_moneda',
    'cf.monto_total'
  )
  .groupBy(
    'cf.cod_costo_fijo',
    'uc.nombres',
    'uc.apellidos'
  )
  .orderBy('cf.cod_costo_fijo', 'desc')


export async function obtenerCostosFijos(req: Request, res: Response) {
  try {
    const { page, limit, ...parametros } = req.query
    const currentPage = Number(req.query.page) || 1;
    const pageSize = Number(req.query.limit) || 10;

    const respuesta = await paginate({
      query: whereCostosFijos(parametros, consultaCostosFijos(), 'cf'),
      currentPage,
      pageSize
    });

    res.status(200).json({ respuesta });
    logger.info({
      message: 'Respuesta exitosa en costos-fijos',
      labels: { code: 200, scope: 'get', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    logger.error({
      message: 'Respuesta con error en costos-fijos',
      labels: { code: 200, scope: 'get', error }
    });
    res.status(500).json({ error: 'Ocurrió un error al obtener los costos fijos' });
  }
}

export async function crearCostosFijos(req: Request, res: Response) {
  try {
    let respuesta
    const costoFijo: CreacionCF = creacionCostoFijo.parse(
      { cod_usuario_creacion: req.usuario?.cod_usuario, ...req.body }
    )

    await db.transaction(async (trx) => {
      respuesta = await trx('registros.costo_fijos')
        .insert(costoFijo)
        .returning('cod_costo_fijo')
    })

    res.status(200).json(respuesta)
    logger.info({
      message: 'Respuesta exitosa en costos-fijos',
      labels: { code: 200, scope: 'post', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    logger.info({
      message: 'Respuesta exitosa en costos-fijos',
      labels: { code: 418, scope: 'post', ususario: req.usuario?.usuario, error }
    });
    res.status(418).json({ error })
  }
}

export async function actualizarCostosFijos(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_costo_fijo, ...costoFijo }: ActualizacionCF = actualizacionCostoFijo.parse(req.body)

    await db.transaction(async (trx) => {
      respuesta = await trx('registros.costo_fijos')
        .update(costoFijo)
        .where({ cod_costo_fijo })
        .returning('cod_costo_fijo')
    })

    res.status(200).json(respuesta)
    logger.info({
      message: 'Respuesta exitosa en costos-fijos',
      labels: { code: 200, scope: 'patch', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    logger.info({
      message: 'Respuesta con error en costos-fijos',
      labels: { code: 418, scope: 'patch', ususario: req.usuario?.usuario, error }
    });
    res.status(418).json({ error })
  }
}

export async function desactivarCostosFijos(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_costo_fijo, ...costoFijo }: DesactivacionCF = desactivacionCostoFijo.parse(
      {
        cod_usuario_anulacion: req.usuario?.cod_usuario, ...req.body
      }
    )

    await db.transaction(async (trx) => {
      respuesta = await trx('registros.costo_fijos')
        .update(costoFijo)
        .where({ cod_costo_fijo })
        .returning('cod_costo_fijo')
    })

    res.status(200).json(respuesta)
    logger.info({
      message: 'Respuesta exitosa en costos-fijos',
      labels: { code: 200, scope: 'delete', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    logger.info({
      message: 'Respuesta con error en costos-fijos',
      labels: { code: 418, scope: 'delete', ususario: req.usuario?.usuario, error }
    });
    res.status(418).json({ error })
  }
}
