import { Router } from 'express';
import { RegisterController } from '../controllers/controller-register.js';
const registerRoutes = Router();
const registerController = new RegisterController();

registerRoutes.post('/', registerController.create);

export { registerRoutes };
