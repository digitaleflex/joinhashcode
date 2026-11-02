-- First-action activation funnel: track when a member starts and completes
-- the first concrete action proposed by the dashboard.
-- Additive and idempotent.
ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS "firstActionDomain" TEXT,
  ADD COLUMN IF NOT EXISTS "firstActionStartedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "firstActionCompletedAt" TIMESTAMP(3);
