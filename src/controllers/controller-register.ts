import type { Register } from '@/@types/register.ts';
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'node:crypto';
import { z } from 'zod';
import { authConfig } from '../config/auth.js';
import { knexInstance } from '../database/knex.js';
import { AppError } from '../utils/AppError.js';

// Esquema de validação para registro
const registerSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  senha: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  // Codinome: apenas letras, números e underline (_), sem espaços ou símbolos especiais
  codinome: z
    .string()
    .min(3, { message: 'Codinome obrigatório.' })
    .max(20, { message: 'Codinome deve ter no máximo 20 caracteres.' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        'Codinome só pode conter letras, números e underline (_), sem espaços ou símbolos.',
    }),
  genero: z.enum(['M', 'F', 'O'], { message: 'Gênero inválido.' }),
  avatar_url: z.string().url({ message: 'URL do avatar inválida.' }),
});

class RegisterController {
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

      // Busca o usuário recém-criado para retornar ao frontend
      const [user] = await knexInstance('register')
        .where({ email })
        .select('id', 'codinome', 'avatar_url', 'genero')
        .limit(1);

      //] Gera o token JWT apenas com o id do usuário
      const jwtOptions: SignOptions = {
        expiresIn: authConfig.jwt.expiresIn as unknown as string,
        subject: String(user.id),
      };

      const token = jwt.sign({}, String(authConfig.jwt.secret), jwtOptions);

      //] Retorna o usuário criado (com id) e o token JWT no cookie httpOnly
      return response
        .cookie('token', token, {
          httpOnly: true, // Só servidor acessa
          secure: process.env.NODE_ENV === 'production', // HTTPS em prod
          sameSite: 'lax', // Funciona para mesmo domínio
          domain:
            process.env.NODE_ENV === 'production'
              ? '.ecohistorias.com.br'
              : undefined, // Compartilha entre subdomínios
          maxAge: 24 * 60 * 60 * 1000, // 24 horas
          path: '/',
        })
        .status(201)
        .json({ message: 'Usuário registrado com sucesso!', user });
    } catch (error) {
      next(error);
    }
  }
}

export { RegisterController };
