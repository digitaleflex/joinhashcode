import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

// Force bypass TLS certificate validation for Supabase issues (common in serverless/Node environments)
// This is required when the database uses self-signed certificates or certs not in the system trust store.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const pool =
  globalForPrisma.pool ||
  (() => {
    const isLocalDb =
      !process.env.DATABASE_URL ||
      process.env.DATABASE_URL.includes("localhost") ||
      process.env.DATABASE_URL.includes("127.0.0.1") ||
      process.env.DATABASE_URL.includes("@db:");

    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isLocalDb
        ? false
        : {
            rejectUnauthorized: false,
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
