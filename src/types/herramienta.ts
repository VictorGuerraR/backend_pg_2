import { z } from "zod";

export type Herramienta = {
  cod_herramienta: number;
  cod_usuario_responsable: number;
  cod_tipo_depreciacion: number;
  cod_usuario_creacion: number;
  fecha_creacion: Date;
  activo: boolean;
  cod_usuario_anulacion: number | null;
  fecha_anulacion: Date | null;
  descripcion: string;
  codigo_moneda: string;
  monto: number;
  consumo_electrico: number;
}

// Define el esquema para creacionHerramienta
export const creacionHerramienta = z.object({
  cod_usuario_responsable: z.number(),
  cod_tipo_depreciacion: z.number(),
  cod_usuario_creacion: z.number(),
  fecha_creacion: z.date().default(() => new Date()),
  activo: z.boolean().default(true),
  descripcion: z.string(),
  monto: z.number(),
  consumo_electrico: z.number(),
});

// Define el esquema para actualizacionHerramienta
export const actualizacionHerramienta = z.object({
  cod_herramienta: z.number(),
  cod_tipo_depreciacion: z.number(),
  descripcion: z.string(),
  monto: z.number(),
  consumo_electrico: z.number(),
});

// Define el esquema para desactivacionHerramienta
export const desactivacionHerramienta = z.object({
  cod_herramienta: z.number(),
  activo: z.boolean().default(false),
  cod_usuario_anulacion: z.number(),
  fecha_anulacion: z.date().default(() => new Date()),
});

export type CreacionH = z.infer<typeof creacionHerramienta>;
export type ActualizacionH = z.infer<typeof actualizacionHerramienta>;
export type DesactivacionH = z.infer<typeof desactivacionHerramienta>;