import { Eco } from '@/@types/eco.ts';
import { NextFunction, Request, Response } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import { knexInstance } from '../database/knex.ts';
import { AppError } from '../utils/AppError.ts';

// Schema Zod para criação de eco
const ecoSchema = z.object({
  user_id: z.string().uuid({ message: 'ID de usuário inválido.' }),
  thread_1: z
    .string()
    .min(1, { message: 'Primeira thread obrigatória.' })
    .max(144, { message: 'No máximo 144 caracteres por thread.' }),
  thread_2: z
    .string()
    .max(144, { message: 'No máximo 144 caracteres por thread.' })
    .optional()
    .or(z.literal('')),
  thread_3: z
    .string()
    .max(144, { message: 'No máximo 144 caracteres por thread.' })
    .optional()
    .or(z.literal('')),
  tags: z
    .array(z.string().max(40, { message: 'Tag pode ter até 40 caracteres.' }))
    .min(1, { message: 'Pelo menos uma tag é obrigatória.' }),
});

// Para update: **NÃO permite editar tags**
const ecoUpdateSchema = z.object({
  thread_1: z.string().max(144).optional(),
  thread_2: z.string().max(144).optional(),
  thread_3: z.string().max(144).optional(),
  // tags removido! Não pode ser editada
});

class EcoController {
  // Listar todos os ecos
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const ecos: Eco[] = await knexInstance<Eco>('eco').select('*');
      return response.json({ ecos });
    } catch (error) {
      next(error);
    }
  }

  // Criar um novo eco (post)
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // Validação dos dados recebidos
      const validation = ecoSchema.safeParse(request.body);
      if (!validation.success) {
        const errorMessage =
          validation.error.errors[0]?.message || 'Dados inválidos.';
        throw new AppError(`Erro de validação: ${errorMessage}`, 400);
      }

      const { user_id, thread_1, thread_2, thread_3, tags } = validation.data;

      // Verifica se o usuário existe
      const userExists = await knexInstance('register')
        .where({ id: user_id })
        .first();
      if (!userExists) {
        throw new AppError('Usuário não encontrado.', 404);
      }

      // Cria o eco
      const [eco] = await knexInstance<Eco>('eco')
        .insert({
          id: crypto.randomUUID(),
          user_id,
          thread_1,
          thread_2: thread_2 || null,
          thread_3: thread_3 || null,
          tags,
        })
        .returning('*');

      return response
        .status(201)
        .json({ message: 'Eco criado com sucesso!', eco });
    } catch (error) {
      next(error);
    }
  }

  // Atualizar um eco existente (apenas threads, **não pode editar tags**)
  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      // Validação dos dados recebidos (NÃO aceita tags!)
      const validation = ecoUpdateSchema.safeParse(request.body);
      if (!validation.success) {
        const errorMessage =
          validation.error.errors[0]?.message || 'Dados inválidos.';
        throw new AppError(`Erro de validação: ${errorMessage}`, 400);
      }

      const updateData = validation.data;

      // Verifica se o eco existe
      const ecoExists = await knexInstance<Eco>('eco').where({ id }).first();
      if (!ecoExists) {
        throw new AppError('Eco não encontrado.', 404);
      }

      // Atualiza o eco (threads)
      const [eco] = await knexInstance<Eco>('eco')
        .where({ id })
        .update(updateData)
        .returning('*');

      return response.json({ message: 'Eco atualizado com sucesso!', eco });
    } catch (error) {
      next(error);
    }
  }

  // Deletar um eco
  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      // Verifica se o eco existe
      const ecoExists = await knexInstance<Eco>('eco').where({ id }).first();
      if (!ecoExists) {
        throw new AppError('Eco não encontrado.', 404);
      }

      await knexInstance<Eco>('eco').where({ id }).delete();

      return response.json({ message: 'Eco deletado com sucesso!' });
    } catch (error) {
      next(error);
    }
  }

  // Mostrar um eco com todos os seus sussurros (comentários)
  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      // Busca o eco pelo id
      const eco = await knexInstance<Eco>('eco').where({ id }).first();
      if (!eco) {
        throw new AppError('Eco não encontrado.', 404);
      }

      // Busca todos os sussurros ligados a esse eco
      const sussurros = await knexInstance('sussurro')
        .where({ eco_id: id })
        .select('*');

      // Retorna tudo junto
      return response.json({ ...eco, sussurros });
    } catch (error) {
      next(error);
    }
  }
}

export { EcoController };
