import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized Environment Configuration
 * Path: server/src/config/env.config.ts
 * Purpose: Safe extraction and type definition of environment variables.
 */
export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres_password@localhost:5432/evidence_locker_db?schema=public',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_development_only',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
};
