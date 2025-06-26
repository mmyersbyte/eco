import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.ts';

function verifyUserAuthorization(role: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !role.includes(request.user.role)) {
      throw new AppError(
        'User does not have permission to perform this action',
        401
      );
    }
    return next(); // SE O USUÁRIO TIVER PERMISSÃO, CHAMA O PRÓXIMO MIDDLEWARE
  };
}
export { verifyUserAuthorization };
