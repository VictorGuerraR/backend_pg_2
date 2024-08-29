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
  cod_usuario: z.number(),
  nombres: z.string(),
  usuario: z.string(),
  apellidos: z.string(),
  password: z.string(),
});

// Define el esquema para Actualizacion
export const actualizacionUsuario = z.object({
  cod_usuario: z.number(),
  nombres: z.string(),
  apellidos: z.string(),
  password: z.string(),
});

// Define el esquema para Inactivacion
export const desactivacionUsuario = z.object({
  cod_usuario: z.number(),
  activo: z.boolean().default(false),
  fecha_inactivacion: z.date().default(() => new Date()),
});

export type Creacion = z.infer<typeof creacionUsuario>;
export type Actualizacion = z.infer<typeof actualizacionUsuario>;
export type Desactivacion = z.infer<typeof desactivacionUsuario>;