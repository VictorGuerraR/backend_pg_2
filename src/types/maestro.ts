export interface Maestro {
  cod_detalle: number;
  cod_usuario_creacion: number;
  fecha_creacion: Date;
  activo: boolean;
  cod_usuario_anulacion: number | null;
  fecha_anulacion: Date | null;
  fecha_maestro: Date;
  codigo_moneda: string;
  monto_total: number;
  porcentaje_impuesto: number;
  monto_impuesto: number;
  precio_kW: number;
}
