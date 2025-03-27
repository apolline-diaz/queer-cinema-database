import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Configuration pour supporter l'Edge Runtime

    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ["query", "info", "warn", "error"],
  });

// Prevent multiple Prisma clients in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Generic caching utility using unstable_cache
export const cachedQuery = async <T>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: {
    tags?: string[];
    revalidate?: number;
  }
): Promise<T> => {
  const cachedFunction = unstable_cache(queryFn, key, {
    tags: options?.tags,
    revalidate: options?.revalidate || 3600, // 1 hour default
  });

  return cachedFunction();
};

// Revalidation utility
export const revalidateCache = async (tag: string) => {
  const { revalidateTag } = await import("next/cache");
  revalidateTag(tag);
};
