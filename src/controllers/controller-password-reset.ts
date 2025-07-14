import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import { knexInstance } from '../database/knex.js';
import { AppError } from '../utils/AppError.js';
import { resetPasswordEmailTemplate, sendMail } from '../utils/emailService.js';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
});

const resetPasswordSchema = z.object({
  token: z.string().min(32, { message: 'Token inválido.' }),
  newPassword: z
    .string()
    .min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' }),
});

class PasswordResetController {
  // 1. Solicitar reset de senha
  async requestReset(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = forgotPasswordSchema.safeParse(req.body);
      if (!validation.success) {
        throw new AppError(
          validation.error.errors[0]?.message || 'Dados inválidos.',
          400
        );
      }
      const { email } = validation.data;
      // Busca usuário
      const user = await knexInstance('register').where({ email }).first();
      // Sempre responde igual, mesmo se não existir (segurança)
      if (!user) {
        return res.json({
          message:
            'Se o e-mail existir, enviaremos instruções para redefinir a senha.',
        });
      }
      // Gera token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresInMs =
        Number(process.env.RESET_TOKEN_EXPIRES_MS) || 2 * 60 * 60 * 1000; // 2 horas padrão
      const expiresAt = new Date(Date.now() + expiresInMs); // 2 horas
      await knexInstance('password_reset_tokens').insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        token,
        expires_at: expiresAt,
      });
      // Monta link
      const frontendUrl =
        process.env.FRONTEND_URL || 'https://ecohistorias.com.br';
      const resetLink = `${frontendUrl}/reset-password?token=${token}`;
      // Envia e-mail
      await sendMail({
        to: email,
        subject: 'Redefinição de senha - Eco Histórias',
        html: resetPasswordEmailTemplate(resetLink),
      });
      return res.json({
        message:
          'Se o e-mail existir, enviaremos instruções para redefinir a senha.',
      });
    } catch (error) {
      next(error);
    }
  }

  // 2. Validar token de reset
  async validateToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const resetToken = await knexInstance('password_reset_tokens')
        .where({ token })
        .andWhere('expires_at', '>', new Date())
        .whereNull('used_at')
        .first();
      if (!resetToken) {
        throw new AppError('Token inválido ou expirado.', 400);
      }
      return res.json({ valid: true });
    } catch (error) {
      next(error);
    }
  }

  // 3. Resetar senha
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = resetPasswordSchema.safeParse(req.body);
      if (!validation.success) {
        throw new AppError(
          validation.error.errors[0]?.message || 'Dados inválidos.',
          400
        );
      }
      const { token, newPassword } = validation.data;
      const resetToken = await knexInstance('password_reset_tokens')
        .where({ token })
        .andWhere('expires_at', '>', new Date())
        .whereNull('used_at')
        .first();
      if (!resetToken) {
        throw new AppError('Token inválido ou expirado.', 400);
      }
      // Atualiza senha do usuário
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await knexInstance('register')
        .where({ id: resetToken.user_id })
        .update({ senha: hashedPassword });
      // Marca token como usado
      await knexInstance('password_reset_tokens')
        .where({ id: resetToken.id })
        .update({ used_at: new Date() });
      return res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
      next(error);
    }
  }
}

export const passwordResetController = new PasswordResetController();
