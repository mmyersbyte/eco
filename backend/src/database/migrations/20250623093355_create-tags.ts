import type { Knex } from 'knex';

// Cria a tabela 'tags' para armazenar todas as tags oficiais do sistema.
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tags', (table) => {
    table.uuid('id').primary(); // ID único da tag (UUID)
    table.string('nome').unique().notNullable(); // Nome da tag, único e obrigatório (ex: "Conquista")
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Data de criação (opcional, mas útil para analytics)
  });
}

// Deleta a tabela caso a migration seja revertida.
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tags');
}
