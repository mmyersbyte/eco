import { Register } from '@/@types/register.ts';
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import { knexInstance } from '../database/knex.ts';
import { AppError } from '../utils/AppError.ts';

// Esquema de validação para registro
const registerSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  senha: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  codinome: z.string().min(3, { message: 'Codinome obrigatório.' }),
  genero: z.enum(['M', 'F', 'O'], { message: 'Gênero inválido.' }),
  avatar_url: z.string().url({ message: 'URL do avatar inválida.' }),
});

class RegisterController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await knexInstance<Register>('register').select('*');
      return response.json({ message: 'Usuários encontrados.', users });
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // Validação dos dados recebidos
      const validation = registerSchema.safeParse(request.body);
      if (!validation.success) {
        // Mensagem personalizada do primeiro erro encontrado pelo Zod
        const errorMessage =
          validation.error.errors[0]?.message || 'Dados inválidos.';
        throw new AppError(`Erro de validação: ${errorMessage}`, 400);
      }

      const { email, senha, codinome, genero, avatar_url } = validation.data;

      // 2. Verifica se já existe usuário com o mesmo email ou codinome
      const emailExists = await knexInstance<Register>('register')
        .where({ email })
        .first();
      if (emailExists) {
        throw new AppError('Já existe um usuário com este e-mail.', 409);
      }

      const codinomeExists = await knexInstance<Register>('register')
        .where({ codinome })
        .first();
      if (codinomeExists) {
        throw new AppError('Codinome já está em uso. Escolha outro.', 409);
      }

      const hashedPassword = await bcrypt.hash(senha, 10); // 10 = salt rounds

      await knexInstance('register').insert({
        id: crypto.randomUUID(),
        email,
        senha: hashedPassword,
        codinome,
        genero,
        avatar_url,
      });

      return response
        .status(201)
        .json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
      next(error);
    }
  }
}

export { RegisterController };
