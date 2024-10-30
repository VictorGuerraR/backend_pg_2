import db from '#conexion'
import logger from '#logs';
import { Request, Response } from 'express';

export async function usuarios(req: Request, res: Response) {
  try {
    const respuesta = await db({ u: 'sistema.usuarios' })
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
    logger.info({
      message: 'Respuesta exitosa en catalogos:usuarios',
      labels: { code: 200, scope: 'get', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.error({
      message: 'Respuesta con error en catalogos:usuarios',
      labels: { code: 418, scope: 'get', ususario: req.usuario?.usuario, error }
    });
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
    logger.info({
      message: 'Respuesta exitosa en catalogos:tipoDepreciacion',
      labels: { code: 200, scope: 'get', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.error({
      message: 'Respuesta con error en catalogos:tipoDepreciacion',
      labels: { code: 418, scope: 'get', ususario: req.usuario?.usuario, error }
    });
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
    logger.info({
      message: 'Respuesta exitosa en catalogos:herramientas',
      labels: { code: 200, scope: 'get', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.error({
      message: 'Respuesta con error en catalogos:herramientas',
      labels: { code: 418, scope: 'get', ususario: req.usuario?.usuario, error }
    });
  }
}

export async function materiaPrima(req: Request, res: Response) {
  try {
    const respuesta = await db({ mp: 'registros.materia_prima' })
      .leftJoin({ mmp: 'registros.movimiento_materia_prima' }, 'mp.cod_materia_prima', 'mmp.cod_materia_prima')
      .select(
        'mp.cod_materia_prima',
        'mp.activo',
        'mp.descripcion',
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
    logger.info({
      message: 'Respuesta exitosa en catalogos:materiaPrima',
      labels: { code: 200, scope: 'get', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.error({
      message: 'Respuesta con error en catalogos:materiaPrima',
      labels: { code: 418, scope: 'get', ususario: req.usuario?.usuario, error }
    });
  }
}

export async function costosFijos(req: Request, res: Response) {
  try {

    const [{ costos }] = await db
      .select({
        costos:
          db.raw(`
        json_agg(
          json_build_object(
            'codigo_moneda', codigo_moneda, 
            'costo_hora', costo_hora
            )
          )
        `)
      }
      )
      .from(
        db('registros.costo_fijos as cs')
          .select(
            'cs.codigo_moneda',
            { costo_hora: db.raw('(SUM(cs.monto_total) / 720)') }
          )
          .where('cs.activo', true)
          .groupBy('cs.codigo_moneda')
          .as('subquery')
      );

    res.status(200).json(costos)
    logger.info({
      message: 'Respuesta exitosa en catalogos:costosFijos',
      labels: { code: 200, scope: 'get', ususario: req.usuario?.usuario }
    });
  } catch (error) {
    res.status(418).json({ error })
    logger.error({
      message: 'Respuesta con error en catalogos:costosFijos',
      labels: { code: 418, scope: 'get', ususario: req.usuario?.usuario, error }
    });
  }
}