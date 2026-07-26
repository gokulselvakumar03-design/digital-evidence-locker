import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton Instance
 * Path: server/src/config/prisma.ts
 * Purpose: Provides a single connection pool instance of Prisma Client to avoid memory leaks.
 */
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
