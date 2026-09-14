import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { logError, logInfo } from "./logger";

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
      // 5s par défaut (adapté à un VPS dédié). Sur une machine de dev chargée
      // (RAM saturée → Postgres en Docker swap), 5s provoque des
      // « Connection terminated due to connection timeout » intermittents qui
      // font échouer des tests de façon non reproductible.
      // Surchargeable via DATABASE_CONNECT_TIMEOUT_MS dans .env.local.
      connectionTimeoutMillis: Number(process.env.DATABASE_CONNECT_TIMEOUT_MS ?? 5000),
      ssl: isLocalDb || sslDisabled
        ? false
        : {
            // Par défaut on ne valide pas le certificat (la plupart des VPS Docker n'en ont pas).
            // Active DATABASE_SSL_VERIFY=true quand tu as un CA valide configuré.
            rejectUnauthorized: process.env.DATABASE_SSL_VERIFY === "true",
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
     .then(() => logInfo("Prisma", "Connected to Database"))
     .catch((err) => logError("Prisma DB Connection", err));
 }
