export interface DetalleServicio {
  cod_servicio: number;
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
