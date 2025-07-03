import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('eco', (table) => {
    table.uuid('id').primary(); // PK
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('register')
      .onDelete('CASCADE'); // FK para register
    table.string('thread_1', 144).notNullable(); // Thread 1 obrigatória
    table.string('thread_2', 144); // Thread 2 opcional
    table.string('thread_3', 144); // Thread 3 opcional
    table.timestamps(true, true); // created_at e updated_at automáticos
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('eco');
}
