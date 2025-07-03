import { rateLimit } from 'express-rate-limit';
/**
 * Middleware de rate limit para proteger a API contra abuso.
 * Limita a 100 requisições por IP a cada 15 minutos.
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: {
    error: 'Muitas requisições. Tente novamente mais tarde.',
  },
  standardHeaders: true, // Retorna rate limit info nos headers padrão
  legacyHeaders: false, // Desativa headers antigos
});
