import db from '#conexion'
import { Knex } from 'knex';
import { Request, Response } from 'express';
import {
  Herramienta,
  CreacionH,
  ActualizacionH,
  DesactivacionH,
  creacionHerramienta,
  actualizacionHerramienta,
  desactivacionHerramienta
} from '#types/herramienta'

function whereHerramientas(params: any, query: Knex.QueryBuilder, prefix: string): Knex.QueryBuilder {
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue
    switch (key) {
      case 'cod_herramienta':
      case 'cod_tipo_depreciacion':
      case 'cod_usuario_responsable':
      case 'cod_usuario_creacion':
      case 'cod_usuario_anulacion':
      case 'activo':
      case 'codigo_moneda':
      case 'consumo_electrico':
        query.where(`${prefix}.${key}`, value)
        break;
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

const consultaHerramientas = () => db({ h: 'registros.herramienta' })
  .innerJoin({ pd: 'porcentajes_depreciacion' }, 'h.cod_tipo_depreciacion', 'pd.cod_tipo_depreciacion')
  .innerJoin({ ur: 'usuarios' }, 'ur.cod_usuario', 'h.cod_usuario_responsable')
  .innerJoin({ uc: 'usuarios' }, 'uc.cod_usuario', 'h.cod_usuario_creacion')
  .leftJoin({ ds: 'detalle_servicio' }, 'ds.cod_herramienta', 'h.cod_herramienta')
  .select(
    'h.cod_herramienta',
    'ds.tiempo_uso',
    'h.cod_tipo_depreciacion',
    'h.cod_usuario_responsable',
    'h.cod_usuario_creacion',
    'h.fecha_creacion',
    'h.activo',
    'h.codigo_moneda',
    'h.descripcion',
    'h.monto',
    'h.consumo_electrico',
    'h.codigo_medida_electricidad',
    'pd.descripcion as tipo_depreciacion',
    { usuario_responsable: db.raw("concat(ur.nombres, ' ', ur.apellidos)") },
    { usuario_creacion: db.raw("concat(uc.nombres, ' ', uc.apellidos)") },
    { tiempo_en_uso: db.raw('sum(coalesce(ds.tiempo_uso, 0))') }
  )
  .groupBy(
    'h.cod_herramienta',
    'pd.descripcion',
    'ur.nombres',
    'ur.apellidos',
    'uc.nombres',
    'uc.apellidos',
    'ds.tiempo_uso'
  )

export async function obtenerHerramientas(req: Request, res: Response) {
  try {
    const resultado: Herramienta[] = await whereHerramientas(req.query, consultaHerramientas(), 'h')
    res.status(200).json({ resultado })
  } catch (error) {
    res.status(404).json({ error })
  }
}


export async function crearHerramienta(req: Request, res: Response) {
  try {
    let respuesta
    const herramienta: CreacionH = creacionHerramienta.parse(
      { cod_usuario_creacion: req.usuario?.cod_usuario, ...req.body }
    )
    await db.transaction(async (trx) => {
      respuesta = await trx('registros.herramienta')
        .insert(herramienta)
        .returning('cod_herramienta')
    })

    res.status(200).json({ respuesta })
  } catch (error) {
    res.status(404).json({ error })
  }
}

export async function actualizarHerramienta(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_herramienta, ...herramienta }: ActualizacionH = actualizacionHerramienta.parse(req.body)
    await db.transaction(async (trx) => {
      respuesta = await trx('registros.herramienta')
        .update(herramienta)
        .where({ cod_herramienta })
        .returning('cod_herramienta')
    })
    res.status(200).json({ respuesta })
  } catch (error) {
    res.status(404).json({ error })
  }
}

export async function desactivarHerramienta(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_herramienta, ...herramienta }: DesactivacionH = desactivacionHerramienta.parse(
      {
        cod_usuario_anulacion: req.usuario?.cod_usuario,
        ...req.body
      }
    )
    await db.transaction(async (trx) => {
      respuesta = await trx('registros.herramienta')
        .update(herramienta)
        .where({ cod_herramienta })
        .returning('cod_herramienta')
    })
    res.status(200).json({ respuesta })
  } catch (error) {
    res.status(404).json({ error })
  }
}