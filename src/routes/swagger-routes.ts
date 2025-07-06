import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

const swaggerRoutes = Router();

// Carrega o swagger.json da raiz do projeto
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'swagger.json'), 'utf-8')
);

// Rota para documentação interativa
swaggerRoutes.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { swaggerRoutes };
