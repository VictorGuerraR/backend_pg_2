import { z } from "zod";

// Define el esquema para creacionMateriaPrima
export const creacionMateriaPrima = z.object({
  cod_usuario_creacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  fecha_creacion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
  descripcion: z.string(),
  codigo_moneda: z.string().default('GTQ'),
  monto: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  activo: z.boolean().default(true),
  cantidad: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  codigo_unidad: z.string().default('KG'),
});

// Define el esquema para creacionMateriaPrima
export const actualizacionMateriaPrima = z.object({
  cod_materia_prima: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  descripcion: z.string(),
  monto: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cantidad: z.union([z.string(), z.number()]).transform((val) => Number(val)),
});

// Define el esquema para creacionMateriaPrima
export const desactivacionMateriaPrima = z.object({
  cod_materia_prima: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cod_usuario_anulacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  fecha_anulacion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
  activo: z.boolean().default(false)
});

export type CreacionMP = z.infer<typeof creacionMateriaPrima>;
export type ActualizacionMP = z.infer<typeof actualizacionMateriaPrima>;
export type DesactivacionMP = z.infer<typeof desactivacionMateriaPrima>;
