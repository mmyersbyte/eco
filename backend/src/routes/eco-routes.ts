import { Router } from 'express';
import { EcoController } from '../controllers/controller-eco.ts';

const ecoRoutes = Router();
const ecoController = new EcoController();

// POST /login
ecoRoutes.post('/', ecoController.create);
ecoRoutes.get('/', ecoController.index);
ecoRoutes.patch('/:id', ecoController.update);
ecoRoutes.delete('/:id', ecoController.delete);
ecoRoutes.get('/:id', ecoController.show);
export { ecoRoutes };
