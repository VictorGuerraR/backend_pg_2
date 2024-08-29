import db from '#conexion'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express';
import {
  Usuario,
  Creacion,
  Actualizacion,
  Desactivacion,
  creacionUsuario,
  actualizacionUsuario,
  desactivacionUsuario
} from '#types/usuarios';

export async function obtenerUsuario(cod_usuario: number | null, usuario: string | null): Promise<Usuario | null> {
  if (!cod_usuario && !usuario) {
    return null; // Devuelve null o lanza un error si ambos son nulos
  }

  const query = db('registros.usuarios')
    .select(
      'cod_usuario',
      'fecha_creacion',
      'nombres',
      'apellidos',
      'usuario',
      'password',
      'activo',
    )
    .first()
    .where('activo', true);

  if (cod_usuario) {
    query.where({ cod_usuario });
  } else if (usuario) {
    query.where({ usuario });
  }

  return await query;
}

async function generarToken(usuario: string, pass: string): Promise<string | null> {
  const usuarioData = await obtenerUsuario(null, usuario);

  if (!usuarioData) { return null }

  const { cod_usuario, password } = usuarioData;

  const passwordMatch = await bcrypt.compare(pass, password);
  if (passwordMatch) {
    const token = jwt.sign({ cod_usuario }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRATION || '12h' });
    return token;
  }

  return null;
}

export async function token(req: Request, res: Response): Promise<any> {
  try {
    const { usuario, password } = req.body
    const token = await generarToken(usuario, password)
    res.status(200).json({ token })
  } catch (err) {
    res.status(500).json()
  }
}

export async function creacion(req: Request, res: Response) {
  try {
    let respuesta
    const usuario: Creacion = creacionUsuario.parse(req.body)
    await db.transaction(async (trx) => {
      usuario.password = await bcrypt.hash(usuario.password, 10)
      usuario.usuario = `${usuario.nombres.replace(/\s+/g, '').toLowerCase()}.${usuario.apellidos.replace(/\s+/g, '').toLowerCase()}`
      respuesta = await trx('registros.usuarios')
        .insert(usuario)
        .returning('*')
    })
    res.status(200).json({ respuesta })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export async function actualizacion(req: Request, res: Response) {
  try {
    const { cod_usuario, ...usuario }: Actualizacion = actualizacionUsuario.parse(req.body)
    await db.transaction(async (trx) => {
      await trx('registros.usuarios')
        .update(usuario)
        .where({ cod_usuario })
    })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export async function deshabilitar(req: Request, res: Response) {
  try {
    const { cod_usuario, ...usuario }: Desactivacion = desactivacionUsuario.parse(req.body)
    await db.transaction(async (trx) => {
      await trx('registros.usuarios')
        .update(usuario)
        .where({ cod_usuario })
    })
  } catch (error) {
    res.status(500).json({ error })
  }
}