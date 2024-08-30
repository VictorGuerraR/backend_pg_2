import { Usuario } from '#types/usuarios';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      usuario?: Usuario | null;
    }
  }
}
