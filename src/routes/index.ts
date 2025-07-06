import { Router } from 'express';
import helmet from 'helmet';
import notFoundHandler from '../middlewares/notFoundHandler.ts';
import { rateLimiter } from '../middlewares/rateLimiter.ts';
import { authRoutes } from './auth-routes.ts';
import { ecoRoutes } from './eco-routes.ts';
import { logoutRoutes } from './logout-routes.ts';
import { profileRoutes } from './profile-routes.ts';
import { registerRoutes } from './register-routes.ts';
import { sussurroRoutes } from './sussurro-eco.ts';
import { tagRoutes } from './tag-routes.ts';

export const routes = Router();

routes.use(helmet());
routes.use(rateLimiter);
routes.use('/register', registerRoutes);
routes.use('/auth', authRoutes);
routes.use('/eco', ecoRoutes);
routes.use('/sussurro', sussurroRoutes);
routes.use('/tags', tagRoutes);
routes.use('/profile', profileRoutes);
routes.use('/logout', logoutRoutes);
routes.use(rateLimiter);
routes.use(notFoundHandler);
