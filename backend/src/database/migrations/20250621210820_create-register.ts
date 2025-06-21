import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('register', (table) => {
    table.uuid('id').primary(); // id será passado pelo backend, não gerado pelo banco
    table.string('email').unique().notNullable();
    table.string('senha').notNullable();
    table.string('codinome').unique().notNullable();
    table.string('genero').notNullable();
    table.string('avatar_url').notNullable();
    table.timestamps(true, true); // created_at e updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('register');
}
