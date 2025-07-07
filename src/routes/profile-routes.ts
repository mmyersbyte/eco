import { Router } from 'express';
import { knexInstance } from '../database/knex.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated .js';

const profileRoutes = Router();

// Endpoint protegido para checar autenticação e retornar dados completos do usuário
profileRoutes.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }
    const userId = req.user.id;
    const user = await knexInstance('register')
      .where({ id: userId })
      .select('id', 'codinome', 'avatar_url', 'genero')
      .first();
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json({ ok: true, user });
  } catch (error) {
    next(error);
  }
});

export { profileRoutes };
