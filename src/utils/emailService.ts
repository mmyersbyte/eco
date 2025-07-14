import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  secure: false, // TLS no 587
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendMail({ to, subject, html, from }: SendMailOptions) {
  const mailOptions = {
    from: from || process.env.SMTP_FROM,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
}

// Template minimalista para reset de senha
export function resetPasswordEmailTemplate(link: string) {
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #fafbfc; color: #222; padding: 32px 0; text-align: center;">
    <div style="max-width: 420px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); padding: 32px 24px;">
      <h2 style="margin-bottom: 8px; font-weight: 600; letter-spacing: -1px;">Redefinir sua senha</h2>
      <p style="font-size: 15px; color: #444; margin-bottom: 24px;">Você solicitou a redefinição de senha para sua conta no <b>Eco Histórias</b>.</p>
      <a href="${link}" style="display: inline-block; background: #222; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 16px; font-weight: 500; margin-bottom: 24px;">Criar nova senha</a>
      <p style="font-size: 13px; color: #888; margin: 24px 0 8px;">Se não foi você, ignore este e-mail. Mas pode ser um sinal: Conheça a <a href="https://ecohistorias.com.br">Eco Histórias</a>.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
      <p style="font-size: 13px; color: #888; margin-bottom: 8px;">Esse link expira em 2 horas.</p>
      <p style="font-size: 13px; color: #aaa; font-style: italic; margin-top: 16px;">“Toda história merece ser ouvida, mesmo que ninguém saiba quem contou.”</p>
      <p style="font-size: 12px; color: #bbb; margin-top: 24px;">Eco Histórias — Compartilhe anonimamente, inspire verdadeiramente.</p>
    </div>
  </div>
  `;
}
