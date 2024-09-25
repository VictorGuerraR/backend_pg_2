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
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue
    switch (key) {
      case 'cod_maestro':
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

const consultaDetalleBien = () => db({ db: 'registros.detalle_bien' })
  .innerJoin({ uc: 'registros.usuarios' }, 'uc.cod_usuario', 'db.cod_usuario_creacion')
  .innerJoin({ mp: 'registros.materia_prima' }, 'db.cod_materia_prima', 'mp.cod_materia_prima')
  .select(
    'db.activo',
    'db.cod_detalle_bien',
    'db.cod_maestro',
    'db.cod_materia_prima',
    'db.codigo_moneda',
    'db.codigo_unidad',
    'db.descripcion',
    'db.fecha_creacion',
    'db.monto_total',
    'db.unidad',
    { descripcion_materia: 'mp.descripcion' },
    { usuario_creacion: db.raw("concat(uc.nombres, ' ', uc.apellidos)") }
  )


export async function obtenerRegistrosDetalleBienes(req: Request, res: Response) {
  try {
    const respuesta: DetalleBien[] = await whereDetalleBien(req.query, consultaDetalleBien(), 'db')
    res.status(200).json(respuesta)
    console.log({ code: 200, message: 'Respuesta exitosa en detalle_bien', scope: 'get' })
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
    res.status(200).json(respuesta)
    console.log({ code: 200, message: 'Respuesta exitosa en detalle_bien', scope: 'post' })
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

    res.status(200).json(respuesta)
    console.log({ code: 200, message: 'Respuesta exitosa en detalle_bien', scope: 'delete' })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}