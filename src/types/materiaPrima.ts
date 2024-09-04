import { z } from "zod";

// Define el esquema para creacionMateriaPrima
export const creacionMateriaPrima = z.object({
  cod_usuario_creacion: z.number(),
  fecha_creacion: z.date().default(() => new Date()),
  descripcion: z.string(),
  codigo_moneda: z.string().default('GTQ'),
  monto: z.number(),
  activo: z.boolean().default(true),
  cantidad: z.number(),
  codigo_unidad: z.string().default('KG'),
});

// Define el esquema para creacionMateriaPrima
export const actualizacionMateriaPrima = z.object({
  cod_materia_prima: z.number(),
  descripcion: z.string(),
  monto: z.number(),
  cantidad: z.number(),
});

// Define el esquema para creacionMateriaPrima
export const desactivacionMateriaPrima = z.object({
  cod_materia_prima: z.number(),
  cod_usuario_anulacion: z.number(),
  fecha_anulacion: z.date().default(() => new Date()),
  activo: z.boolean().default(false)
});

export type CreacionMP = z.infer<typeof creacionMateriaPrima>;
export type ActualizacionMP = z.infer<typeof actualizacionMateriaPrima>;
export type DesactivacionMP = z.infer<typeof desactivacionMateriaPrima>;
