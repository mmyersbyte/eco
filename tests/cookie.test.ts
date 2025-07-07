import { randomUUID } from 'crypto';
import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import app from '../src/app';
import { knexInstance } from '../src/database/knex';

// Função utilitária para gerar um email único
function randomEmail() {
  return `testuser_${randomUUID()}@test.com`;
}

// Função utilitária para gerar um codinome único
function randomCodinome() {
  return `TestUser_${randomUUID().slice(0, 8)}`;
}

describe('Auth Cookie', () => {
  // Limpar dados de teste após os testes
  afterAll(async () => {
    await knexInstance('register')
      .where('email', 'like', 'testuser_%@test.com')
      .orWhere('codinome', 'like', 'TestUser_%')
      .del();
  });

  it('deve salvar o token JWT no cookie após login', async () => {
    // Primeiro, criar um usuário
    const userData = {
      email: randomEmail(),
      senha: 'senha123',
      codinome: randomCodinome(),
      genero: 'M',
      avatar_url: 'https://example.com/avatar.png',
    };

    await request(app).post('/register').send(userData);

    // Agora fazer login
    const res = await request(app)
      .post('/auth')
      .send({ email: userData.email, senha: userData.senha });

    // Verifica se o login foi bem-sucedido primeiro
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');

    // Verifica se o cookie 'token' está presente nos headers
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const cookiesArr = Array.isArray(cookies) ? cookies : [cookies];
    const tokenCookie = cookiesArr.find((c: string) => c.startsWith('token='));
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie).toMatch(/HttpOnly/);
  });
});
