-- Better Auth's two-factor plugin requires lockout tracking columns.
-- Additive and idempotent: the table itself is created by
-- 20261031000000_fix_missing_tables_and_columns.
ALTER TABLE "twoFactor"
  ADD COLUMN IF NOT EXISTS "failedVerificationCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "lockedUntil" TIMESTAMP(3);
