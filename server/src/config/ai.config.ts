import dotenv from 'dotenv';

dotenv.config();

/**
 * AI Service Integration Configuration
 * Path: server/src/config/ai.config.ts
 * Purpose: Centralized configuration for external AI REST service endpoints, timeout, and API authentication.
 */
export const aiConfig = {
  baseUrl: process.env.AI_BASE_URL || process.env.AI_SERVICE_URL || 'http://localhost:8000',
  timeout: parseInt(process.env.AI_TIMEOUT || '30000', 10),
  apiKey: process.env.AI_API_KEY || process.env.API_KEY || '',
};
