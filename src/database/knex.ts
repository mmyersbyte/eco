import knex from 'knex';
import config from '../../knexfile.ts';

export const knexInstance = knex(config.development);
