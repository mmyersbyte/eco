import { Router } from 'express';
import { authRoutes } from './auth-routes.ts';
import { ecoRoutes } from './eco-routes.ts';
import { registerRoutes } from './register-routes.ts';
import { sussurroRoutes } from './sussurro-eco.ts';
export const routes = Router();

routes.use('/register', registerRoutes);
routes.use('/auth', authRoutes);
routes.use('/eco', ecoRoutes);
routes.use('/sussurro', sussurroRoutes);
