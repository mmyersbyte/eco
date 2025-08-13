import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  senha: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});
