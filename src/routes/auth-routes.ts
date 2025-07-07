import { Router } from 'express';
import { AuthController } from '../controllers/controller-auth.js';

const authRoutes = Router();
const authController = new AuthController();

// POST /login
authRoutes.post('/', authController.auth);
authRoutes.get('/', authController.index);

export { authRoutes };
