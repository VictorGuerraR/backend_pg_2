import path from 'path';
import dotenv from 'dotenv';
import type { Knex } from 'knex';

dotenv.config();

const environment = process.env.ENVIROMENT || 'development';
const bd_conection = process.env.DB_CONECTION || ''

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      connectionString: bd_conection,
    },
    migrations: {
      directory: path.join(__dirname, 'src/db/migrations'),
      tableName: 'knex_migrations',
    },
  },
  staging: {
    client: 'pg',
    connection: {
      connectionString: bd_conection,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, 'src/db/migrations'),
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: bd_conection,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, 'src/db/migrations'),
      tableName: 'knex_migrations',
    },
  },
};

export default config[environment];
