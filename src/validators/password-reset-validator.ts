import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32, { message: 'Token inválido.' }),
  newPassword: z
    .string()
    .min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' }),
});
