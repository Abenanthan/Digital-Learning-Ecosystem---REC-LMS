/**
 * Prisma Client Singleton
 *
 * In development, Next.js / tsx watch hot-reloads clear the Node.js module cache
 * on every edit. Without this pattern, each reload creates a NEW PrismaClient
 * instance, eventually exhausting the database connection pool.
 *
 * We cache the client on `globalThis` so the same instance is reused across reloads.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
