import express from 'express';
import { errorHandling } from '../src/middlewares/errorHandling.ts';
import { routes } from '../src/routes/index.ts';
const app = express();
app.use(express.json());
app.use(routes);
app.use(errorHandling);
export default app;
