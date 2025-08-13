import { z } from 'zod';

export const sussurroSchema = z.object({
  eco_id: z.string().uuid({ message: 'ID do eco inválido.' }),
  conteudo: z
    .string()
    .min(1, { message: 'Comentário obrigatório.' })
    .max(144, { message: 'Comentário pode ter até 144 caracteres.' }),
});
