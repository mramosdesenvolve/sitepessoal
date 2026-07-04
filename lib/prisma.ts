import { PrismaClient } from "@prisma/client";

/**
 * Singleton do Prisma Client — evita abrir uma conexão nova a cada hot
 * reload em desenvolvimento (padrão recomendado pelo próprio Prisma para
 * Next.js).
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
