import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  env: process.env.NODE_ENV,
  port: Number(process.env.PORT) || 5000,
  app_url: process.env.APP_URL || 'http://localhost:5000',
  database_url: process.env.DATABASE_URL,
};