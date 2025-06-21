import { Router } from 'express';
import { AuthController } from '../controllers/controller-auth.ts';

const authRoutes = Router();
const authController = new AuthController();

// POST /login
authRoutes.post('/', authController.auth);
authRoutes.get('/', authController.index);

export { authRoutes };
