import { Router } from 'express';
import { EcoController } from '../controllers/controller-eco.ts';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated .ts'; //] Middleware para proteger rotas

const ecoRoutes = Router();
const ecoController = new EcoController();

// Protege a rota de criação de eco: só usuários autenticados podem criar
ecoRoutes.post('/', ensureAuthenticated, ecoController.create);
ecoRoutes.get('/', ecoController.index);
ecoRoutes.patch('/:id', ecoController.update);
ecoRoutes.delete('/:id', ecoController.delete);
ecoRoutes.get('/:id', ecoController.show);
export { ecoRoutes };
