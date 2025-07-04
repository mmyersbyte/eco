import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { errorHandling } from '../src/middlewares/errorHandling.ts';
import { routes } from '../src/routes/index.ts';
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(errorHandling);
export default app;
