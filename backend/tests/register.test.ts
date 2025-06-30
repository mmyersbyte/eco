import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import app from '../src/app';
import { knexInstance } from '../src/database/knex'; // ajuste o caminho se necessário

// Gera um email aleatório para evitar conflito
function randomEmail() {
  return `testuser_${Date.now()}@test.com`;
}

describe('Register API', () => {
  // Limpa o usuário de teste após rodar os testes
  afterAll(async () => {
    await knexInstance('register')
      .where('email', 'like', 'testuser_%@test.com')
      .del();
  });

  it('should register a new user with valid data', async () => {
    const newUser = {
      email: randomEmail(),
      senha: 'senha123',
      codinome: 'TestUser',
      genero: 'M',
      avatar_url: 'https://example.com/avatar.png',
    };

    const response = await request(app).post('/register').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.email).toBeUndefined(); // Não deve retornar email
  });

  it('should not allow registration with an existing email', async () => {
    const email = randomEmail();
    const userData = {
      email,
      senha: 'senha123',
      codinome: 'TestUser2',
      genero: 'F',
      avatar_url: 'https://example.com/avatar2.png',
    };

    // Cria o usuário uma vez
    await request(app).post('/register').send(userData);

    // Tenta criar novamente com o mesmo email
    const response = await request(app)
      .post('/register')
      .send({
        ...userData,
        codinome: 'OutroCodinome',
      });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('error');
  });

  it('should not allow registration with invalid data', async () => {
    const invalidUser = {
      email: 'not-an-email',
      senha: '123', // muito curta
      codinome: '', // vazio
      genero: 'X', // inválido
      avatar_url: 'not-a-url',
    };

    const response = await request(app).post('/register').send(invalidUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
