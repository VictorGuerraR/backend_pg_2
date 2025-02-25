create schema activos;
create SCHEMA cotizaciones;
create SCHEMA inventario;
create SCHEMA registros;
create SCHEMA sistema;
create schema catalogo;
-- ===========================
-- SISTEMA
-- ===========================

-- TABLA DE USUARIO
create table IF NOT EXISTS sistema.usuarios(
    cod_usuario SERIAL PRIMARY key,
    fecha_creacion DATE DEFAULT NOW(),
    nombres VARCHAR NOT null,
    apellidos VARCHAR NOT null,
    usuario VARCHAR NOT null,
    "password" VARCHAR NOT null,
    activo boolean not null default true,
    fecha_inactivacion date
);
-- ===========================
-- CATALOGOS
-- ===========================

-- Tabla de Unidades
CREATE TABLE IF NOT EXISTS catalogo.unidades (
    codigo_unidad VARCHAR(4) NOT NULL,
    tipo VARCHAR(10) NULL,
    factor_conversion NUMERIC DEFAULT 1.00 NOT NULL,
    CONSTRAINT unidades_pkey PRIMARY KEY (codigo_unidad)
);

-- Insertar datos en Unidades
INSERT INTO catalogo.unidades (codigo_unidad, tipo, factor_conversion)
VALUES ('M', 'LONG', 1.00000000),
    ('KG', 'PESO', 1.00000000),
    ('M3', 'VOLUMEN', 1.00000000),
    ('LB', 'PESO', 0.45400000),
    ('CM', 'LONG', 0.01000000),
    ('FT', 'LONG', 0.30480000),
    ('IN', 'LONG', 0.02540000),
    ('CM3', 'VOLUMEN', 0.00000100),
    ('IN3', 'VOLUMEN', 0.00001637),
    ('FT3', 'VOLUMEN', 0.02831700);

-- Tabla de Monedas
CREATE TABLE IF NOT EXISTS catalogo.moneda (
    codigo_moneda VARCHAR(3) NOT NULL,
    moneda VARCHAR(50) NOT NULL,
    tipo_cambio NUMERIC(20, 2) NOT NULL,
    tipo_cambio_recibo NUMERIC(20, 2) DEFAULT 0.0 NOT NULL,
    CONSTRAINT moneda_pkey PRIMARY KEY (codigo_moneda)
);

-- Insertar datos en Monedas
INSERT INTO catalogo.moneda ( codigo_moneda, moneda, tipo_cambio, tipo_cambio_recibo )
VALUES ('USD', 'Dólar estadounidense', 7.93, 7.94),
    ('GTQ', 'Quetzal guatemalteco', 1.00, 1.00);

-- Función para convertir monedas
CREATE OR REPLACE FUNCTION catalogo.convertir_monedas(
    monto NUMERIC,
    unidad_in VARCHAR,
    unidad_out VARCHAR
) 
RETURNS NUMERIC 
LANGUAGE plpgsql AS $function$
DECLARE 
    razon NUMERIC;
    unidad_1 NUMERIC(13, 4);
    unidad_2 NUMERIC(13, 4);
BEGIN
    SELECT tipo_cambio INTO unidad_1
    FROM catalogo.moneda
    WHERE codigo_moneda = unidad_in;

    SELECT tipo_cambio INTO unidad_2
    FROM catalogo.moneda
    WHERE codigo_moneda = unidad_out;

    razon := (unidad_1 / unidad_2);
    RETURN ROUND(monto * razon, 4);
END;
$function$;

-- Función para convertir unidades 
CREATE OR REPLACE FUNCTION catalogo.convertir_unidad(
    monto NUMERIC,
    unidad_in VARCHAR,
    unidad_out VARCHAR,
    decimales NUMERIC
) 
RETURNS NUMERIC 
LANGUAGE plpgsql AS $$
DECLARE 
    razon NUMERIC;
    unidad_1 NUMERIC(13, 4);
    unidad_2 NUMERIC(13, 4);
BEGIN
    SELECT factor_conversion INTO unidad_1
    FROM catalogo.unidades
    WHERE codigo_unidad = unidad_in;

    SELECT factor_conversion INTO unidad_2
    FROM catalogo.unidades
    WHERE codigo_unidad = unidad_out;

    razon := (unidad_1 / unidad_2);
    RETURN ROUND(monto * razon, decimales::INTEGER);
END;
$$;

-- ===========================
-- ACTIVOS 
-- ===========================

-- Tabla porcentajes_depreciacion
CREATE TABLE IF NOT EXISTS activos.porcentajes_depreciacion (
    cod_tipo_depreciacion SERIAL PRIMARY KEY,
    descripcion VARCHAR NOT NULL,
    porcentaje_depreciacion_anual NUMERIC(5, 2) NOT NULL
);

-- Insertar información en la tabla porcentajes_depreciacion
INSERT INTO activos.porcentajes_depreciacion (descripcion, porcentaje_depreciacion_anual)
values ('Equipo de computación', 33.33);

