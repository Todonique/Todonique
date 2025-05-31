import pg from 'pg';
import config from '.';

const pool = new pg.Pool({
    host: config.dbHost,
    database: config.dbName,
    user: config.dbUser,
    password: config.dbPassword,
    ssl: { 
        rejectUnauthorized: false 
    }
});

export default pool;