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

describe('Pruebas de endpoints de herramientas', () => {
  const mockHerramienta = {
    cod_tipo_depreciacion: 1,
    cod_usuario_creacion: 1,
    cod_usuario_responsable: 1,
    consumo_electrico: 100,
    descripcion: 'Herramienta de prueba',
    fecha_creacion: new Date(),
    fecha_adquisicion: new Date(),
    monto: 1000,
  };

  const mockActualizarHerramienta = {
    cod_herramienta: 1,
    cod_tipo_depreciacion: 1,
    consumo_electrico: 150,
    descripcion: 'Herramienta actualizada',
    fecha_adquisicion: new Date(),
    monto: 1200,
  };

  const mockDesactivacionHerramienta = {
    cod_herramienta: 1,
    cod_usuario_anulacion: 1,
    activo: false,
    fecha_anulacion: new Date(),
  };

  test('GET /herramientas - Respuesta exitosa (200)', async () => {
    const response = await request(app)
      .get('/herramientas')
      .query({ page: 1, limit: 10 })
    // .expect(200);
    expect(response.status).toBe(200)
    expect(response.body?.respuesta).toBeDefined();
  });

  test('POST /herramientas - Respuesta exitosa (200)', async () => {
    const response = await request(app)
      .post('/herramientas')
      .send(mockHerramienta)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body?.[0]).toHaveProperty('cod_herramienta');
  });

  test('PATCH /herramientas - Respuesta exitosa (200)', async () => {
    const response = await request(app)
      .patch('/herramientas')
      .send(mockActualizarHerramienta)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body?.[0]).toHaveProperty('cod_herramienta');
  });

  test('DELETE /herramientas - Respuesta exitosa (200)', async () => {
    const response = await request(app)
      .delete('/herramientas')
      .send(mockDesactivacionHerramienta)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body?.[0]).toHaveProperty('cod_herramienta');
  });
});
