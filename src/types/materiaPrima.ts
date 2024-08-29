import { z } from "zod";

// Define el esquema para creacionMateriaPrima
export const creacionMateriaPrima = z.object({
  cod_materia_prima: z.number(),
  cod_usuario_creacion: z.number(),
  fecha_creacion: z.date().default(() => new Date()),
  descripcion: z.string(),
  codigo_moneda: z.string(),
  monto: z.number(),
  cantidad: z.number(),
  codigo_unidad: z.string(),
});

export type CreacionMateriaPrima = z.infer<typeof creacionMateriaPrima>;
