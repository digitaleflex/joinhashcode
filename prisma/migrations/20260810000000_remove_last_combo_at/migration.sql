-- Drop unused lastComboAt column from organization table
ALTER TABLE "organization" DROP COLUMN IF EXISTS "lastComboAt";
