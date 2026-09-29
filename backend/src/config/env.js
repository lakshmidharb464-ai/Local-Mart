import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: Number(process.env.DB_PORT) || 3306,
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'localfarm_db',
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'localfarm_super_secure_jwt_secret_2026_key_!@#$',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    API_KEY: process.env.CLOUDINARY_API_KEY || '',
    API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  },
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
