import { Router } from 'express';

const logoutRoutes = Router();

// Endpoint para logout: remove o cookie JWT
logoutRoutes.post('/', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    domain:
      process.env.NODE_ENV === 'production'
        ? '.ecohistorias.com.br'
        : undefined,
    path: '/', // importante: deve ser igual ao path do cookie JWT
  });
  res.status(200).json({ message: 'Logout realizado com sucesso!' });
});

export { logoutRoutes };
