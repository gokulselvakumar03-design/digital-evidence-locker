import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton Instance
 * Path: server/src/config/prisma.ts
 * Purpose: Provides a single connection pool instance of Prisma Client to avoid memory leaks.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
