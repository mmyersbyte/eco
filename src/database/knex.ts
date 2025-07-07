import knex from 'knex';
import config from '../../knexfile.js';

export const knexInstance = knex(config.development);
