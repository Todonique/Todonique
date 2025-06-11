import dotenv from 'dotenv';
import sanitize from 'sanitize-html';

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
  dbPort: number;
  allowedOrigins: string[];
  maxBytesRequestSize: number;
  allowedHTMLTags: string[];
  allowedHTMLAttributes: Record<string, sanitize.AllowedAttribute[]>;
  ipinfoToken: string;
  allowedCities: string[];
}

const parseIfSetElseDefault = <T>(envVariable: string, defaultValue: T): T => {
  try{
      const value = process.env[envVariable];
      if (value && typeof defaultValue === 'object') {
        return JSON.parse(value) as T;
      } else if (value) {
        return value as T;
      } else {
        return defaultValue;
      }
  } catch (error) {
    return defaultValue;
  }
}

export const config: Config = {
  port: Number(parseIfSetElseDefault('PORT', '3000')) || 3000,
  nodeEnv: parseIfSetElseDefault('NODE_ENV', 'development'),
  baseURL: parseIfSetElseDefault('BASE_URL', 'http://localhost:3000'),
  jwtSecret: parseIfSetElseDefault('JWT_SECRET','c93f1fe6f8f8337bd8bac5b5e2d6d617e2e156ce5db748a1156baf8887d4aa6d95460136bd917e6b415d58b1154f5a4e2739639c818890fdd8185b9c5396ad1a'),
  dbHost: parseIfSetElseDefault('DB_HOST', 'localhost'),
  dbName: parseIfSetElseDefault('DB_NAME', 'Todonique'),
  dbUser: parseIfSetElseDefault('DB_USER', 'postgres'),
  dbPort: Number(parseIfSetElseDefault('DB_PORT', '5432')),
  dbPassword: parseIfSetElseDefault('DB_PASSWORD', '12345'),
  allowedOrigins: parseIfSetElseDefault('ALLOWED_ORIGINS', ['http://localhost:3000','http://localhost:5173']),
  maxBytesRequestSize: parseIfSetElseDefault('MAX_REQUEST_SIZE', 10485760),
  allowedHTMLTags: parseIfSetElseDefault('ALLOWED_HTML_TAGS', sanitize.defaults.allowedTags),
  allowedHTMLAttributes: parseIfSetElseDefault('ALLOWED_HTML_ATTRIBUTES', sanitize.defaults.allowedAttributes),
  ipinfoToken: parseIfSetElseDefault('IPINFO_TOKEN', ''),
  allowedCities: parseIfSetElseDefault('ALLOWED_CITIES', []),
};