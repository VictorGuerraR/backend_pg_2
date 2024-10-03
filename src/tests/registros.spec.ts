import express from 'express';
import request from 'supertest';
import registros from '#registros/router';
import { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());
app.use(registros);

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

const endpointBase = '/registros-maestro';
describe('Pruebas de Maestro', () => {
  // Prueba para obtener todos los registros maestros
  it('GET ' + endpointBase, async () => {
    const res = await request(app).get(endpointBase).query({ page: 1, limit: 10 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('respuesta'); // Verifica que la respuesta tenga la propiedad 'respuesta'
  });

  // Prueba para obtener el encabezado de maestro
  it('GET ' + endpointBase + '/encabezado', async () => {
    const res = await request(app).get(`${endpointBase}/encabezado`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array); // Verifica que el encabezado sea un array
  });

  // Prueba para crear un nuevo maestro
  it('POST ' + endpointBase, async () => {
    const nuevoMaestro = {
      cod_usuario_creacion: 1, // Cambia esto si es necesario
      descripcion: 'Nuevo Maestro',
      monto_ganacia: 1000,
      monto_impuesto: 200,
      monto_total: 1200,
      porcentaje_ganancia: 10,
      porcentaje_impuesto: 5,
      precio_kw: 200,
    };

    const res = await request(app).post(endpointBase).send(nuevoMaestro);
    expect(res.status).toBe(200);
    expect(res.body?.[0]).toHaveProperty('cod_maestro'); // Verifica que se devuelva el 'cod_maestro'
  });

  // Prueba para actualizar un maestro existente
  it('PATCH ' + endpointBase, async () => {
    const actualizarMaestro = {
      cod_maestro: 1, // Cambia este ID por uno existente en tu base de datos
      descripcion: 'Maestro Actualizado',
      monto_ganacia: 1500,
    };

    const res = await request(app).patch(endpointBase).send(actualizarMaestro);
    expect(res.status).toBe(200);
    expect(res.body?.[0]).toHaveProperty('cod_maestro'); // Verifica que se devuelva el 'cod_maestro'
  });

  // Prueba para desactivar un maestro
  it('DELETE ' + endpointBase, async () => {
    const desactivarMaestro = {
      cod_maestro: 1, // Cambia este ID por uno existente en tu base de datos
      cod_usuario_anulacion: 1, // Cambia esto si es necesario
    };

    const res = await request(app).delete(endpointBase).send(desactivarMaestro);
    expect(res.status).toBe(200);
    expect(res.body?.[0]).toHaveProperty('cod_maestro'); // Verifica que se devuelva el 'cod_maestro'
  });
});

describe('Pruebas de Detalle Bien', () => {
  const detalleBienEndpoint = `${endpointBase}/bien`;

  it('GET ' + detalleBienEndpoint, async () => {
    const res = await request(app).get(detalleBienEndpoint).query({ cod_maestro: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array); // Verifica que la respuesta sea un array
  });

  it('POST ' + detalleBienEndpoint, async () => {
    const nuevoDetalleBien = {
      cod_maestro: 1,
      cod_materia_prima: 1,
      cod_usuario_creacion: 1, // Cambia esto si es necesario
      descripcion: 'Nuevo Detalle Bien',
      unidad: 10,
      codigo_unidad: 'KG',
      monto_total: 1000,
    };

    const res = await request(app).post(detalleBienEndpoint).send(nuevoDetalleBien);
    expect(res.status).toBe(200);
    expect(res.body?.[0]).toHaveProperty('cod_detalle_bien'); // Verifica que se devuelva el 'cod_detalle_bien'
  });

  it('DELETE ' + detalleBienEndpoint, async () => {
    const desactivarDetalleBien = {
      cod_detalle_bien: 1, // Cambia este ID por uno existente en tu base de datos
      cod_usuario_anulacion: 1, // Cambia esto si es necesario
    };

    const res = await request(app).delete(detalleBienEndpoint).send(desactivarDetalleBien);
    expect(res.status).toBe(200);
    expect(res.body?.[0]).toHaveProperty('cod_detalle_bien'); // Verifica que se devuelva el 'cod_detalle_bien'
  });
});

describe('Pruebas de Detalle Servicio', () => {
  const detalleServicioEndpoint = `${endpointBase}/servicio`;

  it('GET ' + detalleServicioEndpoint, async () => {
    const res = await request(app).get(detalleServicioEndpoint).query({ cod_maestro: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array); // Verifica que la respuesta sea un array
  });

  it('POST ' + detalleServicioEndpoint, async () => {
    const nuevoDetalleServicio = {
      cod_maestro: 1,
      cod_herramienta: 1,
      cod_usuario_creacion: 1, // Cambia esto si es necesario
      descripcion: 'Nuevo Detalle Servicio',
      monto_total: 500,
      tiempo_uso: 10,
      total_consumo_energetico: 10,
      total_depreciacion: 10,
      total_horas_servicio: 10
    };

    const res = await request(app).post(detalleServicioEndpoint).send(nuevoDetalleServicio);
    expect(res.status).toBe(200);
    expect(res.body?.[0]).toHaveProperty('cod_detalle_servicio'); // Verifica que se devuelva el 'cod_detalle_servicio'
  });

  it('DELETE ' + detalleServicioEndpoint, async () => {
    const desactivarDetalleServicio = {
      cod_detalle_servicio: 1, // Cambia este ID por uno existente en tu base de datos
      cod_usuario_anulacion: 1, // Cambia esto si es necesario
    };

    const res = await request(app).delete(detalleServicioEndpoint).send(desactivarDetalleServicio);
    expect(res.status).toBe(200);
    expect(res.body?.[0]).toHaveProperty('cod_detalle_servicio'); // Verifica que se devuelva el 'cod_detalle_servicio'
  });
});