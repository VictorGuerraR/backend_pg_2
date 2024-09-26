create SCHEMA registros;

-- TABLA DE USUARIO
create table registros.usuarios(
    cod_usuario SERIAL PRIMARY key,
    fecha_creacion DATE DEFAULT NOW(),
    nombres VARCHAR NOT null,
    apellidos VARCHAR NOT null,
    usuario VARCHAR NOT null,
    "password" VARCHAR NOT null,
    activo boolean not null default true,
    fecha_inactivacion date
);

-- Tabla maestro
CREATE TABLE registros.maestro (
    cod_maestro SERIAL PRIMARY KEY,
    cod_usuario_creacion int references registros.usuarios(cod_usuario) 
        on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references registros.usuarios(cod_usuario) 
        on delete restrict on update cascade,
    fecha_anulacion date,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    monto_total NUMERIC(13, 2) not null default 0,
    porcentaje_impuesto NUMERIC(5, 2) not null default 5.00,
    monto_impuesto NUMERIC(13, 2) not null default 0,
    precio_kW NUMERIC(13, 2) not null default 1,
    monto_ganacia NUMERIC(13, 2),
    porcentaje_ganancia NUMERIC(5, 2)
);

-- Tabla materia_prima
CREATE TABLE registros.materia_prima (
    cod_materia_prima SERIAL PRIMARY KEY,
    cod_usuario_creacion int references registros.usuarios(cod_usuario) 
        on delete restrict on update cascade,
    fecha_creacion DATE DEFAULT NOW(),
    cod_usuario_anulacion int references registros.usuarios(cod_usuario) 
        on delete restrict on update cascade,
    activo BOOLEAN not null default true,
    fecha_anulacion date,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    monto NUMERIC(13, 2),
    cantidad NUMERIC(13, 2),
    codigo_unidad VARCHAR(2)
);

-- Tabla detalle_bien
CREATE TABLE registros.detalle_bien (
    cod_detalle_bien SERIAL PRIMARY KEY,
    cod_materia_prima INT REFERENCES registros.materia_prima(cod_materia_prima) 
        on delete restrict on update cascade not null,
    cod_usuario_creacion int references registros.usuarios(cod_usuario) 
        on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references registros.usuarios(cod_usuario) 
        on delete restrict on update cascade,
    fecha_anulacion date,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    monto_total NUMERIC(13, 2) not null default 0,
    codigo_unidad VARCHAR(2) not null default 'U',
    unidad NUMERIC(13, 2),
    cod_maestro INT REFERENCES registros.maestro(cod_maestro) 
        on delete restrict on update cascade not null
);

-- Tabla porcentajes_depreciacion
CREATE TABLE registros.porcentajes_depreciacion (
    cod_tipo_depreciacion SERIAL PRIMARY KEY,
    descripcion VARCHAR NOT NULL,
    porcentaje_depreciacion_anual NUMERIC(5, 2) NOT NULL
);

-- Insertar información en la tabla porcentajes_depreciacion
INSERT INTO registros.porcentajes_depreciacion (descripcion, porcentaje_depreciacion_anual) values
('Equipo de computación', 33.33);

-- Tabla herramienta
CREATE TABLE registros.herramienta (
    cod_herramienta SERIAL PRIMARY KEY,
    cod_tipo_depreciacion INT REFERENCES registros.porcentajes_depreciacion(cod_tipo_depreciacion) 
        on delete restrict on update cascade not null,
    cod_usuario_responsable int references registros.usuarios(cod_usuario) 
        on delete restrict on update cascade not null,
    cod_usuario_creacion int references registros.usuarios(cod_usuario) 
        on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    fecha_adquisicion DATE DEFAULT NOW(),
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references registros.usuarios(cod_usuario) 
        on delete restrict on update cascade,
    fecha_anulacion date,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    monto NUMERIC(13, 2),
    consumo_electrico NUMERIC(13, 2),
    codigo_medida_electricidad varchar(1) default 'W'
);