-- Tabla herramienta
CREATE TABLE IF NOT EXISTS activos.herramienta (
    cod_herramienta SERIAL PRIMARY KEY,
    cod_tipo_depreciacion INT REFERENCES activos.porcentajes_depreciacion(cod_tipo_depreciacion) on delete restrict on update cascade not null,
    cod_usuario_responsable int references sistema.usuarios(cod_usuario) on delete restrict on update cascade not null,
    cod_usuario_creacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    fecha_adquisicion DATE DEFAULT NOW(),
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade,
    fecha_anulacion date,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    CONSTRAINT fk_codigo_moneda FOREIGN KEY (codigo_moneda) REFERENCES catalogo.moneda(codigo_moneda),
    monto NUMERIC(13, 2),
    consumo_electrico NUMERIC(13, 2),
    codigo_medida_electricidad varchar(1) default 'W'
);
-- ===========================
-- INVENTARIO
-- ===========================

-- Tabla materia_prima
CREATE TABLE IF NOT EXISTS inventario.materia_prima (
    cod_materia_prima SERIAL PRIMARY KEY,
    cod_usuario_creacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade,
    fecha_creacion DATE DEFAULT NOW(),
    cod_usuario_anulacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade,
    activo BOOLEAN not null default true,
    fecha_anulacion date,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    CONSTRAINT fk_codigo_moneda FOREIGN KEY (codigo_moneda) REFERENCES catalogo.moneda(codigo_moneda),
    monto NUMERIC(13, 2),
    cantidad NUMERIC(13, 2),
    codigo_unidad VARCHAR(2)
);

-- ===========================
-- REGISTROS  
-- ===========================

-- Tabla costo_fijos
CREATE TABLE IF NOT EXISTS registros.costo_fijos (
    cod_costo_fijo SERIAL PRIMARY KEY,
    cod_usuario_creacion INT REFERENCES sistema.usuarios(cod_usuario) on delete restrict on update cascade,
    fecha_creacion DATE DEFAULT NOW(),
    activo BOOLEAN DEFAULT true NOT NULL,
    cod_usuario_anulacion INT REFERENCES sistema.usuarios(cod_usuario) on delete restrict on update cascade,
    fecha_anulacion DATE,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) DEFAULT 'GTQ' NOT NULL,
    monto_total NUMERIC(13, 2)
);

-- Tabla maestro
CREATE TABLE IF NOT EXISTS registros.maestro (
    cod_maestro SERIAL PRIMARY KEY,
    cod_usuario_creacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade,
    fecha_anulacion date,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    CONSTRAINT fk_codigo_moneda FOREIGN KEY (codigo_moneda) REFERENCES catalogo.moneda(codigo_moneda),
    monto_total NUMERIC(13, 2) not null default 0,
    porcentaje_impuesto NUMERIC(5, 2) not null default 5.00,
    monto_impuesto NUMERIC(13, 2) not null default 0,
    precio_kW NUMERIC(13, 2) not null default 1,
    monto_ganancia NUMERIC(13, 2),
    porcentaje_ganancia NUMERIC(5, 2)
);

-- Tabla detalle_servicio
CREATE TABLE IF NOT EXISTS registros.detalle_servicio (
    cod_detalle_servicio SERIAL PRIMARY KEY,
    cod_herramienta INT REFERENCES activos.herramienta(cod_herramienta) on delete restrict on update cascade not null,
    cod_usuario_creacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade,
    fecha_anulacion date,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    CONSTRAINT fk_codigo_moneda FOREIGN KEY (codigo_moneda) REFERENCES catalogo.moneda(codigo_moneda),
    tiempo_uso NUMERIC(13, 2),
    total_consumo_energetico NUMERIC(13, 2),
    total_depreciacion NUMERIC(13, 2),
    total_horas_servicio NUMERIC(13, 2),
    codigo_tiempo_uso varchar(1) not null default 'H',
    monto_total NUMERIC(13, 2),
    cod_maestro INT REFERENCES registros.maestro(cod_maestro) on delete restrict on update cascade not null
);

-- Tabla detalle_bien
CREATE TABLE IF NOT EXISTS registros.detalle_consumo_materia_prima (
    cod_consumo_materia_prima SERIAL PRIMARY KEY,
    cod_materia_prima INT REFERENCES inventario.materia_prima(cod_materia_prima) on delete restrict on update cascade not null,
    cod_usuario_creacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade,
    fecha_anulacion date,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    CONSTRAINT fk_codigo_moneda FOREIGN KEY (codigo_moneda) REFERENCES catalogo.moneda(codigo_moneda),
    monto_total NUMERIC(13, 2) not null default 0,
    codigo_unidad VARCHAR(4) NOT NULL,
    CONSTRAINT fk_codigo_unidad FOREIGN KEY (codigo_unidad) REFERENCES catalogo.unidades(codigo_unidad),
    unidad NUMERIC(13, 2),
    cod_detalle_servicio INT REFERENCES registros.detalle_servicio(cod_detalle_servicio) on delete restrict on update cascade not null
);

