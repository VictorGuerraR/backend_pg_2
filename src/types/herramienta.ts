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
