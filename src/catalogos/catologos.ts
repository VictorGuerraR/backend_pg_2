import db from '#conexion'
import { Request, Response } from 'express';

export async function usuarios(req: Request, res: Response) {
  try {
    const respuesta = await db({ u: 'registros.usuarios' })
      .select(
        'u.cod_usuario',
        'u.nombres',
        'u.apellidos',
        'u.usuario',
        'u.activo',
        { inactivo: db.raw('not u.activo') },
        { nombre_completo: db.raw("concat(u.nombres, ' ' ,	u.apellidos)") }
      )
    // .where('u.activo', true)

    res.status(200).json(respuesta)
    console.log({ code: 200, message: 'Respuesta exitosa en catalogos:usuarios', scope: 'get' })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}

export async function tipoDepreciacion(req: Request, res: Response) {
  try {
    const respuesta = await db({ pd: 'registros.porcentajes_depreciacion' })
      .select(
        'pd.cod_tipo_depreciacion',
        'pd.descripcion',
        'pd.porcentaje_depreciacion_anual'
      )

    res.status(200).json(respuesta)
    console.log({ code: 200, message: 'Respuesta exitosa en catalogos:tipoDepreciacion', scope: 'get' })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}

export async function herramientas(req: Request, res: Response) {
  try {
    const respuesta = await db({ h: 'registros.herramienta' })
      .innerJoin({ pd: 'registros.porcentajes_depreciacion' }, 'pd.cod_tipo_depreciacion', 'h.cod_tipo_depreciacion')
      .select(
        'h.cod_herramienta',
        'h.cod_tipo_depreciacion',
        { inactivo: db.raw('not h.activo') },
        'h.activo',
        'h.descripcion',
        'h.codigo_moneda',
        'h.monto',
        'h.consumo_electrico',
        'pd.porcentaje_depreciacion_anual'
      )
    // .where('h.activo', true)

    res.status(200).json(respuesta)
    console.log({ code: 200, message: 'Respuesta exitosa en catalogos:herramientas', scope: 'get' })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}

export async function materiaPrima(req: Request, res: Response) {
  try {
    const respuesta = await db({ mp: 'registros.materia_prima' })
      .leftJoin({ mmp: 'registros.movimiento_materia_prima' }, 'mp.cod_materia_prima', 'mmp.cod_materia_prima')
      .select(
        'mp.cod_materia_prima',
        'mp.activo',
        { inactivo: db.raw('not mp.activo') },
        'mp.codigo_moneda',
        'mp.monto',
        'mp.cantidad',
        'mp.codigo_unidad',
        { existencia: db.raw('(mp.cantidad - (sum((coalesce(mmp.cantidad,0)))))') }
      )
      // .where('mp.activo', true)
      .groupBy('mp.cod_materia_prima')
      .orderBy('mp.cod_materia_prima', 'desc')

    res.status(200).json(respuesta)
    console.log({ code: 200, message: 'Respuesta exitosa en catalogos:materiaPrima', scope: 'get' })
  } catch (error) {
    console.log(error)
    res.status(418).json({ error })
  }
}