export interface DetalleBien {
  cod_detalle_bien: number;
  cod_materia_prima: number;
  cod_usuario_creacion: number;
  fecha_creacion: Date;
  activo: boolean;
  cod_usuario_anulacion: number | null;
  fecha_anulacion: Date | null;
  codigo_moneda: string;
  monto_total: number;
  codigo_unidad: string;
  unidad: number;
  cod_detalle: number;
}
