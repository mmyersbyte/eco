import { randomUUID } from 'crypto';
import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deleta todas as tags existentes
  await knex('tags').del();

  // Insere tags básicas para o sistema
  const tags = [
    { id: randomUUID(), nome: 'Ansiedade' },
    { id: randomUUID(), nome: 'Depressão' },
    { id: randomUUID(), nome: 'Relacionamentos' },
    { id: randomUUID(), nome: 'Trabalho' },
    { id: randomUUID(), nome: 'Família' },
    { id: randomUUID(), nome: 'Autoestima' },
    { id: randomUUID(), nome: 'Solidão' },
    { id: randomUUID(), nome: 'Conquistas' },
    { id: randomUUID(), nome: 'Medos' },
    { id: randomUUID(), nome: 'Sonhos' },
    { id: randomUUID(), nome: 'Luto' },
    { id: randomUUID(), nome: 'Amor' },
    { id: randomUUID(), nome: 'Raiva' },
    { id: randomUUID(), nome: 'Esperança' },
    { id: randomUUID(), nome: 'Transformação' },
  ];

  await knex('tags').insert(tags);
}
