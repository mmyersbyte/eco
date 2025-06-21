import { Router } from 'express';
import { authRoutes } from './auth-routes.ts';
import { registerRoutes } from './register-routes.ts';
export const routes = Router();

routes.use('/register', registerRoutes);
routes.use('/auth', authRoutes);
