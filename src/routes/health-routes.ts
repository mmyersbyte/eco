import { Router } from 'express';

const healthRoutes = Router();

// Endpoint de health check - otimizado para Render (anti-sleep)
healthRoutes.get('/', (req, res) => {
  // Headers para evitar cache e manter conexão ativa
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    'Keep-Alive': 'timeout=5, max=1000',
    Connection: 'keep-alive',
  });

  // Resposta
  res.status(200).json({
    status: 'OK',
    timestamp: Date.now(), // Timestamp simples para ping tracking
  });
});

export { healthRoutes };

// Endpoint de health check - otimizado para Render (anti-sleep)
