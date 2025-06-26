import { Router } from 'express';
import { SussurroController } from '../controllers/controller-sussurro.ts';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated .ts'; //] Middleware para proteger rotas

const sussurroRoutes = Router();
const sussurroController = new SussurroController();

// Protege a rota de criação de sussurro: só usuários autenticados podem comentar
sussurroRoutes.post('/', ensureAuthenticated, sussurroController.create);
sussurroRoutes.get('/', sussurroController.index);
sussurroRoutes.patch('/:id', sussurroController.update);
sussurroRoutes.delete('/:id', sussurroController.delete);
export { sussurroRoutes };
