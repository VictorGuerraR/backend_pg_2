import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Crear el esquema registros
  await knex.schema.createSchema('registros');

  // TABLA DE USUARIO
  await knex.schema.withSchema('registros').createTable('usuarios', (table) => {
    table.increments('cod_usuario').primary();
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.string('nombres').notNullable();
    table.string('apellidos').notNullable();
    table.string('usuario').notNullable();
    table.string('password').notNullable();
    table.boolean('activo').notNullable().defaultTo(true);
    table.date('fecha_inactivacion');
  });

  // Tabla maestro
  await knex.schema.withSchema('registros').createTable('maestro', (table) => {
    table.increments('cod_maestro').primary();
    table.integer('cod_usuario_creacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.boolean('activo').notNullable().defaultTo(true);
    table.integer('cod_usuario_anulacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table.date('fecha_anulacion');
    table.string('descripcion');
    table.string('codigo_moneda', 3).notNullable().defaultTo('GTQ');
    table.decimal('monto_total', 13, 2).notNullable().defaultTo(0);
    table.decimal('porcentaje_impuesto', 5, 2).notNullable().defaultTo(5.00);
    table.decimal('monto_impuesto', 13, 2).notNullable().defaultTo(0);
    table.decimal('precio_kW', 13, 2).notNullable().defaultTo(1);
    table.decimal('monto_ganancia', 13, 2);
    table.decimal('porcentaje_ganancia', 5, 2);
  });

  // Tabla materia_prima
  await knex.schema.withSchema('registros').createTable('materia_prima', (table) => {
    table.increments('cod_materia_prima').primary();
    table.integer('cod_usuario_creacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.integer('cod_usuario_anulacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table.boolean('activo').notNullable().defaultTo(true);
    table.date('fecha_anulacion');
    table.string('descripcion');
    table.string('codigo_moneda', 3).notNullable().defaultTo('GTQ');
    table.decimal('monto', 13, 2);
    table.decimal('cantidad', 13, 2);
    table.string('codigo_unidad', 2);
  });

  // Tabla detalle_bien
  await knex.schema.withSchema('registros').createTable('detalle_bien', (table) => {
    table.increments('cod_detalle_bien').primary();
    table.integer('cod_materia_prima').references('cod_materia_prima').inTable('registros.materia_prima')
      .onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.integer('cod_usuario_creacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.boolean('activo').notNullable().defaultTo(true);
    table.integer('cod_usuario_anulacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table.date('fecha_anulacion');
    table.string('descripcion');
    table.string('codigo_moneda', 3).notNullable().defaultTo('GTQ');
    table.decimal('monto_total', 13, 2).notNullable().defaultTo(0);
    table.string('codigo_unidad', 2).notNullable().defaultTo('U');
    table.decimal('unidad', 13, 2);
    table.integer('cod_maestro').references('cod_maestro').inTable('registros.maestro')
      .onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
  });

  // Tabla porcentajes_depreciacion
  await knex.schema.withSchema('registros').createTable('porcentajes_depreciacion', (table) => {
    table.increments('cod_tipo_depreciacion').primary();
    table.string('descripcion').notNullable();
    table.decimal('porcentaje_depreciacion_anual', 5, 2).notNullable();
  });

  // Insertar información en la tabla porcentajes_depreciacion
  await knex('registros.porcentajes_depreciacion').insert([
    { descripcion: 'Equipo de computación', porcentaje_depreciacion_anual: 33.33 }
  ]);

  // Tabla herramienta
  await knex.schema.withSchema('registros').createTable('herramienta', (table) => {
    table.increments('cod_herramienta').primary();
    table.integer('cod_tipo_depreciacion').references('cod_tipo_depreciacion').inTable('registros.porcentajes_depreciacion')
      .onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.integer('cod_usuario_responsable').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.integer('cod_usuario_creacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.date('fecha_adquisicion').defaultTo(knex.fn.now());
    table.boolean('activo').notNullable().defaultTo(true);
    table.integer('cod_usuario_anulacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table.date('fecha_anulacion');
    table.string('descripcion');
    table.string('codigo_moneda', 3).notNullable().defaultTo('GTQ');
    table.decimal('monto', 13, 2);
    table.decimal('consumo_electrico', 13, 2);
    table.string('codigo_medida_electricidad', 1).defaultTo('W');
  });

  // Tabla detalle_servicio
  await knex.schema.withSchema('registros').createTable('detalle_servicio', (table) => {
    table.increments('cod_detalle_servicio').primary();
    table.integer('cod_herramienta').references('cod_herramienta').inTable('registros.herramienta')
      .onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.integer('cod_usuario_creacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.boolean('activo').notNullable().defaultTo(true);
    table.integer('cod_usuario_anulacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table.date('fecha_anulacion');
    table.string('descripcion');
    table.string('codigo_moneda', 3).notNullable().defaultTo('GTQ');
    table.decimal('tiempo_uso', 13, 2);
    table.decimal('total_consumo_energetico', 13, 2);
    table.decimal('total_depreciacion', 13, 2);
    table.decimal('total_horas_servicio', 13, 2);
    table.string('codigo_tiempo_uso', 1).notNullable().defaultTo('H');
    table.decimal('monto_total', 13, 2);
    table.integer('cod_maestro').references('cod_maestro').inTable('registros.maestro')
      .onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
  });

  // Tabla costo_fijos
  await knex.schema.withSchema('registros').createTable('costo_fijos', (table) => {
    table.increments('cod_costo_fijo').primary();
    table.integer('cod_usuario_creacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.boolean('activo').defaultTo(true).notNullable();
    table.integer('cod_usuario_anulacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table.date('fecha_anulacion');
    table.string('descripcion');
    table.string('codigo_moneda', 3).defaultTo('GTQ').notNullable();
    table.decimal('monto', 13, 2);
    table.decimal('cantidad', 13, 2);
  });

  // Tabla movimiento_materia_prima
  await knex.schema.withSchema('registros').createTable('movimiento_materia_prima', (table) => {
    table.increments('cod_movimiento_materia_prima').primary();
    table.integer('cod_usuario_creacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.integer('cod_usuario_anulacion').references('cod_usuario').inTable('sistema.usuarios')
      .onDelete('RESTRICT').onUpdate('CASCADE');
    table.boolean('activo').defaultTo(true).notNullable();
    table.date('fecha_anulacion');
    table.string('descripcion');
    table.string('codigo_moneda', 3).defaultTo('GTQ').notNullable();
    table.decimal('monto', 13, 2);
    table.decimal('cantidad', 13, 2);
  });

  // Agregar columnas de relación
  await knex.schema.withSchema('registros').table('detalle_servicio', (table) => {
    table.integer('cod_costo_fijo').references('cod_costo_fijo').inTable('registros.costo_fijos')
      .onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.integer('cod_movimiento_materia_prima').references('cod_movimiento_materia_prima').inTable('registros.movimiento_materia_prima')
      .onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
  });
  // Crear funciones y triggers
  await knex.raw(`
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
      `);

  await knex.raw(`
          CREATE TRIGGER trigger_actualizar_maestro_bien
          AFTER INSERT OR UPDATE ON registros.detalle_bien
          FOR EACH ROW
          EXECUTE FUNCTION actualizar_monto_total_maestro();
      `);

  await knex.raw(`
          CREATE TRIGGER trigger_actualizar_maestro_servicio
          AFTER INSERT OR UPDATE ON registros.detalle_servicio
          FOR EACH ROW
          EXECUTE FUNCTION actualizar_monto_total_maestro();
      `);

  await knex.raw(`
          CREATE OR REPLACE FUNCTION calcular_montos_maestro()
          RETURNS TRIGGER AS $$
          DECLARE
            base_total NUMERIC;
            tasa_impuesto_ajustada NUMERIC;
          BEGIN
            -- Calcular el monto de la ganancia
            NEW.monto_ganancia := NEW.monto_total * (NEW.porcentaje_ganancia / 100.0);

            -- Calcular la base total sobre la cual se aplicará el impuesto
            base_total := NEW.monto_total + NEW.monto_ganancia;

            -- Calcular la tasa de impuesto ajustada
            tasa_impuesto_ajustada := NEW.porcentaje_impuesto / (100.0 - NEW.porcentaje_impuesto);

            -- Calcular el monto del impuesto
            NEW.monto_impuesto := base_total * tasa_impuesto_ajustada;

            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
      `);

  await knex.raw(`
          CREATE TRIGGER trigger_calcular_montos_maestro
          BEFORE INSERT OR UPDATE ON registros.maestro
          FOR EACH ROW
          EXECUTE FUNCTION calcular_montos_maestro();
      `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TRIGGER IF EXISTS trigger_actualizar_maestro_bien ON registros.detalle_bien;
    DROP TRIGGER IF EXISTS trigger_actualizar_maestro_servicio ON registros.detalle_servicio;
    DROP FUNCTION IF EXISTS actualizar_monto_total_maestro;

    DROP TRIGGER IF EXISTS trigger_calcular_montos_maestro ON registros.maestro;
    DROP FUNCTION IF EXISTS calcular_montos_maestro;
    
    DROP SCHEMA registros CASCADE;
`);
}
