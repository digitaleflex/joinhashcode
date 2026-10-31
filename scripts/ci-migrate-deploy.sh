#!/usr/bin/env bash
# CI-only migration runner.
#
# Historical note:
# 20260629012226_add_last_combo_at_to_organization already recreates
# public.user.confidenceScore. The later 20260809000000_add_user_confidence_score
# attempts to add the same column again and fails on a fresh database.
#
# Do not hide arbitrary migration failures. We only mark that one redundant
# migration as applied in the disposable CI database when:
#   1. Prisma reports that exact failed migration;
#   2. its recorded error is the duplicate confidenceScore column;
#   3. the expected column is already present.
#
# The production migration history/files remain unchanged by this workaround.
set -uo pipefail

KNOWN_MIGRATION="20260809000000_add_user_confidence_score"
if pnpm exec prisma migrate deploy; then
  exit 0
fi

echo "Initial migrate deploy failed. Checking for the one documented legacy duplicate..."

node --input-type=module <<'NODE'
import pg from "pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DIRECT_URL or DATABASE_URL is required.");
  process.exit(1);
}

const client = new pg.Client({ connectionString });

try {
  await client.connect();

  const migrationResult = await client.query(
    `SELECT migration_name, logs, finished_at, rolled_back_at
       FROM "_prisma_migrations"
      WHERE migration_name = $1
      ORDER BY started_at DESC
      LIMIT 1`,
    ["20260809000000_add_user_confidence_score"],
  );

  const failedMigration = migrationResult.rows[0];
  const expectedError =
    'column "confidenceScore" of relation "user" already exists';

  if (
    !failedMigration ||
    failedMigration.finished_at !== null ||
    failedMigration.rolled_back_at !== null ||
    !String(failedMigration.logs ?? "").includes(expectedError)
  ) {
    console.error("Migration failure does not match the documented CI exception.");
    console.error(failedMigration ?? "No matching migration record found.");
    process.exit(1);
  }

  const columnResult = await client.query(
    `SELECT 1
       FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'user'
        AND column_name = 'confidenceScore'`,
  );

  if (columnResult.rowCount !== 1) {
    console.error("The duplicate column is not present; refusing to skip the migration.");
    process.exit(1);
  }

  console.log(
    "Verified: confidenceScore already exists from migration 20260629012226. " +
      "The redundant migration can be resolved as applied in this disposable CI database.",
  );
} catch (error) {
  console.error("Could not verify the migration state safely:", error);
  process.exit(1);
} finally {
  await client.end().catch(() => undefined);
}
NODE

if [[ $? -ne 0 ]]; then
  echo "Refusing to bypass the migration failure."
  exit 1
fi

pnpm exec prisma migrate resolve --applied "$KNOWN_MIGRATION"
pnpm exec prisma migrate deploy
