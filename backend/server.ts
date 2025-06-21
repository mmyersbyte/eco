import express from 'express';
import { errorHandling } from './src/middlewares/errorHandling.ts';
import { routes } from './src/routes/index.ts';
const app = express();
const PORT = 3333;
app.use(express.json());
app.use(routes);
app.use(errorHandling);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
