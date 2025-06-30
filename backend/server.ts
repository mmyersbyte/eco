import app from './src/app.ts';

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
