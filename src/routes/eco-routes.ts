import { Router } from 'express';
import { EcoController } from '../controllers/controller-eco.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'; //] Middleware para proteger rotas

const ecoRoutes = Router();
const ecoController = new EcoController();
// Usuários não autenticados podem ver todos os ecos
ecoRoutes.get('/', ecoController.index);
ecoRoutes.get('/:id', ecoController.show);

// Protege a rota de criação de eco: só usuários autenticados podem criar, atualizar e deletar
ecoRoutes.use(ensureAuthenticated);
ecoRoutes.post('/', ecoController.create);
ecoRoutes.patch('/:id', ecoController.update);
ecoRoutes.delete('/:id', ecoController.delete);
export { ecoRoutes };
