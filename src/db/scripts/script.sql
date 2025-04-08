create SCHEMA IF NOT EXISTS  activos;
create SCHEMA IF NOT EXISTS  cotizaciones;
create SCHEMA IF NOT EXISTS  inventario;
create SCHEMA IF NOT EXISTS  registros;
create SCHEMA IF NOT EXISTS  sistema;
create SCHEMA IF NOT EXISTS  catalogos;
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
CREATE TABLE IF NOT EXISTS catalogos.unidades (
    codigo_unidad VARCHAR(4) NOT NULL,
    tipo VARCHAR(10) NULL,
    factor_conversion NUMERIC DEFAULT 1.00 NOT NULL,
    CONSTRAINT unidades_pkey PRIMARY KEY (codigo_unidad)
);

-- Tabla de Monedas
CREATE TABLE IF NOT EXISTS catalogos.moneda (
    codigo_moneda VARCHAR(3) NOT NULL,
    moneda VARCHAR(50) NOT NULL,
    tipo_cambio NUMERIC(20, 2) NOT NULL,
    tipo_cambio_recibo NUMERIC(20, 2) DEFAULT 0.0 NOT NULL,
    CONSTRAINT moneda_pkey PRIMARY KEY (codigo_moneda)
);

-- Tabla tipo id impuesto
CREATE TABLE catalogos.tipo_id_impuesto (
    codigo_tipo_id_impuesto varchar(3) NOT NULL,
    descripcion_id_impuesto varchar(50) NOT NULL,
    CONSTRAINT tipo_id_impuesto_pkey PRIMARY KEY (codigo_tipo_id_impuesto)
);

