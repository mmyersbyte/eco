import { NextFunction, Request, Response } from 'express';

/**
 * Middleware para tratar rotas não encontradas (404).
 * Retorna um JSON padronizado com informações úteis para debug.
 */
export default function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(404).json({
    error: 'Essa rota não existe',
    method: req.method,
    path: req.originalUrl,
  });
}
