import express from 'express';
import request from 'supertest';
import graficas from '#graficas/router'
import { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());
app.use(graficas)

jest.mock('#login/middleware', () => ({
  middleware: (req: Request, res: Response, next: NextFunction) => {
    req.usuario = {
      cod_usuario: 1,
      fecha_creacion: new Date(),
      nombres: "test nombre",
      apellidos: "test apellido",
      usuario: "nombre.apellido",
      password: "test",
      activo: true,
    }; // Mock de usuario
    next(); // Llama a next() para continuar con la ruta
  },
}));

describe('Graficas API', () => {
  it('should return a list stats', async () => {
    const response = await request(app).get('/graficas-1');
    expect(response.status).toBe(200);
  });
});