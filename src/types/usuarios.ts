import { z } from 'zod';

export type Usuario = {
  cod_usuario: number;
  fecha_creacion: Date;
  nombres: string;
  apellidos: string;
  usuario: string;
  password: string;
  activo: boolean;
}

// Define el esquema para Creacion
export const creacionUsuario = z.object({
  nombres: z.string(),
  usuario: z.string().default('sin_asignar'),
  apellidos: z.string(),
  password: z.string(),
});

// Define el esquema para Actualizacion
export const actualizacionUsuario = z.object({
  cod_usuario: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  nombres: z.string(),
  apellidos: z.string(),
  password: z.string(),
});

// Define el esquema para Inactivacion
export const desactivacionUsuario = z.object({
  cod_usuario: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  activo: z.boolean().default(false),
  fecha_inactivacion: z.union([z.string(), z.date()]).transform((val) => new Date(val)).default(() => new Date()),
});

export type CreacionU = z.infer<typeof creacionUsuario>;
export type ActualizacionU = z.infer<typeof actualizacionUsuario>;
export type DesactivacionU = z.infer<typeof desactivacionUsuario>;