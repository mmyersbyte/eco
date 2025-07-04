import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os usuários existentes
  await knex('register').del();

  // Cria usuários fictícios para os ecos
  const users = [
    {
      id: randomUUID(),
      email: 'alma.perdida@exemplo.com',
      senha: await bcrypt.hash('123456', 10),
      codinome: 'Alma Perdida',
      genero: 'F',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alma',
    },
    {
      id: randomUUID(),
      email: 'viajante.noturno@exemplo.com',
      senha: await bcrypt.hash('123456', 10),
      codinome: 'Viajante Noturno',
      genero: 'M',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viajante',
    },
    {
      id: randomUUID(),
      email: 'coracao.partido@exemplo.com',
      senha: await bcrypt.hash('123456', 10),
      codinome: 'Coração Partido',
      genero: 'O',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coracao',
    },
    {
      id: randomUUID(),
      email: 'sonhador.eterno@exemplo.com',
      senha: await bcrypt.hash('123456', 10),
      codinome: 'Sonhador Eterno',
      genero: 'M',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sonhador',
    },
    {
      id: randomUUID(),
      email: 'guerreira.silenciosa@exemplo.com',
      senha: await bcrypt.hash('123456', 10),
      codinome: 'Guerreira Silenciosa',
      genero: 'F',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guerreira',
    },
  ];

  await knex('register').insert(users);
}
