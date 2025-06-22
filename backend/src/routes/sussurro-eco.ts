import { Router } from 'express';
import { SussurroController } from '../controllers/controller-sussurro.ts';

const sussurroRoutes = Router();
const sussurroController = new SussurroController();

// POST /login
sussurroRoutes.post('/', sussurroController.create);
sussurroRoutes.get('/', sussurroController.index);
sussurroRoutes.patch('/:id', sussurroController.update);
sussurroRoutes.delete('/:id', sussurroController.delete);
export { sussurroRoutes };
