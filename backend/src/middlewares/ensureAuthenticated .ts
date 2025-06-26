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
  const authHeader = request.headers.authorization;
  // console.log(authHeader); // Para depuração, você pode descomentar esta linha e verificar o valor do cabeçalho de autorização
  // O cabeçalho de autorização deve estar no formato "Bearer <token>"

  if (!authHeader) {
    throw new AppError('JWT token is missing');
  } // Verifica se o cabeçalho de autorização está presente

  const [, token] = authHeader.split(' '); // Remove o "Bearer" do cabeçalho de autorização, dividindo a string em duas partes pois o Bearer vem do postman

  // esse ": user_id" de sub é uma renomeação do subject do token, que é o ID do usuário
  const { sub: user_id, role } = jwt.verify(
    token,
    authConfig.jwt.secret
  ) as TokenPayload; // Verifica o token usando a chave secreta definida no authConfig
  // O verify retorna um objeto com a propriedade sub, que é o subject do token
  // Sub é o subject do token, que é o ID do usuário

  // as tokenPayload é uma interface que define o tipo do payload do token

  // User não existe na interface Request do Express, então precisamos adicionar uma tipagem
  request.user = {
    id: String(user_id),
    role,
  };

  return next();
}

export { ensureAuthenticated };
