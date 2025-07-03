import type { Knex } from 'knex';

// Cria a tabela intermediária 'eco_tags' para relação muitos-para-muitos entre ecos e tags
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('eco_tags', (table) => {
    table
      .uuid('eco_id')
      .notNullable()
      .references('id')
      .inTable('eco')
      .onDelete('CASCADE');
    // FK: eco_id referencia o eco. Ao deletar o eco, apaga automaticamente suas relações.

    table
      .uuid('tag_id')
      .notNullable()
      .references('id')
      .inTable('tags')
      .onDelete('CASCADE');
    // FK: tag_id referencia a tag. Se uma tag for deletada (geralmente não ocorre), apaga a relação.

    table.primary(['eco_id', 'tag_id']);
    // Chave primária composta: garante que cada combinação eco-tag é única
    // (um eco não pode ter a mesma tag duas vezes).

    table.timestamp('created_at').defaultTo(knex.fn.now());
    // (Opcional) timestamp para monitorar quando a tag foi associada ao eco.
  });
}

// Ao dar rollback, exclui a tabela 'eco_tags'
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('eco_tags');
}
