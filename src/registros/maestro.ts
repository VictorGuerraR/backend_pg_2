import db from '#conexion'
import { Knex } from 'knex';
import paginate from '#pagination'
import { Request, Response } from 'express';
import {
  creacionMaestro,
  desactivacionMaestro,
  Maestro,
  CreacionM,
  DesactivacionM,
} from '#types/maestro';

function whereMaestro(params: any, query: Knex.QueryBuilder, prefix: string): Knex.QueryBuilder {
  return query
}

const consultaMaestro = () => db({ m: 'registros.maestro' })
  .innerJoin({ uc: 'registros.usuarios' }, 'm.cod_usuario_creacion', 'uc.cod_usuario')
  .select(
    'm.cod_maestro',
    'm.cod_usuario_creacion',
    'm.fecha_creacion',
    'm.activo',
    'm.cod_usuario_anulacion',
    'm.fecha_anulacion',
    'm.descripcion',
    'm.codigo_moneda',
    'm.monto_total',
    'm.porcentaje_impuesto',
    'm.monto_impuesto',
    'm.precio_kw',
    'm.monto_ganacia',
    'm.porcentaje_ganancia',
    { usuario_creacion: db.raw("concat(uc.nombres, ' ', uc.apellidos)") },
  )
  .groupBy(
    'm.cod_maestro',
    'uc.nombres',
    'uc.apellidos'
  )
  .orderBy('m.cod_maestro', 'desc')

export async function obtenerRegistrosMaestros(req: Request, res: Response) {
  try {
    const { page, limit, ...parametros } = req.query
    const currentPage = Number(req.query.page) || 1;
    const pageSize = Number(req.query.limit) || 10;

    const respuesta = await paginate({
      query: whereMaestro(parametros, consultaMaestro(), 'm'),
      currentPage,
      pageSize
    })

    res.status(200).json({ respuesta })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}

export async function crearMaestro(req: Request, res: Response) {
  try {
    let respuesta
    const maestro: CreacionM = creacionMaestro.parse(
      { cod_usuario_creacion: req.usuario?.cod_usuario, ...req.body }
    )
    await db.transaction(async (trx) => {
      respuesta = await trx('registros.maestro')
        .insert(maestro)
        .returning('cod_maestro')
    })

    res.status(200).json({ respuesta })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}


export async function desactivarMaestro(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_maestro, ...maestro }: DesactivacionM = desactivacionMaestro
      .parse(
        { cod_usuario_anulacion: req.usuario?.cod_usuario, ...req.body }
      )
    await db.transaction(async (trx) => {
      respuesta = await trx('registros.maestro')
        .update(maestro)
        .where({ cod_maestro })
        .returning('cod_maestro')
    })

    res.status(200).json({ respuesta })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}