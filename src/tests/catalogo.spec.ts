import express from 'express';
import request from 'supertest';
import catalogos from '#catalogos/router'
import { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());
app.use(catalogos)

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

describe('Catalogos API', () => {
  describe('GET /catalogo/usuarios', () => {
    it('should return a list of users', async () => {
      const response = await request(app).get('/catalogo/usuarios');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /catalogo/tipoDepreciacion', () => {
    it('should return a list of depreciation types', async () => {
      const response = await request(app).get('/catalogo/tipoDepreciacion');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /catalogo/herramientas', () => {
    it('should return a list of tools', async () => {
      const response = await request(app).get('/catalogo/herramientas');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /catalogo/materiasPrimas', () => {
    it('should return a list of raw materials', async () => {
      const response = await request(app).get('/catalogo/materiasPrimas');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /catalogo/costosFijos', () => {
    it('should return fixed costs', async () => {
      const response = await request(app).get('/catalogo/costosFijos');

      expect(response.status).toBe(200);
    });
  });
});
