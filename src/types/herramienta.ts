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
  cod_tipo_depreciacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cod_usuario_creacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cod_usuario_responsable: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  consumo_electrico: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  descripcion: z.string(),
  fecha_creacion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
  fecha_adquisicion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
  monto: z.union([z.string(), z.number()]).transform((val) => Number(val)),
});

export const actualizacionHerramienta = z.object({
  cod_herramienta: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cod_tipo_depreciacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  consumo_electrico: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  descripcion: z.string(),
  fecha_adquisicion: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  monto: z.union([z.string(), z.number()]).transform((val) => Number(val)),
});

export const desactivacionHerramienta = z.object({
  activo: z.boolean().default(false),
  cod_herramienta: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  cod_usuario_anulacion: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  fecha_anulacion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
});

export type CreacionH = z.infer<typeof creacionHerramienta>;
export type ActualizacionH = z.infer<typeof actualizacionHerramienta>;
export type DesactivacionH = z.infer<typeof desactivacionHerramienta>;