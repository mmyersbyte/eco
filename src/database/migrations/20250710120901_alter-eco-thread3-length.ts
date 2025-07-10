import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('eco', (table) => {
    table.string('thread_3', 244).alter(); // Aumenta thread_3 de 144 para 244 caracteres
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('eco', (table) => {
    table.string('thread_3', 144).alter(); // Reverte para 144 caracteres
  });
}

// Aumenta o limite da thread_3 para 244 caracteres
