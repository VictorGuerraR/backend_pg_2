import { z } from 'zod';

export const creacionMovimientoMateriaPrima = z.object({
  cod_registro_materia_prima: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cod_materia_prima: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cod_usuario_creacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  fecha_creacion: z.date().default(() => new Date()),
  cantidad: z.union([z.string(), z.number()]).transform((val) => Number(val))
})

export type MovimientoMP = z.infer<typeof creacionMovimientoMateriaPrima>
