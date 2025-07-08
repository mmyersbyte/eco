import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { errorHandling } from '../src/middlewares/errorHandling.js';
import { routes } from '../src/routes/index.js';
const app = express();

app.use(
  cors({
    origin: [
      'https://ecostories-9rc4.vercel.app',
      'http://ecohistorias.com.br',
      'https://ecohistorias.com.br',
      'https://www.ecohistorias.com.br',
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(errorHandling);
export default app;
