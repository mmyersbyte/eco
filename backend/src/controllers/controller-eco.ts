import { Eco } from '@/@types/eco.ts';
import { NextFunction, Request, Response } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import { knexInstance } from '../database/knex.ts';
import { AppError } from '../utils/AppError.ts';

// Schema Zod para criação de eco (recebe array de tag_ids, não mais nomes)
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
  tag_ids: z
    .array(z.string().uuid({ message: 'ID de tag inválido.' }))
    .min(1, { message: 'Pelo menos uma tag é obrigatória.' })
    .max(3, { message: 'No máximo 3 tags por eco.' }),
});

// Para update: só permite editar threads (NÃO permite editar tags)
const ecoUpdateSchema = z.object({
  thread_1: z.string().max(144).optional(),
  thread_2: z.string().max(144).optional(),
  thread_3: z.string().max(144).optional(),
});

class EcoController {
  /**
   * Lista todos os ecos, trazendo também as tags associadas via join.
   */
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      // Busca todos os ecos
      const ecos = await knexInstance<Eco>('eco').select('*');
      // Para cada eco, busca as tags associadas via join (eco_tags + tags)
      const ecosWithTags = await Promise.all(
        ecos.map(async (eco) => {
          const tags = await knexInstance('eco_tags')
            .join('tags', 'eco_tags.tag_id', 'tags.id')
            .where('eco_tags.eco_id', eco.id)
            .select('tags.id', 'tags.nome');
          return { ...eco, tags };
        })
      );
      return response.json({ ecos: ecosWithTags });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria um novo eco. Valida os tag_ids e associa no eco_tags.
   * tags não são editáveis após a criação.
   */
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // Validação dos dados recebidos
      const validation = ecoSchema.safeParse(request.body);
      if (!validation.success) {
        const errorMessage =
          validation.error.errors[0]?.message || 'Dados inválidos.';
        throw new AppError(`Erro de validação: ${errorMessage}`, 400);
      }

      const { user_id, thread_1, thread_2, thread_3, tag_ids } =
        validation.data;

      // Verifica se o usuário existe
      const userExists = await knexInstance('register')
        .where({ id: user_id })
        .first();
      if (!userExists) {
        throw new AppError('Usuário não encontrado.', 404);
      }

      // Valida se as tags existem e se não há duplicadas
      const uniqueTagIds = Array.from(new Set(tag_ids));
      if (uniqueTagIds.length !== tag_ids.length) {
        throw new AppError('Não repita tags no mesmo eco.', 400);
      }
      const foundTags = await knexInstance('tags')
        .whereIn('id', uniqueTagIds)
        .select('id');
      if (foundTags.length !== uniqueTagIds.length) {
        throw new AppError('Uma ou mais tags não existem.', 400);
      }

      // Cria o eco
      const ecoId = crypto.randomUUID();
      const [eco] = await knexInstance<Eco>('eco')
        .insert({
          id: ecoId,
          user_id,
          thread_1,
          thread_2: thread_2 || null,
          thread_3: thread_3 || null,
        })
        .returning('*');

      // Associa as tags na tabela eco_tags
      const ecoTagsToInsert = uniqueTagIds.map((tag_id) => ({
        eco_id: ecoId,
        tag_id,
      }));
      await knexInstance('eco_tags').insert(ecoTagsToInsert);

      // Busca as tags para retornar junto
      const tags = await knexInstance('tags')
        .whereIn('id', uniqueTagIds)
        .select('id', 'nome');

      return response
        .status(201)
        .json({ message: 'Eco criado com sucesso!', eco: { ...eco, tags } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza threads de um eco (tags não podem ser editadas).
   */
  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
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

      // Atualiza o eco (apenas threads)
      const [eco] = await knexInstance<Eco>('eco')
        .where({ id })
        .update(updateData)
        .returning('*');

      // Busca as tags para retornar junto
      const tags = await knexInstance('eco_tags')
        .join('tags', 'eco_tags.tag_id', 'tags.id')
        .where('eco_tags.eco_id', eco.id)
        .select('tags.id', 'tags.nome');

      return response.json({
        message: 'Eco atualizado com sucesso!',
        eco: { ...eco, tags },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deleta um eco e suas associações em eco_tags (cascata).
   */
  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      // Verifica se o eco existe
      const ecoExists = await knexInstance<Eco>('eco').where({ id }).first();
      if (!ecoExists) {
        throw new AppError('Eco não encontrado.', 404);
      }
      // Deleta o eco (eco_tags serão deletadas pelo CASCADE)
      await knexInstance<Eco>('eco').where({ id }).delete();

      return response.json({ message: 'Eco deletado com sucesso!' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mostra um eco individual, suas tags e seus sussurros (comentários).
   */
  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      // Busca o eco pelo id
      const eco = await knexInstance<Eco>('eco').where({ id }).first();
      if (!eco) {
        throw new AppError('Eco não encontrado.', 404);
      }

      // Busca as tags
      const tags = await knexInstance('eco_tags')
        .join('tags', 'eco_tags.tag_id', 'tags.id')
        .where('eco_tags.eco_id', eco.id)
        .select('tags.id', 'tags.nome');

      // Busca todos os sussurros ligados a esse eco
      const sussurros = await knexInstance('sussurro')
        .where({ eco_id: id })
        .select('*');

      // Retorna tudo junto
      return response.json({ ...eco, tags, sussurros });
    } catch (error) {
      next(error);
    }
  }
}

export { EcoController };
