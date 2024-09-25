import { z } from "zod";

export type DetalleBien = {
  cod_detalle_bien: number;
  cod_materia_prima: number;
  cod_usuario_creacion: number;
  fecha_creacion: Date;
  activo: boolean;
  cod_usuario_anulacion: number | null;
  fecha_anulacion: Date | null;
  codigo_moneda: string;
  monto_total: number;
  codigo_unidad: string;
  unidad: number;
  cod_maestro: number;
}

// Esquema para la creación de DetalleBien
export const creacionDetalleBien = z.object({
  descripcion: z.string(),
  cod_materia_prima: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cod_usuario_creacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  fecha_creacion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
  activo: z.boolean().default(true),
  monto_total: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  codigo_unidad: z.string().default('KG'),
  unidad: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cod_maestro: z.union([z.string(), z.number()]).transform((val) => Number(val)),
});

// Esquema para la desactivación de DetalleBien
export const desactivacionDetalleBien = z.object({
  cod_detalle_bien: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  activo: z.boolean().default(false),
  cod_usuario_anulacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  fecha_anulacion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
});

// Inferir los tipos desde los esquemas si es necesario
export type CreacionDB = z.infer<typeof creacionDetalleBien>;
export type DesactivacionDB = z.infer<typeof desactivacionDetalleBien>;
