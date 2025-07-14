import { Router } from 'express';
import { passwordResetController } from '../controllers/controller-password-reset.js';

const passwordResetRoutes = Router();

// Solicitar reset de senha
passwordResetRoutes.post(
  '/forgot-password',
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
