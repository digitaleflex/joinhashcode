import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// Global variable to maintain a singleton Prisma Client/Pool across hot reloads in development.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const pool =
  globalForPrisma.pool ||
  (() => {
    const url = process.env.DATABASE_URL;
    const isLocalDb =
      !url ||
      url.includes("localhost") ||
      url.includes("127.0.0.1") ||
      url.includes("@db:") ||
      url.includes("@hashcode-db:");
    // Explicit override for containerized/on-prem Postgres that doesn't use TLS
    const sslDisabled = process.env.DATABASE_SSL === "false";

    return new Pool({
      connectionString: url,
      max: 10,                       // Limit concurrent connections to avoid overwhelming remote DB
      idleTimeoutMillis: 60000,      // Keep idle connections alive longer for reuse
      connectionTimeoutMillis: 5000, // 5s timeout — loading.tsx gère l'attente utilisateur
      ssl: isLocalDb || sslDisabled
        ? false
        : {
            rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
          },
    });
  })();

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

// Store instances in globalThis to prevent multiple pools/clients in serverless/dev environments
globalForPrisma.pool = pool;
globalForPrisma.prisma = prisma;

if (process.env.NODE_ENV !== "production") {
  // Database connection logging (only in development)
  pool.connect()
    .then(() => console.log("🟢 [Prisma] Connected to Database"))
    .catch((err) => console.error("🔴 [Prisma] Database connection error:", err));
}
