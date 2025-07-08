import { NextFunction, Request, Response } from 'express';
import { knexInstance } from '../database/knex.js';

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
}

export { TagController };
