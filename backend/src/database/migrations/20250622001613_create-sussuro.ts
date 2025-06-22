import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('sussurro', (table) => {
    table.uuid('id').primary(); // PK
    table
      .uuid('eco_id')
      .notNullable()
      .references('id')
      .inTable('eco')
      .onDelete('CASCADE'); // FK para eco
    table.string('conteudo', 144).notNullable();
    table.timestamps(true, true); // created_at e updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('sussurro');
}
