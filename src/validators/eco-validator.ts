import z from 'zod';

export const ecoSchema = z.object({
  thread_1: z
    .string()
    .min(100, {
      message: 'Primeira thread deve ter pelo menos 100 caracteres.',
    })
    .max(144, { message: 'No máximo 144 caracteres por thread.' }),
  thread_2: z
    .string()
    .max(144, { message: 'No máximo 144 caracteres por thread.' })
    .optional()
    .or(z.literal('')),
  thread_3: z
    .string()
    .max(244, { message: 'No máximo 244 caracteres na última thread.' })
    .optional()
    .or(z.literal('')),
  tag_ids: z
    .array(z.string().uuid({ message: 'ID de tag inválido.' }))
    .min(1, { message: 'Pelo menos uma tag é obrigatória.' })
    .max(3, { message: 'No máximo 3 tags por eco.' }),
});

// Para update: só permite editar threads (NÃO permite editar tags)
export const ecoUpdateSchema = z.object({
  thread_1: z.string().max(144).optional(),
  thread_2: z.string().max(144).optional(),
  thread_3: z.string().max(244).optional(), // Aumentei o limite para 244 caracteres
});
