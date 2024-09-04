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
  cod_detalle: number;
}

// Esquema para la creación de DetalleBien
export const creacionDetalleBien = z.object({
  cod_materia_prima: z.number(),
  cod_usuario_creacion: z.number(),
  fecha_creacion: z.date().default(() => new Date()),
  activo: z.boolean().default(true),
  monto_total: z.number(),
  codigo_unidad: z.string().default('KG'),
  unidad: z.number(),
  cod_detalle: z.number(),
});

// Esquema para la desactivación de DetalleBien
export const desactivacionDetalleBien = z.object({
  cod_materia_prima: z.number(),
  activo: z.boolean().default(false),
  cod_usuario_anulacion: z.number(),
  fecha_anulacion: z.date().default(() => new Date()),
});

// Inferir los tipos desde los esquemas si es necesario
export type CreacionDB = z.infer<typeof creacionDetalleBien>;
export type DesactivacionDB = z.infer<typeof desactivacionDetalleBien>;
