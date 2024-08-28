import db from '#conexion'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Usuario } from '#types/usuarios';
import { Request, Response } from 'express';


const vencimiento = '12h';

export async function obtenerUsuario(cod_usuario: number | null, usuario: string | null): Promise<Usuario> {
  const query = db('registros.usuarios')
    .select(
      'cod_usuario',
      'fecha_creacion',
      'nombres',
      'apellidos',
      'password',
      'activo',
      'fecha_inactivacion',
    )
    .first()

  if (cod_usuario) {
    query.where({ cod_usuario })
  } else {
    query.where({ usuario })
  }

  return await query
}

async function generarToken(usuario: string, pass: string): Promise<string | null> {
  const {
    cod_usuario,
    password
  } = obtenerUsuario(null, usuario)

  if (await bcrypt.compare(pass, password)) {
    const token = jwt.sign({ cod_usuario }, password, { expiresIn: vencimiento })
    return token
  }
  return null
}

export async function login(req: Request, res: Response): Promise<any> {
  try {
    const {
      usuario,
      password
    } = req.body

    const token = await generarToken(usuario, password)

    if (token) {
      res.json({ token })
    } else {
      res.status(403).json({})
    }
  } catch (err) {
    res.status(500).json()
  }
}

export async function creacionUsuario(req: Request, res: Response) {

}

export async function deshabilitarUsuario(req: Request, res: Response) {

}

export async function actualizacionUsuario(req: Request, res: Response) {

}