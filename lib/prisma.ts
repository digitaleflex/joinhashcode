import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

// Global variable to maintain a singleton Prisma Client/Pool across hot reloads in development.
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
      max: 20,                       // Maximum number of clients in the pool (PERF-003)
      idleTimeoutMillis: 30000,      // Close idle clients after 30 seconds
      connectionTimeoutMillis: 5000, // Return an error if a connection cannot be established within 5 seconds
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
