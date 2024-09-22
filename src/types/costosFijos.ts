import { z } from "zod";

export type CostoFijo = {
  cod_costo_fijo: number;
  cod_usuario_creacion: number;
  fecha_creacion: Date;
  activo: boolean;
  cod_usuario_anulacion?: number;
  fecha_anulacion?: Date;
  descripcion: string;
  codigo_moneda: string;
  monto_total?: number;
}

export const creacionCostoFijo = z.object({
  cod_usuario_creacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  descripcion: z.string(),
  fecha_creacion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
  activo: z.boolean().default(true),
  codigo_moneda: z.string().default('GTQ'),
  monto_total: z.union([z.string(), z.number()]).transform((val) => Number(val)).default(0)
})

export const actualizacionCostoFijo = z.object({
  cod_costo_fijo: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  descripcion: z.string(),
  monto_total: z.union([z.string(), z.number()]).transform((val) => Number(val)).default(0)
})

export const desactivacionCostoFijo = z.object({
  cod_costo_fijo: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cod_usuario_anulacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  fecha_anulacion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
  activo: z.boolean().default(false),
})

export type CreacionCF = z.infer<typeof creacionCostoFijo>
export type ActualizacionCF = z.infer<typeof actualizacionCostoFijo>
export type DesactivacionCF = z.infer<typeof desactivacionCostoFijo>