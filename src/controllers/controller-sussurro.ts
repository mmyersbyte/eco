import type { Sussurro } from '@/@types/sussurro.ts';
import { NextFunction, Request, Response } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import { knexInstance } from '../database/knex.ts';
import { AppError } from '../utils/AppError.ts';

// Validação do sussurro (comentário)
const sussurroSchema = z.object({
  eco_id: z.string().uuid({ message: 'ID do eco inválido.' }),
  conteudo: z
    .string()
    .min(1, { message: 'Comentário obrigatório.' })
    .max(144, { message: 'Comentário pode ter até 144 caracteres.' }),
});

class SussurroController {
  // Listar todos os sussurros (ou listar por eco, se quiser)
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { eco_id } = request.query;

      let sussurros;
      if (eco_id) {
        sussurros = await knexInstance<Sussurro>('sussurro')
          .join('register', 'sussurro.user_id', 'register.id')
          .where('sussurro.eco_id', eco_id as string)
          .select(
            'sussurro.id',
            'sussurro.conteudo',
            'sussurro.created_at',
            'register.codinome',
            'register.avatar_url'
          );
      } else {
        sussurros = await knexInstance<Sussurro>('sussurro')
          .join('register', 'sussurro.user_id', 'register.id')
          .select(
            'sussurro.id',
            'sussurro.eco_id',
            'sussurro.conteudo',
            'sussurro.created_at',
            'register.codinome',
            'register.avatar_url'
          );
      }

      return response.json({ sussurros });
    } catch (error) {
      next(error);
    }
  }

  // Criar um novo sussurro (comentário)
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const validation = sussurroSchema.safeParse(request.body);
      if (!validation.success) {
        const errorMessage =
          validation.error.errors[0]?.message || 'Dados inválidos.';
        throw new AppError(`Erro de validação: ${errorMessage}`, 400);
      }

      const { eco_id, conteudo } = validation.data;
      if (!request.user) {
        throw new AppError('Usuário não autenticado.', 401);
      }
      const user_id = request.user.id;

      // Verifica se o eco existe
      const ecoExists = await knexInstance('eco').where({ id: eco_id }).first();
      if (!ecoExists) {
        throw new AppError('Eco não encontrado.', 404);
      }

      // Verifica se o usuário já comentou neste eco
      const jaComentou = await knexInstance('sussurro')
        .where({ eco_id, user_id })
        .first();
      if (jaComentou) {
        throw new AppError('Você já comentou neste eco.', 400);
      }

      // Limite de 5 sussurros por eco
      const sussurrosCount = await knexInstance('sussurro')
        .where({ eco_id })
        .count<{ count: string }>('id as count')
        .first();
      if (Number(sussurrosCount?.count || 0) >= 5) {
        throw new AppError('Limite de 5 sussurros por eco atingido.', 400);
      }

      // Cria o sussurro
      const [sussurro] = await knexInstance<Sussurro>('sussurro')
        .insert({
          id: crypto.randomUUID(),
          eco_id,
          user_id,
          conteudo,
        })
        .returning('*');

      return response
        .status(201)
        .json({ message: 'Comentário criado com sucesso!', sussurro });
    } catch (error) {
      next(error);
    }
  }

  // Atualizar um sussurro existente
  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const schemaPartial = sussurroSchema.omit({ eco_id: true }).partial();
      const validation = schemaPartial.safeParse(request.body);
      if (!validation.success) {
        const errorMessage =
          validation.error.errors[0]?.message || 'Dados inválidos.';
        throw new AppError(`Erro de validação: ${errorMessage}`, 400);
      }
      const updateData = validation.data;
      const sussurroExists = await knexInstance<Sussurro>('sussurro')
        .where({ id })
        .first();
      if (!sussurroExists) {
        throw new AppError('Comentário não encontrado.', 404);
      }
      const [sussurro] = await knexInstance<Sussurro>('sussurro')
        .where({ id })
        .update(updateData)
        .returning('*');
      return response.json({
        message: 'Comentário atualizado com sucesso!',
        sussurro,
      });
    } catch (error) {
      next(error);
    }
  }

  // Deletar um sussurro
  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const sussurroExists = await knexInstance<Sussurro>('sussurro')
        .where({ id })
        .first();
      if (!sussurroExists) {
        throw new AppError('Comentário não encontrado.', 404);
      }
      await knexInstance<Sussurro>('sussurro').where({ id }).delete();
      return response.json({ message: 'Comentário deletado com sucesso!' });
    } catch (error) {
      next(error);
    }
  }
}

export { SussurroController };
