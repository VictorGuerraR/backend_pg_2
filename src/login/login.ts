import db from '#conexion'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
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

dotenv.config();
const expiresIn = process.env.JWT_EXPIRATION || '12h'
const JWT_SECRET = process.env.JWT_SECRET || ''

export async function verificarExistenciaUsuario(cod_usuario: number): Promise<boolean | null> {
  if (!cod_usuario) return null
  const { existe } = await db('registros.usuarios')
    .select({
      existe: db.raw(`
      case
        when count(*) > 0 then true
        else false
      end
      `)
    })
    .first()
    .where('activo', true)
    .where({ cod_usuario })

  return existe
}

export async function obtenerUsuario(usuario: string | null): Promise<Usuario | null> {
  if (!usuario) return null

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
    .where('activo', true)
    .where({ usuario });

  const result = await query;

  return result;
}

async function generarToken(username: string, plainTextPassword: string): Promise<string | null> {
  const userRecord = await obtenerUsuario(username);
  if (!userRecord) return null

  const { cod_usuario: userId, usuario: user, password: hashedPassword } = userRecord;

  const isPasswordValid = await bcrypt.compare(plainTextPassword, hashedPassword);
  if (isPasswordValid) {
    const token = jwt.sign({ userId, user }, JWT_SECRET, { expiresIn });
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