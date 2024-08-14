import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import db from '../db/db'

const vencimiento = '12h';

function obtenerUsuario(cod_usuario: number | null, usuario: string | null): any {
  const query = db('registros.usuarios')
    .select(
      'cod_usuario',
      'fecha_creacion',
      'nombres',
      'apellidos',
      'pass',
      'activo',
      'fecha_inactivacion',
    )

  if (cod_usuario) {
    query.where({ cod_usuario })
  } else {
    query.where({ usuario })
  }

  return query
}


async function generarToken(usuario: string, pass: string): Promise<string | null> {

  const {
    cod_usuario,
    password
  } = await obtenerUsuario(null, usuario)

  if (await bcrypt.compare(pass, password)) {
    const token = jwt.sign({ cod_usuario }, password, { expiresIn: vencimiento })
    return token
  }
  return null
}

export async function login(req: any, res: any): Promise<any> {
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

const verificarToken = async (token: any): Promise<any> => {
  if (!token) return false

  const decodedToken = jwt.decode(token);

  if (decodedToken && typeof decodedToken !== 'string') {
    const { cod_usuario } = decodedToken as JwtPayload;
    if (cod_usuario) {
      const usuario = await obtenerUsuario(cod_usuario, null)

      const valido = jwt.verify(token, usuario?.password)
      if (valido) return valido
    }
  }

  return false;
}

export async function middleware(req: any, res: any, next: any): Promise<any> {
  try {
    const { cod_usuario } = await verificarToken(req.headers.token)
    if (cod_usuario) {
      req.usuario = await obtenerUsuario(cod_usuario, null)
      return next()
    }
    res.status(404).send();
  } catch (err) {
    res.status(500).send()
  }
}
