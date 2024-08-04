import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createSchemaIfNotExists('registros')
    .createTable('registros.porcentajes_depreciacion', (table) => {
      table.increments('cod_tipo_depreciacion').primary();
      table.string('descripcion').notNullable();
      table.decimal('porcentaje_depreciacion_anual', 5, 2).notNullable();
    });

  await knex('registros.porcentajes_depreciacion').insert([
    { descripcion: 'Edificios, construcciones e instalaciones adheridas a los inmuebles y sus mejoras', porcentaje_depreciacion_anual: 5.00 },
    { descripcion: 'Árboles, arbustos, frutales y especies vegetales que produzcan frutos o productos que generen rentas gravadas, incluidos los gastos capitalizables para formar las plantaciones', porcentaje_depreciacion_anual: 15.00 },
    { descripcion: 'Instalaciones no adheridas a los inmuebles, mobiliario y equipo de oficina, buques - tanques, barcos y material ferroviario, marítimo, fluvial o lacustre', porcentaje_depreciacion_anual: 20.00 },
    { descripcion: 'Los semovientes utilizados como animales de carga o de trabajo, maquinaria, vehículos en general, grúas, aviones, remolques, semirremolques, contenedores y material rodante de todo tipo, excluido el ferroviario', porcentaje_depreciacion_anual: 20.00 },
    { descripcion: 'Equipo de computación', porcentaje_depreciacion_anual: 33.33 },
    { descripcion: 'Herramientas, porcelana, cristalería, mantelería, cubiertos y similares', porcentaje_depreciacion_anual: 25.00 },
    { descripcion: 'Reproductores de raza, machos y hembras, la depreciación se calcula sobre el valor de costo de tales animales menos su valor como ganado común', porcentaje_depreciacion_anual: 25.00 },
    { descripcion: 'Para los bienes muebles no indicados en los incisos anteriores', porcentaje_depreciacion_anual: 10.00 }
  ]);

  await knex.schema
    .createTable('registros.materia_prima', (table) => {
      table.increments('cod_materia_prima').primary();
      table.string('descripcion', 300);
      table.string('codigo_moneda', 3).defaultTo('GTQ');
      table.decimal('monto', 13, 2);
      table.decimal('cantidad', 13, 2);
      table.string('codigo_unidad', 2);
    })
    .createTable('registros.herramienta', (table) => {
      table.increments('cod_herramienta').primary();
      table.integer('cod_tipo_depreciacion').references('cod_tipo_depreciacion').inTable('registros.porcentajes_depreciacion');
      table.string('descripcion', 300);
      table.string('codigo_moneda', 3).defaultTo('GTQ');
      table.decimal('monto', 13, 2);
      table.boolean('activo');
      table.decimal('consumo_electrico', 13, 2);
    })
    .createTable('registros.maestro', (table) => {
      table.increments('cod_detalle').primary();
      table.date('fecha_creacion').defaultTo(knex.fn.now());
      table.date('fecha_maestro');
      table.string('codigo_moneda', 3).defaultTo('GTQ');
      table.decimal('monto_total', 13, 2);
      table.decimal('porcentaje_impuesto', 5, 2);
      table.decimal('monto_impuesto', 13, 2);
      table.decimal('precio_kW', 13, 2);
    })
    .createTable('registros.detalle_bien', (table) => {
      table.increments('cod_detalle_bien').primary();
      table.integer('cod_materia_prima').references('cod_materia_prima').inTable('registros.materia_prima');
      table.date('fecha_creacion').defaultTo(knex.fn.now());
      table.string('codigo_moneda', 3).defaultTo('GTQ');
      table.decimal('monto_total', 13, 2);
      table.string('codigo_unidad', 2);
      table.decimal('unidad', 13, 2);
      table.integer('cod_detalle').references('cod_detalle').inTable('registros.maestro');
    })
    .createTable('registros.detalle_servicio', (table) => {
      table.increments('cod_servicio').primary();
      table.integer('cod_herramienta').references('cod_herramienta').inTable('registros.herramienta');
      table.date('fecha_creacion').defaultTo(knex.fn.now());
      table.string('codigo_moneda', 3).defaultTo('GTQ');
      table.decimal('tiempo_uso', 13, 2);
      table.decimal('unidad', 13, 2);
      table.decimal('monto_total', 13, 2);
      table.integer('cod_detalle').references('cod_detalle').inTable('registros.maestro');
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists('registros.detalle_servicio')
    .dropTableIfExists('registros.detalle_bien')
    .dropTableIfExists('registros.maestro')
    .dropTableIfExists('registros.herramienta')
    .dropTableIfExists('registros.materia_prima')
    .dropTableIfExists('registros.porcentajes_depreciacion')
    .dropSchemaIfExists('registros');
}
