import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { passwordResetController } from '../controllers/controller-password-reset.js';

const passwordResetRoutes = Router();

// Rate limiter: 2 requisições por dia por IP
const forgotPasswordLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 2, // máximo 2 requisições por IP
  message: {
    error:
      'Limite de tentativas de reset de senha atingido. Tente novamente amanhã.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Solicitar reset de senha
passwordResetRoutes.post(
  '/forgot-password',
  forgotPasswordLimiter,
  passwordResetController.requestReset
);

// Validar token de reset
passwordResetRoutes.get(
  '/reset-password/:token',
  passwordResetController.validateToken
);

// Resetar senha
passwordResetRoutes.post(
  '/reset-password',
  passwordResetController.resetPassword
);

export { passwordResetRoutes };
