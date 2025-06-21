import { Router } from 'express';
import { RegisterController } from '../controllers/controller-register.ts';
const registerRoutes = Router();
const registerController = new RegisterController();

registerRoutes.get('/', registerController.index);
registerRoutes.post('/', registerController.create);

export { registerRoutes };
