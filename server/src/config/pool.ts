import pg from 'pg';

const pool = new pg.Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
    ssl: false
});

// ping the database to ensure connection is established
pool.connect().then(() => console.log('Database connected successfully')).catch(err => {
    if(process.env.nodeEnv === 'development') {
        console.error('Database connection error:', err);
    }
    process.exit(-1);
});

pool.on('error', (err) => {
    if (process.env.nodeEnv === 'development') {
        console.error('Unexpected error on idle client', err);
    }
    process.exit(-1);
});

export { pool };
export default pool;