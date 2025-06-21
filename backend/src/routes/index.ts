import { Router } from 'express';
import { registerRoutes } from './register-routes.ts';
export const routes = Router();
routes.use('/register', registerRoutes);
