import app from "./app";
import { config } from './config/env.config.js';
import { logger } from './config/logger.js';
import prisma from './config/prisma.js';

/**
 * Server HTTP Listener & Lifecycle Entrypoint
 * Path: server/src/index.ts
 * Purpose: Starts Express server, connects DB, listens on configured PORT, and manages graceful shutdowns.
 */

const server = app.listen(config.port, () => {
  logger.info(`🚀 Digital Evidence Locker API Server listening on port ${config.port}`);
  logger.info(`🌐 Environment: ${config.env}`);
  logger.info(`🔗 Health Check: http://localhost:${config.port}/health`);
  logger.info(`📖 API Root: http://localhost:${config.port}/api/v1`);
});

// Graceful Shutdown Handlers
const gracefulShutdown = async (signal: string) => {
  logger.warn(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Prisma database connection closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
