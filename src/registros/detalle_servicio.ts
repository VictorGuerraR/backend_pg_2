import db from '#conexion';
import logger from '#logs';
import { Knex } from 'knex';
import { Request, Response } from 'express';
import {
  creacionDetalleServicio,
  desactivacionDetalleServicio,
  CreacionDS,
  DesactivacionDS
} from '#types/detalleServicio';

function whereDetalleServicio(params: any, query: Knex.QueryBuilder, prefix: string): Knex.QueryBuilder {
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

const consultaDetalleServicios = () => db({ ds: 'registros.detalle_servicio' })
  .innerJoin({ uc: 'registros.usuarios' }, 'uc.cod_usuario', 'ds.cod_usuario_creacion')
  .select(
    'ds.activo',
    'ds.cod_detalle_servicio',
    'ds.cod_herramienta',
    'ds.cod_maestro',
    'ds.cod_usuario_creacion',
    'ds.codigo_moneda',
    'ds.codigo_tiempo_uso',
    'ds.descripcion',
    'ds.fecha_creacion',
    'ds.monto_total',
    'ds.tiempo_uso',
    'ds.total_consumo_energetico',
    'ds.total_depreciacion',
    'ds.total_horas_servicio',
    { usuario_creacion: db.raw("concat(uc.nombres, ' ', uc.apellidos)") },
  )
  .orderBy('ds.cod_detalle_servicio', 'desc')


export async function obtenerRegistrosDetalleServicios(req: Request, res: Response) {
  try {
    const respuesta = await whereDetalleServicio(req.query, consultaDetalleServicios(), 'ds')
    res.status(200).json(respuesta)
    logger.info({
      message: 'Respuesta exitosa en detalle_servicio',
      labels: { code: 200, scope: 'get', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.error({
      message: 'Respuesta con errores en detalle_servicio',
      labels: { code: 200, scope: 'get', ususario: req.usuario?.usuario }
    });
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

    res.status(200).json(respuesta)
    logger.info({
      message: 'Respuesta exitosa en detalle_servicio',
      labels: { code: 200, scope: 'post', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.error({
      message: 'Respuesta con errores en detalle_servicio',
      labels: { code: 200, scope: 'post', ususario: req.usuario?.usuario }
    });
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
    res.status(200).json(respuesta)
    logger.info({
      message: 'Respuesta exitosa en detalle_servicio',
      labels: { code: 200, scope: 'delete', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.error({
      message: 'Respuesta con errores en detalle_servicio',
      labels: { code: 200, scope: 'delete', ususario: req.usuario?.usuario }
    });
  }
}