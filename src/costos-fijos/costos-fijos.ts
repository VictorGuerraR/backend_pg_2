import db from '#conexion'
import { Knex } from 'knex';
import { Request, Response } from 'express';
import { ActualizacionCF, actualizacionCostoFijo, CreacionCF, creacionCostoFijo, DesactivacionCF, desactivacionCostoFijo } from '#types/costosFijos';


function whereCostosFijos(params: any, query: Knex.QueryBuilder, prefix: string): Knex.QueryBuilder {
  return query
}


const consultaCostosFijos = () => db({ cf: 'registros.costo_fijos' })
  .innerJoin({ uc: 'registros.usuarios' }, 'uc.cod_usuario', 'cf.cod_usuario_creacion')
  .select(
    { usuario_creacion: db.raw("concat(uc.nombres, ' ', uc.apellidos)") },

  )


export async function obtenerCostosFijos(req: Request, res: Response) {
  try {
    let respuesta

    res.status(200).json({ respuesta })
  } catch (error) {
    res.status(500).json({ error })
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
    res.status(200).json({ respuesta })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export async function actualizarCostosFijos(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_costo_fijo, ...costoFijo }: ActualizacionCF = actualizacionCostoFijo.parse(req.body)
    await db.transaction(async (trx) => {
      respuesta = await trx('registros.costo_fijos')
        .insert(costoFijo)
        .where({ cod_costo_fijo })
        .returning('cod_costo_fijo')
    })
    res.status(200).json({ respuesta })
  } catch (error) {
    res.status(500).json({ error })
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
        .insert(costoFijo)
        .where({ cod_costo_fijo })
        .returning('cod_costo_fijo')
    })
    res.status(200).json({ respuesta })
  } catch (error) {
    res.status(500).json({ error })
  }
}