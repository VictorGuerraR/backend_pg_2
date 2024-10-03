import express from 'express';
import request from 'supertest';
import materiasPrimas from '#materiasPrimas/router'
import { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());
app.use(materiasPrimas)

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

describe('Pruebas de endpoints de materias primas', () => {
  const mockMateriaPrima = {
    cod_usuario_creacion: 1,
    descripcion: 'Materia Prima de prueba',
    monto: 100,
    cantidad: 10,
    codigo_moneda: 'GTQ',
    codigo_unidad: 'KG',
  };

  const mockActualizarMateriaPrima = {
    cod_materia_prima: 1,
    descripcion: 'Materia Prima actualizada',
    monto: 150,
    cantidad: 20,
  };

  const mockDesactivacionMateriaPrima = {
    cod_materia_prima: 1,
    cod_usuario_anulacion: 1,
    activo: false,
    fecha_anulacion: new Date(),
  };

  test('GET /materias-primas - Respuesta exitosa (200)', async () => {
    const response = await request(app)
      .get('/materias-primas')
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body?.respuesta).toBeDefined();
  });

  test('POST /materias-primas - Respuesta exitosa (200)', async () => {
    const response = await request(app)
      .post('/materias-primas')
      .send(mockMateriaPrima);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body?.[0]).toHaveProperty('cod_materia_prima');
  });

  test('PATCH /materias-primas - Respuesta exitosa (200)', async () => {
    const response = await request(app)
      .patch('/materias-primas')
      .send(mockActualizarMateriaPrima);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body?.[0]).toHaveProperty('cod_materia_prima');
  });

  test('DELETE /materias-primas - Respuesta exitosa (200)', async () => {
    const response = await request(app)
      .delete('/materias-primas')
      .send(mockDesactivacionMateriaPrima);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body?.[0]).toHaveProperty('cod_materia_prima');
  });
});