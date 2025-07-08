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
    origin: function (origin, callback) {
      const allowedOrigins = [
        /^https:\/\/(www\.)?ecohistorias\.com\.br$/, // frontend com e sem www
        /^https:\/\/api\.ecohistorias\.com\.br$/, // backend/api
      ];
      if (!origin || allowedOrigins.some((regex) => regex.test(origin))) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(errorHandling);
export default app;
