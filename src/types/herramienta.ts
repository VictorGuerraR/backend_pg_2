import { z } from "zod";

export type Herramienta = {
  activo: boolean;
  cod_herramienta: number;
  cod_tipo_depreciacion: number;
  cod_usuario_anulacion: number | null;
  cod_usuario_creacion: number;
  cod_usuario_responsable: number;
  codigo_moneda: string;
  consumo_electrico: number;
  descripcion: string;
  fecha_anulacion: Date | null;
  fecha_adquisicion: Date | null;
  fecha_creacion: Date;
  monto: number;
}

export const creacionHerramienta = z.object({
  activo: z.boolean().default(true),
  cod_tipo_depreciacion: z.number(),
  cod_usuario_creacion: z.number(),
  cod_usuario_responsable: z.number(),
  consumo_electrico: z.number(),
  descripcion: z.string(),
  fecha_creacion: z.date().default(() => new Date()),
  fecha_adquisicion: z.date().default(() => new Date()),
  monto: z.number(),
});

export const actualizacionHerramienta = z.object({
  cod_herramienta: z.number(),
  cod_tipo_depreciacion: z.number(),
  consumo_electrico: z.number(),
  descripcion: z.string(),
  fecha_adquisicion: z.date(),
  monto: z.number(),
});

export const desactivacionHerramienta = z.object({
  activo: z.boolean().default(false),
  cod_herramienta: z.number(),
  cod_usuario_anulacion: z.number(),
  fecha_anulacion: z.date().default(() => new Date()),
});

export type CreacionH = z.infer<typeof creacionHerramienta>;
export type ActualizacionH = z.infer<typeof actualizacionHerramienta>;
export type DesactivacionH = z.infer<typeof desactivacionHerramienta>;