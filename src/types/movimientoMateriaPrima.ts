import { z } from 'zod';

export const creacionMovimientoMateriaPrima = z.object({
  cod_detalle_bien: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cod_materia_prima: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  activo: z.boolean().default(true),
  cod_usuario_creacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  fecha_creacion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
  cantidad: z.union([z.string(), z.number()]).transform((val) => Number(val))
})

export const desactivacionMovimientoMateriaPrima = z.object({
  cod_detalle_bien: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  activo: z.boolean().default(false),
  cod_usuario_anulacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  fecha_anulacion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
})

export type CreacionMovimientoMP = z.infer<typeof creacionMovimientoMateriaPrima>
export type DesactivacionMovimientoMP = z.infer<typeof desactivacionMovimientoMateriaPrima>
