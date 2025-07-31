import { env } from '../env.js';

export const authConfig = {
  jwt: {
    secret: env.AUTH_SECRET,
    expiresIn: '1d',
    path: '/',
  },
};
