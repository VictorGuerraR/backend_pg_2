import dotenv from 'dotenv';
import { obtenerUsuario } from '@login/login'
import { verify, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || ''

const verificarToken = async (token: string | undefined): Promise<JwtPayload | null> => {
  if (!token) return null;
  try {
    const decodedToken = verify(token, JWT_SECRET) as JwtPayload;
    const { cod_usuario } = decodedToken;

    if (cod_usuario) {
      const usuario = await obtenerUsuario(cod_usuario, null);
      if (usuario) {
        return decodedToken;
      }
    }
  } catch (error) {
    console.error('Token verification failed:', error);
  }

  return null;
};

export async function middleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; // Asume que el token está en el formato "Bearer TOKEN"
    const decodedToken = await verificarToken(token);

    if (decodedToken) {
      req.usuario = await obtenerUsuario(decodedToken.cod_usuario, null);
      return next();
    }

    res.status(401).send({ error: 'Token inválido o no proporcionado' });
  } catch (err) {
    res.status(500).send({ error: 'Error interno del servidor' });
  }
}
