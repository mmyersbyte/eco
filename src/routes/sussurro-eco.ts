import { Router } from 'express';
import { SussurroController } from '../controllers/controller-sussurro.ts';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated .ts'; //] Middleware para proteger rotas

const sussurroRoutes = Router();
const sussurroController = new SussurroController();
sussurroRoutes.get('/', sussurroController.index);

// Protege a rota de criação de sussurro

sussurroRoutes.use(ensureAuthenticated);
sussurroRoutes.post('/', sussurroController.create);
sussurroRoutes.patch('/:id', sussurroController.update);
sussurroRoutes.delete('/:id', sussurroController.delete);
export { sussurroRoutes };
