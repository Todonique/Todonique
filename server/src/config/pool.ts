import pg from 'pg';
import { config } from './config';

const pool = new pg.Pool({
    host: config.dbHost,
    database: config.dbName,
    user: config.dbUser,
    password: config.dbPassword,
    port: config.dbPort,
    ssl: false
});

// ping the database to ensure connection is established
pool.connect().then(() => console.log('Database connected successfully')).catch(err => {
    if(config.nodeEnv === 'development') {
        console.error('Database connection error:', err);
    }
    process.exit(-1);
});

pool.on('error', (err) => {
    if (config.nodeEnv === 'development') {
        console.error('Unexpected error on idle client', err);
    }
    process.exit(-1);
});

export { pool };
export default pool;