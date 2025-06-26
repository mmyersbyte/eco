import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { Register } from '../@types/register.d.ts';
import { authConfig } from '../config/auth.ts';
import { knexInstance } from '../database/knex.ts';
import { AppError } from '../utils/AppError.ts';

class AuthController {
  /**
   * Autentica o usuário e retorna um token JWT se válido.
   * @param request - Request Express
   * @param response - Response Express
   * @param next - NextFunction Express
   * @returns { user, token } se sucesso
   */
  async auth(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, senha } = request.body;

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

      // Retorna apenas dados públicos do usuário e o token
      return response.status(200).json({
        message: 'Login realizado com sucesso!',
        user: {
          id: user.id,
          codinome: user.codinome,
          avatar_url: user.avatar_url,
          genero: user.genero,
        },
        token, // Token JWT para autenticação
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
