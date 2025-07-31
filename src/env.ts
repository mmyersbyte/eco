import { z } from 'zod';
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env); // Aqui tipamos o objeto process.env com o Zod, garantindo que as variáveis de ambiente estejam corretas
