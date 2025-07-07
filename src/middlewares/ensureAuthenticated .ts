import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.js';
import { AppError } from '../utils/AppError.js';

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  let token = request.cookies?.token;

  if (!token && request.headers.authorization) {
    const parts = request.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    throw new AppError('JWT token is missing', 401);
  }

  try {
    const { sub: user_id } = jwt.verify(token, authConfig.jwt.secret) as {
      sub: string;
    };
    request.user = { id: String(user_id) };
    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}

export { ensureAuthenticated };
