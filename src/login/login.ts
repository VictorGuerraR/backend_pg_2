import db from '#conexion';
import logger from '#logs';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express';
import {
  Usuario,
  CreacionU,
  ActualizacionU,
  DesactivacionU,
  creacionUsuario,
  actualizacionUsuario,
  desactivacionUsuario
} from '#types/usuarios';

dotenv.config();
const expiresIn = process.env.JWT_EXPIRATION || '12h'
const JWT_SECRET = process.env.JWT_SECRET || ''

export async function verificarExistenciaUsuario(cod_usuario: number): Promise<boolean | null> {
  if (!cod_usuario) return null
  const { existe } = await db('sistema.usuarios')
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

export async function obtenerUsuario(usuario: string): Promise<Usuario | null> {
  if (!usuario) return null

  const record: Usuario = await db('sistema.usuarios')
    .select('cod_usuario', 'fecha_creacion', 'nombres', 'apellidos', 'usuario', 'password', 'activo',)
    .where('activo', true)
    .where({ usuario })
    .first()

  return record;
}

async function generarToken(username: string, plainTextPassword: string): Promise<string | null> {
  const userRecord = await obtenerUsuario(username);
  if (!userRecord) return null

  const { cod_usuario: userId, usuario: user, password: hashedPassword } = userRecord;
  if (await bcrypt.compare(plainTextPassword, hashedPassword)) {
    const token = jwt.sign({ userId, user }, JWT_SECRET, { expiresIn });
    return token;
  }

  return null;
}

export async function token(req: Request, res: Response): Promise<any> {
  try {
    const { username, password } = req.body
    const token = await generarToken(username, password)
    if (token) {
      const usuarioRecord = await obtenerUsuario(username);
      if (usuarioRecord) {
        const { nombres, apellidos, usuario } = usuarioRecord
        res.status(200).json({ token, usuario: { nombres, apellidos, usuario } })
        logger.info({
          message: 'Token servido',
          labels: { scope: 'post', code: 200 }
        });

      } else {
        res.status(401).json({ error: { usuario: 'No se encontro usuario activo' } })
        logger.error({
          message: 'No se encontro usuario activo',
          labels: { scope: 'post', code: 401 }
        });
        
      }
    } else {
      res.status(401).json({ error: { usuario: 'No se encontro usuario activo' } })
      logger.error({
        message: 'No se encontro usuario activo',
        labels: { scope: 'post', code: 401 }
      });
      
    }
  } catch (error) {
    logger.error({
      message: 'Token verification failed',
      labels: { scope: 'post', error }
    });
    res.status(500).json({ error })
  }
}

export async function creacion(req: Request, res: Response) {
  try {
    let respuesta
    const usuario: CreacionU = creacionUsuario.parse(req.body)
    await db.transaction(async (trx) => {
      usuario.password = await bcrypt.hash(usuario.password, 10)
      usuario.usuario = `${usuario.nombres.replace(/\s+/g, '').toLowerCase()}.${usuario.apellidos.replace(/\s+/g, '').toLowerCase()}`
      respuesta = await trx('sistema.usuarios')
        .insert(usuario)
        .returning('cod_usuario')
    })
    res.status(200).json({ respuesta })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}

export async function actualizacion(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_usuario, ...usuario }: ActualizacionU = actualizacionUsuario.parse(req.body)
    await db.transaction(async (trx) => {
      usuario.password = await bcrypt.hash(usuario.password, 10)
      respuesta = await trx('sistema.usuarios')
        .update(usuario)
        .where({ cod_usuario })
        .returning('cod_usuario')
    })
    res.status(200).json({ respuesta })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}

export async function deshabilitar(req: Request, res: Response) {
  try {
    let respuesta
    const { cod_usuario, ...usuario }: DesactivacionU = desactivacionUsuario.parse(req.body)
    await db.transaction(async (trx) => {
      respuesta = await trx('sistema.usuarios')
        .update(usuario)
        .where({ cod_usuario })
        .returning('cod_usuario')
    })
    res.status(200).json({ respuesta })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}