-- Tabla detalle_servicio
CREATE TABLE registros.detalle_servicio (
    cod_detalle_servicio SERIAL PRIMARY KEY,
    cod_herramienta INT REFERENCES registros.herramienta(cod_herramienta) 
        on delete restrict on update cascade not null,
    cod_usuario_creacion int references registros.usuarios(cod_usuario) 
        on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references registros.usuarios(cod_usuario) 
        on delete restrict on update cascade,
    fecha_anulacion date,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    tiempo_uso NUMERIC(13, 2),
    total_consumo_energetico NUMERIC(13, 2),
    total_depreciacion NUMERIC(13, 2),
    total_horas_servicio NUMERIC(13, 2),
    codigo_tiempo_uso varchar(1) not null default 'H',
    monto_total NUMERIC(13, 2),
    cod_maestro INT REFERENCES registros.maestro(cod_maestro) 
        on delete restrict on update cascade not null
);

-- Tabla costo_fijos
CREATE TABLE registros.costo_fijos (
    cod_costo_fijo SERIAL PRIMARY KEY,
    cod_usuario_creacion INT REFERENCES registros.usuarios(cod_usuario) 
        on delete restrict on update cascade,
    fecha_creacion DATE DEFAULT NOW(),
    activo BOOLEAN DEFAULT true NOT NULL,
    cod_usuario_anulacion INT REFERENCES registros.usuarios(cod_usuario) 
        on delete restrict on update cascade,
    fecha_anulacion DATE,
    descripcion VARCHAR,
    codigo_moneda VARCHAR(3) DEFAULT 'GTQ' NOT NULL,
    monto_total NUMERIC(13, 2)
);

-- Tabla movimiento_materia_prima
CREATE TABLE registros.movimiento_materia_prima (
    cod_registro_materia_prima SERIAL PRIMARY KEY,
    cod_detalle_bien INT references registros.detalle_bien(cod_detalle_bien) 
        on delete restrict on update cascade not null,
    cod_materia_prima INT REFERENCES registros.materia_prima(cod_materia_prima) 
        on delete restrict on update cascade not null,
    cod_usuario_creacion INT REFERENCES registros.usuarios(cod_usuario) 
        on delete restrict on update cascade not null,
    fecha_creacion DATE DEFAULT NOW(),
    cod_usuario_anulacion int references registros.usuarios(cod_usuario) 
        on delete restrict on update cascade,
    activo BOOLEAN not null default true,
    fecha_anulacion date,
    cantidad NUMERIC(13, 2)
);

CREATE OR REPLACE FUNCTION actualizar_monto_total_maestro()
RETURNS TRIGGER AS $$
BEGIN
  -- Sumar los montos de detalle_bien con activo = true
  UPDATE registros.maestro
  SET monto_total = (
    SELECT COALESCE(SUM(db.monto_total), 0)
    FROM registros.detalle_bien db
    WHERE db.cod_maestro = NEW.cod_maestro AND db.activo = true
  ) 
  + (
    -- Sumar los montos de detalle_servicio con activo = true
    SELECT COALESCE(SUM(ds.monto_total), 0)
    FROM registros.detalle_servicio ds
    WHERE ds.cod_maestro = NEW.cod_maestro AND ds.activo = true
  )
  WHERE cod_maestro = NEW.cod_maestro;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_maestro_bien
AFTER INSERT OR UPDATE ON registros.detalle_bien
FOR EACH ROW
EXECUTE FUNCTION actualizar_monto_total_maestro();

CREATE TRIGGER trigger_actualizar_maestro_servicio
AFTER INSERT OR UPDATE ON registros.detalle_servicio
FOR EACH ROW
EXECUTE FUNCTION actualizar_monto_total_maestro();


CREATE OR REPLACE FUNCTION calcular_montos_maestro()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcular el monto de la ganancia
  NEW.monto_ganacia := NEW.monto_total * (NEW.porcentaje_ganancia / 100);

  -- Calcular el monto del impuesto
  NEW.monto_impuesto := (NEW.monto_total + NEW.monto_ganacia) * (NEW.porcentaje_impuesto / 100);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_calcular_montos_maestro
BEFORE INSERT OR UPDATE ON registros.maestro
FOR EACH ROW
EXECUTE FUNCTION calcular_montos_maestro();



--DROP SCHEMA registros CASCADE;
--drop table registros.costo_fijos
--DROP TABLE registros.detalle_servicio;
--DROP TABLE registros.detalle_bien;
--DROP TABLE registros.maestro cascade;
--DROP TABLE registros.herramienta;
--DROP TABLE registros.materia_prima;
--DROP TABLE registros.porcentajes_depreciacion;
--DROP TABLE registros.usuarios;
