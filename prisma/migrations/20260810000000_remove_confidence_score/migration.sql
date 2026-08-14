-- Drop unused confidenceScore column from user table
ALTER TABLE "user" DROP COLUMN IF EXISTS "confidenceScore";
