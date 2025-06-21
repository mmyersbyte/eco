import { Register } from '@/@types/register.ts';
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { knexInstance } from '../database/knex.ts';
import { AppError } from '../utils/AppError.ts';

class AuthController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await knexInstance<Register>('register').select('*');
      return response.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

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

      // Aqui você pode retornar só o codinome, id, etc (NUNCA a senha)
      // Futuramente aqui retorna o JWT!
      return response.status(200).json({
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
}

export { AuthController };
