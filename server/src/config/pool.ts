import pg from 'pg';
import { config } from './config';

export const pool = new pg.Pool({
    host: config.dbHost,
    database: config.dbName,
    user: config.dbUser,
    password: config.dbPassword,
    ssl: { 
        rejectUnauthorized: false 
    }
});