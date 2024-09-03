import { z } from "zod";

export type DetalleServicio = {
  cod_detalle_servicio: number;
  cod_herramienta: number;
  cod_usuario_creacion: number;
  fecha_creacion: Date;
  activo: boolean;
  cod_usuario_anulacion: number | null;
  fecha_anulacion: Date | null;
  codigo_moneda: string;
  tiempo_uso: number;
  unidad: number;
  monto_total: number;
  cod_detalle: number;
}

// Esquema para la creación de DetalleServicio
export const creacionDetalleServicio = z.object({
  cod_herramienta: z.number(),
  cod_usuario_creacion: z.number(),
  fecha_creacion: z.date().default(() => new Date()),
  activo: z.boolean().default(true),
  tiempo_uso: z.number(),
  unidad: z.string().default("H"),
  monto_total: z.number(),
  cod_detalle: z.number(),
});

// Esquema para la desactivación de DetalleServicio
export const desactivacionDetalleServicio = z.object({
  cod_detalle_servicio: z.number(),
  activo: z.boolean().default(false),
  cod_usuario_anulacion: z.number().nullable(),
  fecha_anulacion: z.date().default(() => new Date()),
});

// Inferir los tipos desde los esquemas si es necesario
export type CreacionDS = z.infer<typeof creacionDetalleServicio>;
export type DesactivacionDS = z.infer<typeof desactivacionDetalleServicio>;