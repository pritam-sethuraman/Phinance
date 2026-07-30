import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/lib/env";

/**
 * Singleton PrismaClient. Prisma v7 removed the Rust query engine — every
 * database now connects through an explicit driver adapter instead of a
 * `url` in schema.prisma. We use the pooled Neon connection here (the CLI's
 * migrate/studio/seed commands use the *direct* connection instead, per
 * prisma.config.ts, since Neon's pooler doesn't support schema changes).
 *
 * Next.js dev-mode hot reloading re-evaluates this module on every edit,
 * which would otherwise open a fresh connection pool each time — so we
 * stash the instance on `globalThis` and reuse it. In production each
 * serverless invocation gets its own module scope, so this is a no-op there.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  // Prisma v7 uses node-postgres directly (no more Rust engine), which
  // validates SSL certs by default. Neon's pooled endpoint needs this
  // relaxed for now — see https://github.com/prisma/prisma/issues/28795.
  ssl: { rejectUnauthorized: false },
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
