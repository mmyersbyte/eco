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