-- Tabla movimiento_materia_prima
CREATE TABLE IF NOT EXISTS registros.movimiento_materia_prima (
    cod_registro_materia_prima SERIAL PRIMARY KEY,
    cod_consumo_materia_prima INT references registros.detalle_consumo_materia_prima(cod_consumo_materia_prima) on delete restrict on update cascade not null,
    cod_materia_prima INT REFERENCES inventario.materia_prima(cod_materia_prima) on delete restrict on update cascade not null,
    cod_usuario_creacion INT REFERENCES sistema.usuarios(cod_usuario) on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    cod_usuario_anulacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade,
    activo BOOLEAN not null default true,
    fecha_anulacion date,
    cantidad NUMERIC(13, 2)
);


-- ===========================
-- COTIZACIONES 
-- ===========================

-- Tabla maestro
CREATE TABLE IF NOT EXISTS cotizaciones.maestro (
    cod_maestro SERIAL PRIMARY KEY,
    cod_usuario_creacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade,
    fecha_anulacion date,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    CONSTRAINT fk_codigo_moneda FOREIGN KEY (codigo_moneda) REFERENCES catalogo.moneda(codigo_moneda),
    monto_total NUMERIC(13, 2) not null default 0,
    porcentaje_impuesto NUMERIC(5, 2) not null default 5.00,
    monto_impuesto NUMERIC(13, 2) not null default 0,
    precio_kW NUMERIC(13, 2) not null default 1,
    monto_ganancia NUMERIC(13, 2),
    porcentaje_ganancia NUMERIC(5, 2)
);

-- Tabla detalle_servicio
CREATE TABLE IF NOT EXISTS cotizaciones.detalle_servicio (
    cod_detalle_servicio SERIAL PRIMARY KEY,
    cod_herramienta INT REFERENCES activos.herramienta(cod_herramienta) on delete restrict on update cascade not null,
    cod_usuario_creacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade,
    fecha_anulacion date,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    CONSTRAINT fk_codigo_moneda FOREIGN KEY (codigo_moneda) REFERENCES catalogo.moneda(codigo_moneda),
    tiempo_uso NUMERIC(13, 2),
    total_consumo_energetico NUMERIC(13, 2),
    total_depreciacion NUMERIC(13, 2),
    total_horas_servicio NUMERIC(13, 2),
    codigo_tiempo_uso varchar(1) not null default 'H',
    monto_total NUMERIC(13, 2),
    cod_maestro INT REFERENCES cotizaciones.maestro(cod_maestro) on delete restrict on update cascade not null
);

-- Tabla detalle_bien
CREATE TABLE IF NOT EXISTS cotizaciones.detalle_consumo_materia_prima (
    cod_consumo_materia_prima SERIAL PRIMARY KEY,
    cod_materia_prima INT REFERENCES inventario.materia_prima(cod_materia_prima) on delete restrict on update cascade not null,
    cod_usuario_creacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade,
    fecha_anulacion date,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    CONSTRAINT fk_codigo_moneda FOREIGN KEY (codigo_moneda) REFERENCES catalogo.moneda(codigo_moneda), 
    monto_total NUMERIC(13, 2) not null default 0,
    codigo_unidad VARCHAR(4) NOT NULL,
    CONSTRAINT fk_codigo_unidad FOREIGN KEY (codigo_unidad) REFERENCES catalogo.unidades(codigo_unidad),
    unidad NUMERIC(13, 2),
    cod_detalle_servicio INT REFERENCES cotizaciones.detalle_servicio(cod_detalle_servicio) on delete restrict on update cascade not null
);

-- Tabla movimiento_materia_prima
CREATE TABLE IF NOT EXISTS cotizaciones.movimiento_materia_prima (
    cod_registro_materia_prima SERIAL PRIMARY KEY,
    cod_consumo_materia_prima INT references cotizaciones.detalle_consumo_materia_prima(cod_consumo_materia_prima) on delete restrict on update cascade not null,
    cod_materia_prima INT REFERENCES inventario.materia_prima(cod_materia_prima) on delete restrict on update cascade not null,
    cod_usuario_creacion INT REFERENCES sistema.usuarios(cod_usuario) on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    cod_usuario_anulacion int references sistema.usuarios(cod_usuario) on delete restrict on update cascade,
    activo BOOLEAN not null default true,
    fecha_anulacion date,
    cantidad NUMERIC(13, 2)
);


--DROP SCHEMA IF EXISTS activos CASCADE;
--DROP SCHEMA IF EXISTS catalogo CASCADE;
--DROP SCHEMA IF EXISTS cotizaciones CASCADE;
--DROP SCHEMA IF EXISTS inventario CASCADE;
--DROP SCHEMA IF EXISTS registros CASCADE;
--DROP SCHEMA IF EXISTS sistema CASCADE;