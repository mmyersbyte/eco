import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.ts';
import { AppError } from '../utils/AppError.ts';
interface TokenPayload {
  role: string; // Define o tipo de role que será usado no token
  sub: string; // Define o tipo de sub que será usado no token, que é
}
function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // 1. Tenta pegar do cookie
  let token = request.cookies?.token;

  // 2. Se não tiver no cookie, tenta no header
  if (!token && request.headers.authorization) {
    const [, headerToken] = request.headers.authorization.split(' ');
    token = headerToken;
  }

  if (!token) {
    throw new AppError('JWT token is missing', 401);
  }

  const { sub: user_id } = jwt.verify(token, authConfig.jwt.secret) as {
    sub: string;
  };
  request.user = { id: String(user_id) };
  return next();
}

export { ensureAuthenticated };
