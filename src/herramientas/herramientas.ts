import db from '#conexion'
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
import { Knex } from 'knex';


function whereHerramientas(params: any, query: Knex, prefix: string): Knex {
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
      case 'monto':
        query.where(`${prefix}.${value}`)
        break;
      case 'fecha_anulacion':
      case 'fecha_creacion':
        break;
      case 'descripcion':
        query.whereILike(`${prefix}.${value}`)
        break;

      default:
        break;
    }
  }

  return query
}


export async function obtenerHerramientas(req: Request, res: Response) {
  try {

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