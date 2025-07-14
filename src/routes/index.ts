import { Router } from 'express';
import helmet from 'helmet';
import notFoundHandler from '../middlewares/notFoundHandler.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';
import { authRoutes } from './auth-routes.js';
import { ecoRoutes } from './eco-routes.js';
import { healthRoutes } from './health-routes.js';
import { logoutRoutes } from './logout-routes.js';
import { passwordResetRoutes } from './password-reset-routes.js';
import { profileRoutes } from './profile-routes.js';
import { registerRoutes } from './register-routes.js';
import { sussurroRoutes } from './sussurro-eco.js';
import { swaggerRoutes } from './swagger-routes.js';
import { tagRoutes } from './tag-routes.js';

const routes = Router();

routes.use(helmet());

// Health check - sem rate limiting para monitoramento
routes.use('/health', healthRoutes);

routes.use(rateLimiter);
routes.use('/register', registerRoutes);
routes.use('/auth', authRoutes);
routes.use('/eco', ecoRoutes);
routes.use('/sussurro', sussurroRoutes);
routes.use('/profile', profileRoutes);
routes.use('/logout', logoutRoutes);
routes.use('/tags', tagRoutes);
routes.use('/password', passwordResetRoutes);
routes.use(swaggerRoutes);

routes.use(rateLimiter);
routes.use(notFoundHandler);

export { routes };
