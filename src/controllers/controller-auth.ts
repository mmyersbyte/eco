import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import type { Register } from '../@types/register.d.ts';
import { authConfig } from '../config/auth.ts';
import { knexInstance } from '../database/knex.ts';
import { AppError } from '../utils/AppError.ts';

class AuthController {
  // Esquema de validação para login
  private static loginSchema = z.object({
    email: z.string().email({ message: 'Email inválido.' }),
    senha: z
      .string()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  });

  async auth(request: Request, response: Response, next: NextFunction) {
    try {
      // Validação dos dados recebidos
      const validation = AuthController.loginSchema.safeParse(request.body);
      if (!validation.success) {
        const errorMessage =
          validation.error.errors[0]?.message || 'Dados inválidos.';
        throw new AppError(`Erro de validação: ${errorMessage}`, 400);
      }
      const { email, senha } = validation.data;

      // Busca usuário pelo email
      const user = await knexInstance<Register>('register')
        .where({ email })
        .first();

      if (!user) {
        throw new AppError('Usuário ou senha inválidos.', 401);
      }

      // Compara senha enviada com o hash
      const passwordMatch = await bcrypt.compare(senha, user.senha);

      if (!passwordMatch) {
        throw new AppError('Usuário ou senha inválidos.', 401);
      }

      // Gera o token JWT apenas com o id do usuário
      const token = jwt.sign(
        {}, // Payload vazio, pois só há um tipo de usuário
        authConfig.jwt.secret,
        {
          subject: user.id, // ID do usuário como subject
          expiresIn: authConfig.jwt.expiresIn, // Expiração do token
        }
      );

      // Envia o token como cookie httpOnly
      return response
        .cookie('token', token, {
          httpOnly: true, // Só servidor acessa
          secure: process.env.NODE_ENV === 'production', // HTTPS em prod
          sameSite: 'strict', // Proteção CSRF
          maxAge: 24 * 60 * 60 * 1000, // 24 horas
        })
        .status(200)
        .json({
          message: 'Login realizado com sucesso!',
          user: {
            id: user.id,
            codinome: user.codinome,
            avatar_url: user.avatar_url,
            genero: user.genero,
          },
        });
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await knexInstance<Register>('register').select('*');
      return response.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
}

export { AuthController };
