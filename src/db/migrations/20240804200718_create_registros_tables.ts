import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Crear esquema 'registros'
  await knex.schema.createSchema('registros');

  // Crear tabla 'usuarios'
  await knex.schema.withSchema('registros').createTable('usuarios', (table) => {
    table.increments('cod_usuario').primary();
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.string('nombres').notNullable();
    table.string('apellidos').notNullable();
    table.string('usuario').notNullable();
    table.string('password', 64).notNullable();
    table.boolean('activo').notNullable().defaultTo(true);
    table.date('fecha_inactivacion');
  });

  // Crear tabla 'porcentajes_depreciacion'
  await knex.schema.withSchema('registros').createTable('porcentajes_depreciacion', (table) => {
    table.increments('cod_tipo_depreciacion').primary();
    table.string('descripcion').notNullable();
    table.decimal('porcentaje_depreciacion_anual', 5, 2).notNullable();
  });

  // Insertar información en la tabla 'porcentajes_depreciacion'
  await knex('registros.porcentajes_depreciacion').insert([
    { descripcion: 'Edificios, construcciones e instalaciones adheridas a los inmuebles y sus mejoras', porcentaje_depreciacion_anual: 5.00 },
    { descripcion: 'Árboles, arbustos, frutales y especies vegetales que produzcan frutos o productos que generen rentas gravadas, incluidos los gastos capitalizables para formar las plantaciones', porcentaje_depreciacion_anual: 15.00 },
    { descripcion: 'Instalaciones no adheridas a los inmuebles, mobiliario y equipo de oficina, buques - tanques, barcos y material ferroviario, marítimo, fluvial o lacustre', porcentaje_depreciacion_anual: 20.00 },
    { descripcion: 'Los semovientes utilizados como animales de carga o de trabajo, maquinaria, vehículos en general, grúas, aviones, remolques, semirremolques, contenedores y material rodante de todo tipo, excluido el ferroviario', porcentaje_depreciacion_anual: 20.00 },
    { descripcion: 'Equipo de computación', porcentaje_depreciacion_anual: 33.33 },
    { descripcion: 'Herramientas, porcelana, cristalería, mantelería, cubiertos y similares', porcentaje_depreciacion_anual: 25.00 },
    { descripcion: 'Reproductores de raza, machos y hembras, la depreciación se calcula sobre el valor de costo de tales animales menos su valor como ganado común', porcentaje_depreciacion_anual: 25.00 },
    { descripcion: 'Para los bienes muebles no indicados en los incisos anteriores', porcentaje_depreciacion_anual: 10.00 },
  ]);

  // Crear tabla 'materia_prima'
  await knex.schema.withSchema('registros').createTable('materia_prima', (table) => {
    table.increments('cod_materia_prima').primary();
    table.integer('cod_usuario_creacion').references('cod_usuario').inTable('registros.usuarios');
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.string('descripcion', 300);
    table.string('codigo_moneda', 3).notNullable().defaultTo('GTQ');
    table.decimal('monto', 13, 2);
    table.decimal('cantidad', 13, 2);
    table.string('codigo_unidad', 2);
  });

  // Crear tabla 'herramienta'
  await knex.schema.withSchema('registros').createTable('herramienta', (table) => {
    table.increments('cod_herramienta').primary();
    table.integer('cod_tipo_depreciacion').references('cod_tipo_depreciacion').inTable('registros.porcentajes_depreciacion');
    table.integer('cod_usuario_creacion').references('cod_usuario').inTable('registros.usuarios');
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.boolean('activo').notNullable().defaultTo(true);
    table.integer('cod_usuario_anulacion').references('cod_usuario').inTable('registros.usuarios');
    table.integer('cod_usuario_responsable').references('cod_usuario').inTable('registros.usuarios');
    table.date('fecha_anulacion');
    table.string('descripcion', 300);
    table.string('codigo_moneda', 3).notNullable().defaultTo('GTQ');
    table.decimal('monto', 13, 2);
    table.decimal('consumo_electrico', 13, 2);
  });

  // Crear tabla 'maestro'
  await knex.schema.withSchema('registros').createTable('maestro', (table) => {
    table.increments('cod_maestro').primary();
    table.integer('cod_usuario_creacion').references('cod_usuario').inTable('registros.usuarios');
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.boolean('activo').notNullable().defaultTo(true);
    table.integer('cod_usuario_anulacion').references('cod_usuario').inTable('registros.usuarios');
    table.date('fecha_anulacion');
    table.string('codigo_moneda', 3).notNullable().defaultTo('GTQ');
    table.decimal('monto_total', 13, 2);
    table.decimal('porcentaje_impuesto', 5, 2);
    table.decimal('monto_impuesto', 13, 2);
    table.decimal('precio_kW', 13, 2);
  });

  // Crear tabla 'detalle_bien'
  await knex.schema.withSchema('registros').createTable('detalle_bien', (table) => {
    table.increments('cod_detalle_bien').primary();
    table.integer('cod_materia_prima').references('cod_materia_prima').inTable('registros.materia_prima');
    table.integer('cod_usuario_creacion').references('cod_usuario').inTable('registros.usuarios');
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.boolean('activo').notNullable().defaultTo(true);
    table.integer('cod_usuario_anulacion').references('cod_usuario').inTable('registros.usuarios');
    table.date('fecha_anulacion');
    table.string('codigo_moneda', 3).notNullable().defaultTo('GTQ');
    table.decimal('monto_total', 13, 2);
    table.string('codigo_unidad', 2);
    table.decimal('unidad', 13, 2);
    table.integer('cod_detalle').references('cod_detalle').inTable('registros.maestro');
  });

  // Crear tabla 'detalle_servicio'
  await knex.schema.withSchema('registros').createTable('detalle_servicio', (table) => {
    table.increments('cod_detalle_servicio').primary();
    table.integer('cod_herramienta').references('cod_herramienta').inTable('registros.herramienta');
    table.integer('cod_usuario_creacion').references('cod_usuario').inTable('registros.usuarios');
    table.date('fecha_creacion').defaultTo(knex.fn.now());
    table.boolean('activo').notNullable().defaultTo(true);
    table.integer('cod_usuario_anulacion').references('cod_usuario').inTable('registros.usuarios');
    table.date('fecha_anulacion');
    table.string('codigo_moneda', 3).notNullable().defaultTo('GTQ');
    table.decimal('tiempo_uso', 13, 2);
    table.decimal('unidad', 13, 2);
    table.decimal('monto_total', 13, 2);
    table.integer('cod_detalle').references('cod_detalle').inTable('registros.maestro');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Eliminar las tablas en orden inverso
  await knex.schema.withSchema('registros').dropTableIfExists('detalle_servicio');
  await knex.schema.withSchema('registros').dropTableIfExists('detalle_bien');
  await knex.schema.withSchema('registros').dropTableIfExists('maestro');
  await knex.schema.withSchema('registros').dropTableIfExists('herramienta');
  await knex.schema.withSchema('registros').dropTableIfExists('materia_prima');
  await knex.schema.withSchema('registros').dropTableIfExists('porcentajes_depreciacion');
  await knex.schema.withSchema('registros').dropTableIfExists('usuarios');

  // Eliminar el esquema 'registros'
  await knex.schema.dropSchemaIfExists('registros');
}
