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
  allowedOrigins: string[];
  maxBytesRequestSize: number;
  allowedHTMLTags: string[];
  allowedHTMLAttributes: Record<string, sanitize.AllowedAttribute[]>;
  ipinfoToken: string;
  allowedCities: string[];
}

const parseIfSetElseDefault = <T>(envVariable: string | undefined, defaultValue: T): T => {
  try{
    if (envVariable) {
      const value = process.env[envVariable];
      if (value) {
        return JSON.parse(value) as T;
      } else {
        return defaultValue;
      }
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
  jwtSecret: parseIfSetElseDefault('JWT_SECRET', 'your-secret-key'),
  dbHost: parseIfSetElseDefault('DB_HOST', 'localhost'),
  dbName: parseIfSetElseDefault('DB_NAME', 'todo_app'),
  dbUser: parseIfSetElseDefault('DB_USER', 'postgres'),
  dbPassword: parseIfSetElseDefault('DB_PASSWORD', 'postgres'),
  allowedOrigins: parseIfSetElseDefault('ALLOWED_ORIGINS', ['http://localhost:3000']),
  maxBytesRequestSize: parseIfSetElseDefault('MAX_REQUEST_SIZE', 10485760),
  allowedHTMLTags: parseIfSetElseDefault('ALLOWED_HTML_TAGS', sanitize.defaults.allowedTags),
  allowedHTMLAttributes: parseIfSetElseDefault('ALLOWED_HTML_ATTRIBUTES', sanitize.defaults.allowedAttributes),
  ipinfoToken: parseIfSetElseDefault('IPINFO_TOKEN', ''),
  allowedCities: parseIfSetElseDefault('ALLOWED_CITIES', []),
};