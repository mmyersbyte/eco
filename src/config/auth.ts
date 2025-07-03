import dotenv from 'dotenv';
dotenv.config();
export const authConfig = {
  jwt: {
    secret: process.env.AUTH_SECRET || 'default',
    expiresIn: '1d',
  },
};
