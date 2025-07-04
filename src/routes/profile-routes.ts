import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated .ts';

const profileRoutes = Router();

// Endpoint protegido para checar autenticação
profileRoutes.get('/', ensureAuthenticated, (req, res) => {
  res.json({ ok: true, user: req.user });
});

export { profileRoutes };
