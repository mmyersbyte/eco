import { NextFunction, Request, Response } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import { knexInstance } from '../database/knex.js';
import { AppError } from '../utils/AppError.js';

class TagController {
  // Listar todas as tags
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const tags = await knexInstance('tags')
        .select('*')
        .orderBy('nome', 'asc');
      return response.json({ tags });
    } catch (error) {
      next(error);
    }
  }

  // Criar nova tag ( uso de admin)
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // Validação básica
      const tagSchema = z.object({
        nome: z.string().min(1).max(40),
      });
      const validation = tagSchema.safeParse(request.body);
      if (!validation.success) {
        throw new AppError('Nome de tag inválido.', 400);
      }

      const { nome } = validation.data;

      // Verifica se já existe a tag
      const tagExists = await knexInstance('tags').where({ nome }).first();
      if (tagExists) {
        throw new AppError('Tag já cadastrada.', 409);
      }

      const [tag] = await knexInstance('tags')
        .insert({
          id: crypto.randomUUID(),
          nome,
        })
        .returning('*');

      return response.status(201).json({ message: 'Tag criada!', tag });
    } catch (error) {
      next(error);
    }
  }
}

export { TagController };
