if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  prismaInstance = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prisma) {
    const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');
    const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
