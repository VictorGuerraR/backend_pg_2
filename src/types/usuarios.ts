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
export const creacionSchema = z.object({
  cod_usuario: z.number(),
  nombres: z.string(),
  apellidos: z.string(),
  password: z.string(),
});

// Inferir el tipo desde el esquema (opcional si ya tienes el tipo definido)
export type Creacion = z.infer<typeof creacionSchema>;

// Define el esquema para Actualizacion
export const actualizacionSchema = z.object({
  cod_usuario: z.number(),
  nombres: z.string(),
  apellidos: z.string(),
  usuario: z.string(),
  password: z.string(),
});

// Inferir el tipo desde el esquema (opcional si ya tienes el tipo definido)
export type Actualizacion = z.infer<typeof actualizacionSchema>;

// Define el esquema para Inactivacion
export const inactivacionSchema = z.object({
  cod_usuario: z.number(),
  activo: z.boolean().default(false),
  fecha_inactivacion: z.date().default(() => new Date()),
});

// Inferir el tipo desde el esquema si es necesario
export type Inactivacion = z.infer<typeof inactivacionSchema>;