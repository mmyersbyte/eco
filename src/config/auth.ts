import { env } from '../env.js';
export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: '1d',
    path: '/',
  },
};
