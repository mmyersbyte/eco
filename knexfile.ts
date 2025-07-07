import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.CONNECTION_HOST || 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'admin123',
      database: 'ecodatabase',
    },
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/database/seeds',
      extension: 'ts',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.CONNECTION_HOST,
      port: Number(process.env.CONNECTION_PORT) || 5432,
      user: process.env.CONNECTION_USER,
      password: process.env.CONNECTION_PASSWORD,
      database: process.env.CONNECTION_DATABASE,
      ssl: { rejectUnauthorized: false }, // Necessário para Neon!
    },
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
    },
  },
};

export default config;