-- Tabla de clientes
create table if not exists catalogos.clientes(
	cod_cliente SERIAL primary key,
	nombre_cliente VARCHAR,
	razon_social VARCHAR,
	contactos JSONB,
    codigo_tipo_id_impuesto VARCHAR(3) not null,
    constraint fk_codigo_tipo_id_impuesto foreign key (codigo_tipo_id_impuesto)
    	references catalogos.tipo_id_impuesto(codigo_tipo_id_impuesto)
    	ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Insertar datos en Unidades
INSERT INTO catalogos.unidades (codigo_unidad, tipo, factor_conversion)
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

-- Insertar datos en Monedas
INSERT INTO catalogos.moneda ( codigo_moneda, moneda, tipo_cambio, tipo_cambio_recibo )
VALUES ('USD', 'Dólar estadounidense', 7.93, 7.94),
    ('GTQ', 'Quetzal guatemalteco', 1.00, 1.00);

-- Insertar datos en tipo id impuesto
INSERT INTO catalogos.tipo_id_impuesto (codigo_tipo_id_impuesto,descripcion_id_impuesto) VALUES
	 ('CUI','DPI'),
	 ('EXT','Passaporte o extranjero'),
	 ('NIT','NIT'),
	 ('OTR','Otro');

-- Función para convertir monedas
CREATE OR REPLACE FUNCTION catalogos.convertir_monedas(
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
    FROM catalogos.moneda
    WHERE codigo_moneda = unidad_in;

    SELECT tipo_cambio INTO unidad_2
    FROM catalogos.moneda
    WHERE codigo_moneda = unidad_out;

    razon := (unidad_1 / unidad_2);
    RETURN ROUND(monto * razon, 4);
END;
$function$;

-- Función para convertir unidades 
CREATE OR REPLACE FUNCTION catalogos.convertir_unidad(
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
    FROM catalogos.unidades
    WHERE codigo_unidad = unidad_in;

    SELECT factor_conversion INTO unidad_2
    FROM catalogos.unidades
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
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    cod_tipo_depreciacion INT NOT NULL, 
    codigo_medida_electricidad VARCHAR(1) DEFAULT 'W',
    codigo_moneda VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    consumo_electrico NUMERIC(13, 2),
    descripcion VARCHAR,
    fecha_adquisicion DATE DEFAULT NOW(),
    fecha_anulacion DATE,
    fecha_creacion DATE DEFAULT NOW(),
    monto NUMERIC(13, 2),
    CONSTRAINT fk_cod_tipo_depreciacion FOREIGN KEY (cod_tipo_depreciacion) 
        REFERENCES activos.porcentajes_depreciacion(cod_tipo_depreciacion) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_codigo_moneda FOREIGN KEY (codigo_moneda) 
        REFERENCES catalogos.moneda(codigo_moneda)
);



-- ===========================
-- INVENTARIO
-- ===========================

-- Tabla materia_prima 
CREATE TABLE IF NOT EXISTS inventario.materia_prima (
    cod_materia_prima SERIAL PRIMARY KEY,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    cantidad NUMERIC(13, 2),
    codigo_moneda VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_unidad VARCHAR(2),
    descripcion VARCHAR,
    fecha_anulacion DATE,
    fecha_creacion DATE DEFAULT NOW(),
    monto NUMERIC(13, 2),
    CONSTRAINT fk_codigo_moneda FOREIGN KEY (codigo_moneda) 
        REFERENCES catalogos.moneda(codigo_moneda)
);



-- ===========================
-- COTIZACIONES 
-- ===========================
 
-- Tabla producto
CREATE TABLE IF NOT EXISTS cotizaciones.producto (
    cod_producto              SERIAL PRIMARY KEY,
    codigo_moneda_monto_ganancia VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_moneda_monto_impuesto VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_moneda_monto_total VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    monto_ganancia            NUMERIC(13, 2),
    monto_impuesto            NUMERIC(13, 2) NOT NULL DEFAULT 0,
    monto_total               NUMERIC(13, 2) NOT NULL DEFAULT 0,
    nombre_producto           VARCHAR,
    porcentaje_ganancia       NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    porcentaje_impuesto       NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    CONSTRAINT fk_codigo_moneda_total FOREIGN KEY (codigo_moneda_monto_total) 
        REFERENCES catalogos.moneda(codigo_moneda),
    CONSTRAINT fk_codigo_moneda_impuesto FOREIGN KEY (codigo_moneda_monto_impuesto) 
        REFERENCES catalogos.moneda(codigo_moneda),
    CONSTRAINT fk_codigo_moneda_ganancia FOREIGN KEY (codigo_moneda_monto_ganancia) 
        REFERENCES catalogos.moneda(codigo_moneda)
);

-- Tabla detalle_servicio
CREATE TABLE IF NOT EXISTS cotizaciones.servicio (
    cod_servicio SERIAL PRIMARY KEY,
    cod_herramienta INT NOT NULL,
    cod_producto INT NOT NULL,
    codigo_moneda_total_consumo_energetico VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_moneda_total_depreciacion VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_moneda_total_horas_servicio VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_moneda_total_servicio VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_tiempo_uso VARCHAR(1) NOT NULL DEFAULT 'H',
    descripcion VARCHAR,
    precio_kW NUMERIC(13, 2) NOT NULL DEFAULT 1,
    tiempo_uso NUMERIC(13, 2),
    total_consumo_energetico NUMERIC(13, 2),
    total_depreciacion NUMERIC(13, 2),
    total_horas_servicio NUMERIC(13, 2),
    total_servicio NUMERIC(13, 2),
    CONSTRAINT fk_cod_herramienta FOREIGN KEY (cod_herramienta) 
        REFERENCES activos.herramienta(cod_herramienta) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_cod_producto FOREIGN KEY (cod_producto) 
        REFERENCES cotizaciones.producto(cod_producto) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_codigo_moneda_total_servicio FOREIGN KEY (codigo_moneda_total_servicio) 
        REFERENCES catalogos.moneda(codigo_moneda),
    CONSTRAINT fk_codigo_moneda_total_consumo_energetico FOREIGN KEY (codigo_moneda_total_consumo_energetico) 
        REFERENCES catalogos.moneda(codigo_moneda),
    CONSTRAINT fk_codigo_moneda_total_depreciacion FOREIGN KEY (codigo_moneda_total_depreciacion) 
        REFERENCES catalogos.moneda(codigo_moneda),
    CONSTRAINT fk_codigo_moneda_total_horas_servicio FOREIGN KEY (codigo_moneda_total_horas_servicio) 
        REFERENCES catalogos.moneda(codigo_moneda)
);

-- Tabla consumo_materia_prima
CREATE TABLE IF NOT EXISTS cotizaciones.consumo_materia_prima (
    cod_consumo_materia_prima SERIAL PRIMARY KEY,
    cod_servicio INT NOT NULL,
    cod_materia_prima INT NOT NULL,
    codigo_moneda_monto_total VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_unidad_consumo VARCHAR(4) NOT NULL,
    descripcion VARCHAR,
    monto_total NUMERIC(13, 2) NOT NULL DEFAULT 0,
    monto_unidad_consumo NUMERIC(13, 2),
    CONSTRAINT fk_cod_materia_prima FOREIGN KEY (cod_materia_prima) 
        REFERENCES inventario.materia_prima(cod_materia_prima) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_codigo_moneda_monto_total FOREIGN KEY (codigo_moneda_monto_total) 
        REFERENCES catalogos.moneda(codigo_moneda), 
    CONSTRAINT fk_codigo_unidad_consumo FOREIGN KEY (codigo_unidad_consumo) 
        REFERENCES catalogos.unidades(codigo_unidad),
    CONSTRAINT fk_cod_servicio FOREIGN KEY (cod_servicio) 
        REFERENCES cotizaciones.servicio(cod_servicio) 
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla cotizacion
CREATE TABLE IF NOT EXISTS cotizaciones.cotizacion (
    cod_cotizacion SERIAL PRIMARY KEY,	
    cod_cliente int,
	nombre_cliente VARCHAR not null,
	razon_social VARCHAR not null,
	contactos JSONB,
    codigo_tipo_id_impuesto VARCHAR(3) not null,
    codigo_moneda VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    descripcion VARCHAR,
    monto_total NUMERIC(13, 2) NOT NULL DEFAULT 0,
	CONSTRAINT fk_codigo_moneda FOREIGN KEY (codigo_moneda) 
	    REFERENCES catalogos.moneda(codigo_moneda) 
	    ON DELETE RESTRICT ON UPDATE CASCADE,
	constraint fk_codigo_tipo_id_impuesto foreign key (codigo_tipo_id_impuesto)
		references catalogos.tipo_id_impuesto(codigo_tipo_id_impuesto)
		ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla cotizacion_producto
CREATE TABLE IF NOT EXISTS cotizacion_producto (
    cod_cotizacion INT NOT NULL,
    cod_producto INT NOT NULL,
    CONSTRAINT pk_cotizacion_producto PRIMARY KEY (cod_cotizacion, cod_producto),
    CONSTRAINT fk_cod_cotizacion FOREIGN KEY (cod_cotizacion) 
        REFERENCES cotizaciones.cotizacion(cod_cotizacion) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_cod_producto FOREIGN KEY (cod_producto) 
        REFERENCES cotizaciones.producto(cod_producto) 
        ON DELETE RESTRICT ON UPDATE CASCADE
);



-- ===========================
-- REGISTROS
-- ===========================
 
-- Tabla producto
CREATE TABLE IF NOT EXISTS registros.producto (
    cod_producto              SERIAL PRIMARY KEY,
    codigo_moneda_monto_ganancia VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_moneda_monto_impuesto VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_moneda_monto_total VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    monto_ganancia            NUMERIC(13, 2),
    monto_impuesto            NUMERIC(13, 2) NOT NULL DEFAULT 0,
    monto_total               NUMERIC(13, 2) NOT NULL DEFAULT 0,
    nombre_producto           VARCHAR,
    porcentaje_ganancia       NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    porcentaje_impuesto       NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    CONSTRAINT fk_codigo_moneda_total FOREIGN KEY (codigo_moneda_monto_total) 
        REFERENCES catalogos.moneda(codigo_moneda),
    CONSTRAINT fk_codigo_moneda_impuesto FOREIGN KEY (codigo_moneda_monto_impuesto) 
        REFERENCES catalogos.moneda(codigo_moneda),
    CONSTRAINT fk_codigo_moneda_ganancia FOREIGN KEY (codigo_moneda_monto_ganancia) 
        REFERENCES catalogos.moneda(codigo_moneda)
);

-- Tabla detalle_servicio
CREATE TABLE IF NOT EXISTS registros.servicio (
    cod_servicio SERIAL PRIMARY KEY,
    cod_herramienta INT NOT NULL,
    cod_producto INT NOT NULL, 
    codigo_moneda_total_consumo_energetico VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_moneda_total_depreciacion VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_moneda_total_horas_servicio VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_moneda_total_servicio VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_tiempo_uso VARCHAR(1) NOT NULL DEFAULT 'H',
    descripcion VARCHAR,
    precio_kW NUMERIC(13, 2) NOT NULL DEFAULT 1,
    tiempo_uso NUMERIC(13, 2),
    total_consumo_energetico NUMERIC(13, 2),
    total_depreciacion NUMERIC(13, 2),
    total_horas_servicio NUMERIC(13, 2),
    total_servicio NUMERIC(13, 2),
    CONSTRAINT fk_cod_herramienta FOREIGN KEY (cod_herramienta) 
        REFERENCES activos.herramienta(cod_herramienta) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_cod_producto FOREIGN KEY (cod_producto) 
        REFERENCES registros.producto(cod_producto) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_codigo_moneda_total_servicio FOREIGN KEY (codigo_moneda_total_servicio) 
        REFERENCES catalogos.moneda(codigo_moneda),
    CONSTRAINT fk_codigo_moneda_total_consumo_energetico FOREIGN KEY (codigo_moneda_total_consumo_energetico) 
        REFERENCES catalogos.moneda(codigo_moneda),
    CONSTRAINT fk_codigo_moneda_total_depreciacion FOREIGN KEY (codigo_moneda_total_depreciacion) 
        REFERENCES catalogos.moneda(codigo_moneda),
    CONSTRAINT fk_codigo_moneda_total_horas_servicio FOREIGN KEY (codigo_moneda_total_horas_servicio) 
        REFERENCES catalogos.moneda(codigo_moneda)
);

-- Tabla consumo_materia_prima
CREATE TABLE IF NOT EXISTS registros.consumo_materia_prima (
    cod_consumo_materia_prima SERIAL PRIMARY KEY,
    cod_servicio INT NOT NULL,
    cod_materia_prima INT NOT NULL,
    codigo_moneda_monto_total VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    codigo_unidad_consumo VARCHAR(4) NOT NULL,
    descripcion VARCHAR,
    monto_total NUMERIC(13, 2) NOT NULL DEFAULT 0,
    monto_unidad_consumo NUMERIC(13, 2),
    CONSTRAINT fk_cod_materia_prima FOREIGN KEY (cod_materia_prima) 
        REFERENCES inventario.materia_prima(cod_materia_prima) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_codigo_moneda_monto_total FOREIGN KEY (codigo_moneda_monto_total) 
        REFERENCES catalogos.moneda(codigo_moneda), 
    CONSTRAINT fk_codigo_unidad_consumo FOREIGN KEY (codigo_unidad_consumo) 
        REFERENCES catalogos.unidades(codigo_unidad),
    CONSTRAINT fk_cod_servicio FOREIGN KEY (cod_servicio) 
        REFERENCES registros.servicio(cod_servicio) 
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla cotizacion
CREATE TABLE IF NOT EXISTS registros.movimiento (
    cod_movimiento SERIAL PRIMARY KEY,	
    cod_cliente int, 
    codigo_moneda VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    descripcion VARCHAR,
    monto_total NUMERIC(13, 2) NOT NULL DEFAULT 0,
	CONSTRAINT fk_codigo_moneda FOREIGN KEY (codigo_moneda) 
	    REFERENCES catalogos.moneda(codigo_moneda) 
	    ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_cod_cliente FOREIGN KEY (cod_cliente) 
	    REFERENCES catalogos.clientes(cod_cliente) 
	    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla cotizacion_producto
CREATE TABLE IF NOT EXISTS registros.movimiento_producto (
    cod_movimiento INT NOT NULL,
    cod_producto INT NOT NULL,
    CONSTRAINT pk_movimiento_producto PRIMARY KEY (cod_movimiento, cod_producto),
    CONSTRAINT fk_cod_movimiento FOREIGN KEY (cod_movimiento) 
        REFERENCES registros.movimiento(cod_movimiento) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_cod_producto FOREIGN KEY (cod_producto) 
        REFERENCES registros.producto(cod_producto) 
        ON DELETE RESTRICT ON UPDATE CASCADE
);


--DROP SCHEMA IF EXISTS activos CASCADE;
--DROP SCHEMA IF EXISTS catalogos CASCADE;
--DROP SCHEMA IF EXISTS cotizaciones CASCADE;
--DROP SCHEMA IF EXISTS inventario CASCADE;
--DROP SCHEMA IF EXISTS registros CASCADE;
--DROP SCHEMA IF EXISTS sistema CASCADE;