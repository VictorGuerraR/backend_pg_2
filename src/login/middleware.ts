import dotenv from 'dotenv';
import logger from '#logs';
import { verify, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { obtenerUsuario, verificarExistenciaUsuario } from '#login/login';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || ''

const verificarToken = async (token: string | undefined): Promise<JwtPayload | null> => {
  if (!token) return null;
  try {
    const decodedToken = verify(token, JWT_SECRET) as JwtPayload;
    const { userId } = decodedToken;

    if (userId && await verificarExistenciaUsuario(userId)) {
      return decodedToken;
    }
  } catch (error) {
    logger.error({
      message: 'Token verification failed',
      labels: { scope: 'post', error }
    });
  }

  return null;
};

export async function middleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : req.headers.authorization;
    if (!token) {
      res.status(401).send('No token provided');
      return
    }

    const decodedToken = await verificarToken(token);

    if (decodedToken) {
      req.usuario = await obtenerUsuario(decodedToken.user);
      return next();
    }

    res.status(401).send({ error: 'Token inválido o no proporcionado' });
  } catch (err) {
    res.status(500).send({ error: 'Error interno del servidor' });
  }
}
