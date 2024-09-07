import db from '#conexion'
import { Knex } from 'knex';
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
  .leftJoin({ db: 'registros.detalle_bien' }, 'db.cod_maestro', 'm.cod_maestro')
  .leftJoin({ ds: 'registros.detalle_servicio' }, 'ds.cod_maestro', 'm.cod_maestro')
  .select('*')

export async function obtenerRegistrosMaestros(req: Request, res: Response) {
  try {
    const respuesta: Maestro[] = await whereMaestro(req.query, consultaMaestro(), 'm')
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