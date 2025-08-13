import { z } from 'zod';
export const registerSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  senha: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  // Codinome: apenas letras, números e underline (_), sem espaços ou símbolos especiais
  codinome: z
    .string()
    .min(3, { message: 'Codinome obrigatório.' })
    .max(20, { message: 'Codinome deve ter no máximo 20 caracteres.' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        'Codinome só pode conter letras, números e underline (_), sem espaços ou símbolos.',
    }),
  genero: z.enum(['M', 'F', 'O'], { message: 'Gênero inválido.' }),
  avatar_url: z.string().url({ message: 'URL do avatar inválida.' }),
});
