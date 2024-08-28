export interface Usuarios {
  cod_usuario: number;
  fecha_creacion: Date;
  nombres: string;
  apellidos: string;
  usuario: string;
  password: string;
  activo: boolean;
  fecha_inactivacion: Date | null;
}