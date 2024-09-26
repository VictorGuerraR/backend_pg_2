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
  codigo_tiempo_uso: number;
  monto_total: number;
  cod_maestro: number;
}

// Esquema para la creación de DetalleServicio
export const creacionDetalleServicio = z.object({
  descripcion: z.string(),
  cod_herramienta: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cod_usuario_creacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  fecha_creacion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
  activo: z.boolean().default(true),
  tiempo_uso: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  codigo_tiempo_uso: z.string().default("H"),
  monto_total: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cod_maestro: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  total_consumo_energetico: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  total_depreciacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  total_horas_servicio: z.union([z.string(), z.number()]).transform((val) => Number(val)),
});

// Esquema para la desactivación de DetalleServicio
export const desactivacionDetalleServicio = z.object({
  cod_detalle_servicio: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  activo: z.boolean().default(false),
  cod_usuario_anulacion: z.union([z.string(), z.number()]).transform((val) => Number(val)).nullable(),
  fecha_anulacion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
});

// Inferir los tipos desde los esquemas si es necesario
export type CreacionDS = z.infer<typeof creacionDetalleServicio>;
export type DesactivacionDS = z.infer<typeof desactivacionDetalleServicio>;