import dotenv from 'dotenv';

dotenv.config();

export type Config = {
  port: number;
  nodeEnv: string;
  baseURL: string;
  jwtSecret: string;
  dbHost: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  dbHost: process.env.DB_HOST || 'localhost',
  dbName: process.env.DB_NAME || 'todo_app',
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || 'postgres',
};

export default config;