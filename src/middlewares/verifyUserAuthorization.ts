// Middleware para verificar se o usuário está autenticado
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';

function verifyUserAuthorization() {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      throw new AppError('Usuário não autenticado.', 401);
    }
    return next(); // Usuário autenticado, segue para o próximo middleware
  };
}

export { verifyUserAuthorization };
