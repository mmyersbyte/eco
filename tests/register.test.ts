import { randomUUID } from 'crypto';
import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import app from '../src/app';
import { knexInstance } from '../src/database/knex';

// Função utilitária para gerar um email único a cada execução
function randomEmail() {
  return `testuser_${randomUUID()}@test.com`;
}

// Função utilitária para gerar um codinome único a cada execução
function randomCodinome() {
  return `TestUser_${randomUUID()}`;
}

// Testes para a API de registro de usuário
// Cada teste cobre um cenário importante do fluxo de cadastro

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
    // Deve retornar o objeto user e o token JWT
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
    // O usuário deve ter um id gerado
    expect(response.body.user).toHaveProperty('id');
    // O email não deve ser retornado por segurança
    expect(response.body.user.email).toBeUndefined();
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
    await request(app).post('/register').send(userData);

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
