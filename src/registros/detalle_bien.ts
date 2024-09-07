import db from '#conexion'
import { Knex } from 'knex';
import { Request, Response } from 'express';
import {
  CreacionDB,
  DetalleBien,
  DesactivacionDB,
  creacionDetalleBien,
  desactivacionDetalleBien
} from '#types/detalleBien';

function whereDetalleBien(params: any, query: Knex.QueryBuilder, prefix: string): Knex.QueryBuilder {
  return query
}

const consultaDetalleBien = () => db({ db: 'registros.detalle_bien' })

export async function obtenerRegistrosDetalleBienes(req: Request, res: Response) {
  try {
    const respuesta: DetalleBien[] = await whereDetalleBien(req.query, consultaDetalleBien(), 'db')

    res.status(200).json({ respuesta })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}

export async function crearDetalleBien(req: Request, res: Response) {
  try {
    let respuesta
    const detalleBien: CreacionDB = creacionDetalleBien.parse(
      { cod_usuario_creacion: req.usuario?.cod_usuario, ...req.body }
    )

    await db.transaction(async (trx) => {
      respuesta = await trx('registros.detalle_bien')
        .insert(detalleBien)
        .returning('cod_detalle_bien')
    })
    res.status(200).json({ respuesta })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}



export async function desactivarDetalleBien(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_detalle_bien, ...detalleBien }: DesactivacionDB =
      desactivacionDetalleBien.parse(
        { cod_usuario_anulacion: req.usuario?.cod_usuario, ...req.body }
      )

    await db.transaction(async (trx) => {
      respuesta = await trx('registros.detalle_bien')
        .update(detalleBien)
        .where({ cod_detalle_bien })
        .returning('cod_detalle_bien')
    })

    res.status(200).json({ respuesta })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}