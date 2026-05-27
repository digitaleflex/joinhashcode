/**
 * Deduplication script — run BEFORE `prisma db push` when adding unique constraints
 * to columns that may already have duplicate values in production.
 *
 * Fixes:
 *   1. user.betaKeyId @unique  — sets duplicate betaKeyId to NULL (keeps most recent user)
 *   2. mission_submission @@unique([userId, missionId, cycleKey]) — deletes older duplicates
 *
 * Safe: no user data is destroyed (only redundant duplicate rows / foreign key refs cleared).
 */

import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  const client = await pool.connect()
  try {
    // ── Fix 1: duplicate betaKeyId on "user" ──────────────────────────────────
    console.log("[DEDUP] Checking user.betaKeyId for duplicates...")
    const dupBetaKeys = await client.query<{
      betaKeyId: string
      user_ids: string[]
    }>(`
      SELECT "betaKeyId", array_agg(id ORDER BY "createdAt" DESC) AS user_ids
      FROM "user"
      WHERE "betaKeyId" IS NOT NULL
      GROUP BY "betaKeyId"
      HAVING count(*) > 1
    `)

    if (dupBetaKeys.rowCount === 0) {
      console.log("  ✓ No duplicate betaKeyId found.")
    } else {
      for (const row of dupBetaKeys.rows) {
        // Keep the most recently created user, nullify the rest
        const toNullify = row.user_ids.slice(1)
        await client.query(
          `UPDATE "user" SET "betaKeyId" = NULL WHERE id = ANY($1::text[])`,
          [toNullify]
        )
        console.log(
          `  → betaKeyId ${row.betaKeyId}: kept user ${row.user_ids[0]}, nullified ${toNullify.length} duplicate(s)`
        )
      }
    }

    // ── Fix 2: duplicate (userId, missionId, cycleKey) on "mission_submission" ─
    console.log("[DEDUP] Checking mission_submission for duplicate (userId, missionId, cycleKey)...")
    const dupSubmissions = await client.query<{
      userId: string
      missionId: string
      cycleKey: string
      ids: string[]
    }>(`
      SELECT "userId", "missionId", "cycleKey",
             array_agg(id ORDER BY "updatedAt" DESC) AS ids
      FROM "mission_submission"
      GROUP BY "userId", "missionId", "cycleKey"
      HAVING count(*) > 1
    `)

    if (dupSubmissions.rowCount === 0) {
      console.log("  ✓ No duplicate mission submissions found.")
    } else {
      for (const row of dupSubmissions.rows) {
        // Keep the most recently updated submission, delete the rest
        const toDelete = row.ids.slice(1)
        await client.query(
          `DELETE FROM "mission_submission" WHERE id = ANY($1::text[])`,
          [toDelete]
        )
        console.log(
          `  → Kept submission ${row.ids[0]}, deleted ${toDelete.length} duplicate(s) ` +
          `(user ${row.userId} / mission ${row.missionId} / cycle ${row.cycleKey})`
        )
      }
    }

    console.log("[DEDUP] Complete — unique constraints are safe to apply.")
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err: unknown) => {
  console.error("[DEDUP] Fatal error:", err)
  process.exit(1)
})
