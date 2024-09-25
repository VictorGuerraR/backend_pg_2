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
  actualizacionMaestro,
  ActualizacionM,
} from '#types/maestro';
import {
  DesactivacionDB,
  desactivacionDetalleBien
} from '#types/detalleBien';
import {
  desactivacionDetalleServicio,
  DesactivacionDS
} from '#types/detalleServicio';

function whereMaestro(params: any, query: Knex.QueryBuilder, prefix: string): Knex.QueryBuilder {
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue
    switch (key) {
      case 'cod_maestro':
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
    console.log({ code: 200, message: 'Respuesta exitosa en maestro', scope: 'get' })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}

export async function obtenerEncabezadoMaestro(req: Request, res: Response) {
  try {
    const respuesta = await whereMaestro(req.query, db({ m: 'registros.maestro' }), 'm')
    res.status(200).json(respuesta)
    console.log({ code: 200, message: 'Respuesta exitosa en maestro:obtenerEncabezadoMaestro', scope: 'get' })
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

    res.status(200).json(respuesta)
    console.log({ code: 200, message: 'Respuesta exitosa en costos-fijos', scope: 'post' })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}

export async function actualizarMaestro(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_maestro, ...maestro }: ActualizacionM = actualizacionMaestro
      .parse({ cod_usuario_anulacion: req.usuario?.cod_usuario, ...req.body })

    await db.transaction(async (trx) => {
      // desactivacion de maestro
      respuesta = await trx('registros.maestro')
        .update(maestro)
        .where({ cod_maestro })
        .returning('cod_maestro')
    })

    res.status(200).json(respuesta)
    console.log({ code: 200, message: 'Respuesta exitosa en maestro', scope: 'patch' })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}

export async function desactivarMaestro(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_maestro, ...maestro }: DesactivacionM = desactivacionMaestro
      .parse({ cod_usuario_anulacion: req.usuario?.cod_usuario, ...req.body })

    const { cod_detalle_servicio, ...detalleServicio }: DesactivacionDS =
      desactivacionDetalleServicio.parse({
        cod_detalle_servicio: 0,
        cod_usuario_anulacion: req.usuario?.cod_usuario,
        ...req.body
      })

    const { cod_detalle_bien, ...detalleBien }: DesactivacionDB =
      desactivacionDetalleBien.parse({
        cod_detalle_bien: 0,
        cod_usuario_anulacion: req.usuario?.cod_usuario,
        ...req.body
      })

    await db.transaction(async (trx) => {
      // desactivacion de todos los detalles bien pertenecientes a ese maestro 
      await trx('registros.detalle_bien')
        .update(detalleBien)
        .where({ cod_maestro })

      // desactivacion de todos los detalles servicio pertenecientes a ese maestro 
      await trx('registros.detalle_servicio')
        .update(detalleServicio)
        .where({ cod_maestro })

      // desactivacion de maestro
      respuesta = await trx('registros.maestro')
        .update(maestro)
        .where({ cod_maestro })
        .returning('cod_maestro')
    })

    res.status(200).json(respuesta)
    console.log({ code: 200, message: 'Respuesta exitosa en maestro', scope: 'delete' })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}