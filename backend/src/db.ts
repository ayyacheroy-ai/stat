import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma client. Express runs as one long-lived process here
 * (unlike the frontend's serverless functions), so there's no
 * multi-instance/module-graph concern that would require the globalThis
 * trick the frontend's upload-store.ts needs — a plain module-level
 * singleton is sufficient and is the standard Prisma pattern.
 */
export const db = new PrismaClient();
