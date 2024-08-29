import { z } from 'zod';

export const creacionMovimientoMateriaPrima = z.object({
  cod_registro_materia_prima: z.number(),
  cod_materia_prima: z.number(),
  cod_usuario_creacion: z.number(),
  fecha_creacion: z.date().default(() => new Date()),
  cantidad: z.number()
})

export type MovimientoMateriaPrima = z.infer<typeof creacionMovimientoMateriaPrima>
