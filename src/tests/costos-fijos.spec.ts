import app from '../index';
import request from 'supertest';
import { Request, Response, NextFunction } from 'express';

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

describe('Costos Fijos API', () => {
  it('should return a list of fixed costs', async () => {
    const response = await request(app).get('/costos-fijos');
    expect(response.status).toBe(200);
    console.log(response)
    expect(Array.isArray(response.body?.respuesta));
  });

  it('should create a new fixed cost', async () => {
    const newCost = { descripcion: "test", monto_total: 100 };
    const response = await request(app).post('/costos-fijos').send(newCost);
    expect(response.status).toBe(200);
  });

  it('should update an existing fixed cost', async () => {
    const updatedCost = { cod_costo_fijo: 1, descripcion: "test", monto_total: 100 };
    const response = await request(app).patch('/costos-fijos').send(updatedCost);
    expect(response.status).toBe(200);
  });

  it('should deactivate a fixed cost', async () => {
    const response = await request(app).delete('/costos-fijos').send({ cod_costo_fijo: 1 });
    expect(response.status).toBe(200);
  });
});