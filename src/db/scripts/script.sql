create SCHEMA registros;

-- TABLA DE USUARIO
create table registros.usuarios(
    cod_usuario SERIAL PRIMARY key,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    nombres VARCHAR NOT null,
    apellidos VARCHAR NOT null,
    usuario VARCHAR NOT null,
    "password" VARCHAR NOT null,
    activo boolean not null default true,
    fecha_inactivacion date
);

CREATE TABLE costo_fijos (
    cod_costo_fijo SERIAL PRIMARY KEY,
    cod_usuario_creacion INT REFERENCES usuarios(cod_usuario),
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    activo BOOLEAN DEFAULT true NOT NULL,
    cod_usuario_anulacion INT REFERENCES usuarios(cod_usuario),
    fecha_anulacion DATE,
    codigo_moneda VARCHAR(3) DEFAULT 'GTQ' NOT NULL,
    monto_total NUMERIC(13, 2)
);

-- Tabla porcentajes_depreciacion
CREATE TABLE registros.porcentajes_depreciacion (
    cod_tipo_depreciacion SERIAL PRIMARY KEY,
    descripcion VARCHAR NOT NULL,
    porcentaje_depreciacion_anual NUMERIC(5, 2) NOT NULL
);

-- Insertar información en la tabla porcentajes_depreciacion
INSERT INTO registros.porcentajes_depreciacion (descripcion, porcentaje_depreciacion_anual) VALUES
('Árboles, arbustos, frutales y especies vegetales que produzcan frutos o productos que generen rentas gravadas, incluidos los gastos capitalizables para formar las plantaciones', 15.00),
('Instalaciones no adheridas a los inmuebles, mobiliario y equipo de oficina, buques - tanques, barcos y material ferroviario, marítimo, fluvial o lacustre', 20.00),
('Los semovientes utilizados como animales de carga o de trabajo, maquinaria, vehículos en general, grúas, aviones, remolques, semirremolques, contenedores y material rodante de todo tipo, excluido el ferroviario', 20.00),
('Equipo de computación', 33.33),
('Herramientas, porcelana, cristalería, mantelería, cubiertos y similares', 25.00),
('Reproductores de raza, machos y hembras, la depreciación se calcula sobre el valor de costo de tales animales menos su valor como ganado común', 25.00),
('Para los bienes muebles no indicados en los incisos anteriores', 10.00);

-- Tabla materia_prima
CREATE TABLE registros.materia_prima (
    cod_materia_prima SERIAL PRIMARY KEY,
    cod_usuario_creacion int references registros.usuarios(cod_usuario),
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    descripcion VARCHAR(300),
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    monto NUMERIC(13, 2),
    cantidad NUMERIC(13, 2),
    codigo_unidad VARCHAR(2)
);

CREATE TABLE registros.movimiento_materia_prima (
    cod_registro_materia_prima SERIAL PRIMARY KEY,
    cod_materia_prima INT REFERENCES registros.materia_prima(cod_materia_prima) not null,
    cod_usuario_creacion INT REFERENCES registros.usuarios(cod_usuario) not null,
    cod_usuario_anulacion int references registros.usuarios(cod_usuario),
    fecha_anulacion date,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    cantidad NUMERIC(13, 2)
);

-- Tabla herramienta
CREATE TABLE registros.herramienta (
    cod_herramienta SERIAL PRIMARY KEY,
    cod_tipo_depreciacion INT REFERENCES registros.porcentajes_depreciacion(cod_tipo_depreciacion) not null,
    cod_usuario_responsable int references registros.usuarios(cod_usuario) not null,
    cod_usuario_creacion int references registros.usuarios(cod_usuario) not null,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    fecha_adquisicion DATE DEFAULT CURRENT_DATE
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references registros.usuarios(cod_usuario),
    fecha_anulacion date,
    descripcion VARCHAR(300),
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    monto NUMERIC(13, 2),
    consumo_electrico NUMERIC(13, 2),
    codigo_medida_electricidad varchar(2) default 'kW'
);

-- Tabla maestro
CREATE TABLE registros.maestro (
    cod_maestro SERIAL PRIMARY KEY,
    cod_usuario_creacion int references registros.usuarios(cod_usuario) not null,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references registros.usuarios(cod_usuario),
    fecha_anulacion date,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    monto_total NUMERIC(13, 2) not null default 0,
    porcentaje_impuesto NUMERIC(5, 2) not null default 5.00,
    monto_impuesto NUMERIC(13, 2) not null default 0,
    precio_kW NUMERIC(13, 2) not null default 1,
    monto_ganacia NUMERIC(13, 2),
    porcentaje_ganancia NUMERIC(5, 2)
);

-- Tabla detalle_bien
CREATE TABLE registros.detalle_bien (
    cod_detalle_bien SERIAL PRIMARY KEY,
    cod_materia_prima INT REFERENCES registros.materia_prima(cod_materia_prima) not null,
    cod_usuario_creacion int references registros.usuarios(cod_usuario) not null,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references registros.usuarios(cod_usuario),
    fecha_anulacion date,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    monto_total NUMERIC(13, 2) not null default 0,
    codigo_unidad VARCHAR(1) not null default 'U',
    unidad NUMERIC(13, 2),
    cod_maestro INT REFERENCES registros.maestro(cod_maestro)  not null
);

-- Tabla detalle_servicio
CREATE TABLE registros.detalle_servicio (
    cod_detalle_servicio SERIAL PRIMARY KEY,
    cod_herramienta INT REFERENCES registros.herramienta(cod_herramienta) not null,
    cod_usuario_creacion int references registros.usuarios(cod_usuario) not null,
    fecha_creacion DATE DEFAULT CURRENT_DATE,
    activo BOOLEAN not null default true,
    cod_usuario_anulacion int references registros.usuarios(cod_usuario),
    fecha_anulacion date,
    codigo_moneda VARCHAR(3) not null default 'GTQ',
    tiempo_uso NUMERIC(13, 2),
    codigo_tiempo_uso varchar(1) not null default 'H',
    monto_total NUMERIC(13, 2),
    cod_maestro INT REFERENCES registros.maestro(cod_maestro) not null
);


--DROP SCHEMA registros CASCADE;
--DROP TABLE registros.detalle_servicio;
--DROP TABLE registros.detalle_bien;
--DROP TABLE registros.maestro;
--DROP TABLE registros.herramienta;
--DROP TABLE registros.materia_prima;
--DROP TABLE registros.porcentajes_depreciacion;
--DROP TABLE registros.usuarios;
