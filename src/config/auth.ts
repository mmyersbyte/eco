import dotenv from 'dotenv';
dotenv.config();
export const authConfig = {
  jwt: {
    secret: String(process.env.AUTH_SECRET || 'default'),
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    path: '/',
  },
};
