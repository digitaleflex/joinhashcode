-- Automated tests for HEF code labs.
ALTER TABLE "mission"
  ADD COLUMN IF NOT EXISTS "labTests" JSONB;
