import { randomUUID } from 'crypto';
import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import app from '../src/app';
import { knexInstance } from '../src/database/knex'; // ajuste o caminho se necessário

// Função utilitária para gerar um email único a cada execução
function randomEmail() {
  return `testuser_${randomUUID()}@test.com`;
}

// Função utilitária para gerar um codinome único a cada execução
function randomCodinome() {
  return `TestUser_${randomUUID().slice(0, 8)}`;
}

// Testes para a API de autenticação (registro de usuário)
// Cada teste cobre um cenário importante do fluxo de autenticação

describe('Register API', () => {
  // Após todos os testes, remove do banco os usuários criados durante os testes
  afterAll(async () => {
    await knexInstance('register')
      .where('email', 'like', 'testuser_%@test.com')
      .orWhere('codinome', 'like', 'TestUser_%')
      .del();
  });

  // Testa se o cadastro de um novo usuário com dados válidos funciona corretamente
  it('should register a new user with valid data', async () => {
    const newUser = {
      email: randomEmail(), // email único
      senha: 'senha123', // senha válida
      codinome: randomCodinome(), // codinome único
      genero: 'M',
      avatar_url: 'https://example.com/avatar.png',
    };

    // Faz a requisição de cadastro
    const response = await request(app).post('/register').send(newUser);

    // Espera status 201 (criado)
    expect(response.status).toBe(201);
    // Deve retornar o objeto user
    expect(response.body).toHaveProperty('user');
    // Não deve retornar o token no body
    expect(response.body).not.toHaveProperty('token');
    // O usuário deve ter um id gerado
    expect(response.body.user).toHaveProperty('id');
    // O email não deve ser retornado por segurança
    expect(response.body.user.email).toBeUndefined();
    // O token deve estar no cookie
    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const cookiesArr = Array.isArray(cookies) ? cookies : [cookies];
    const tokenCookie = cookiesArr.find((c) => c.startsWith('token='));
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie).toMatch(/HttpOnly/);
  });

  // Testa se o sistema impede cadastro com email já existente
  it('should not allow registration with an existing email', async () => {
    const email = randomEmail(); // email único para o teste
    const userData = {
      email,
      senha: 'senha123',
      codinome: randomCodinome(),
      genero: 'F',
      avatar_url: 'https://example.com/avatar2.png',
    };

    // Primeiro cadastro com sucesso
    const firstResponse = await request(app).post('/register').send(userData);
    expect(firstResponse.status).toBe(201); // Garantir que o primeiro cadastro foi bem-sucedido

    // Segunda tentativa com o mesmo email, mas codinome diferente
    const response = await request(app)
      .post('/register')
      .send({
        ...userData,
        codinome: randomCodinome(), // codinome diferente, mas email igual
      });

    // Espera status 409 (conflito)
    expect(response.status).toBe(409);
    // Deve retornar status de erro e mensagem explicativa
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
  });

  // Testa se o sistema rejeita dados inválidos no cadastro
  it('should not allow registration with invalid data', async () => {
    const invalidUser = {
      email: 'not-an-email', // email inválido
      senha: '123', // senha muito curta
      codinome: '', // codinome vazio
      genero: 'X', // gênero inválido
      avatar_url: 'not-a-url', // url inválida
    };

    // Tenta cadastrar com dados inválidos
    const response = await request(app).post('/register').send(invalidUser);

    // Espera status 400 (bad request)
    expect(response.status).toBe(400);
    // Deve retornar status de erro e mensagem explicativa
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message');
  });
});
