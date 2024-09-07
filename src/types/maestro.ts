import { z } from "zod";

export type Maestro = {
  cod_maestro: number;
  cod_usuario_creacion: number;
  fecha_creacion: Date;
  activo: boolean;
  cod_usuario_anulacion?: number;
  fecha_anulacion?: Date;
  codigo_moneda: string;
  monto_total?: number;
  porcentaje_impuesto?: number;
  monto_impuesto?: number;
  precio_kw?: number;
  monto_ganacia?: number;
  porcentaje_ganacia?: number;
}

export const creacionMaestro = z.object({
  cod_usuario_creacion: z.number(),
  fecha_creacion: z.date().default(() => new Date()),
  activo: z.boolean().default(true),
  monto_total: z.number(),
  porcentaje_impuesto: z.number().default(5),
  monto_impuesto: z.number().default(0),
  precio_kw: z.number().default(1),
  monto_ganacia: z.number().default(25),
  porcentaje_ganancia: z.number().default(0)
});

export const desactivacionMaestro = z.object({
  cod_maestro: z.number(),
  activo: z.boolean().default(false),
  cod_usuario_anulacion: z.number().nullable(),
  fecha_anulacion: z.date().default(() => new Date()),
});

// Inferir los tipos desde los esquemas si es necesario
export type CreacionM = z.infer<typeof creacionMaestro>;
export type DesactivacionM = z.infer<typeof desactivacionMaestro>;

