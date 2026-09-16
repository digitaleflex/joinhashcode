import { describe, it, expect } from "vitest";
import { Pool } from "pg";

/**
 * Fix #355 — preuve que Prisma/pg se connectent dans l'environnement Vitest.
 *
 * Le setup (`vitest.setup.ts`) charge `.env.local` puis `.env`. On privilégie
 * `TEST_DATABASE_URL` pour ne jamais écrire dans la base de dev, et on retombe
 * sur `DATABASE_URL`. La requête est strictement en lecture seule.
 *
 * Le test est sauté (skipped) si aucune URL n'est disponible — c'est le cas en
 * CI sans base, afin de ne pas casser la suite.
 */
const connectionString =
  process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;

describe.runIf(Boolean(connectionString))("DB connectivity (Vitest env)", () => {
  it("exécute une requête read-only sur la base configurée", async () => {
    const pool = new Pool({
      connectionString,
      max: 1,
      connectionTimeoutMillis: Number(
        process.env.DATABASE_CONNECT_TIMEOUT_MS ?? 5000,
      ),
    });

    try {
      const result = await pool.query("SELECT 1 AS ok");
      expect(result.rows[0].ok).toBe(1);
    } finally {
      await pool.end();
    }
  });
});
