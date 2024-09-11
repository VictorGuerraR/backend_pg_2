import db from '#conexion'
import { Knex } from 'knex';
import { Request, Response } from 'express';
import {
  creacionDetalleServicio,
  desactivacionDetalleServicio,
  CreacionDS,
  DesactivacionDS
} from '#types/detalleServicio';

function whereDetalleServicio(params: any, query: Knex.QueryBuilder, prefix: string): Knex.QueryBuilder {
  return query
}

const consultaDetalleServicios = () => db({ ds: 'registros.detalle_servicio' })
  .select('*')

export async function obtenerRegistrosDetalleServicios(req: Request, res: Response) {
  try {
    const respuesta = await whereDetalleServicio(req.query, consultaDetalleServicios(), 's')
    res.status(200).json({ respuesta })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}

export async function crearDetalleServicio(req: Request, res: Response) {
  try {
    let respuesta
    const detalleServicio: CreacionDS = creacionDetalleServicio.parse(
      { cod_usuario_creacion: req.usuario?.cod_usuario, ...req.body }
    )
    await db.transaction(async (trx) => {
      respuesta = await trx('registros.detalle_servicio')
        .insert(detalleServicio)
        .returning('cod_detalle_servicio')
    })

    res.status(200).json({ respuesta })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}

export async function desactivarDetalleServicio(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_detalle_servicio, ...detalleServicio }: DesactivacionDS =
      desactivacionDetalleServicio.parse(
        { cod_usuario_anulacion: req.usuario?.cod_usuario, ...req.body }
      )
    await db.transaction(async (trx) => {
      respuesta = await trx('registros.detalle_servicio')
        .update(detalleServicio)
        .where({ cod_detalle_servicio })
        .returning('cod_detalle_servicio')
    })
    res.status(200).json({ respuesta })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}