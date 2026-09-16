-- Migration: Merge UserProfile and UserBeta into User
-- This migration merges 1:1 related tables into the User model to simplify the schema

-- Step 1: Add UserProfile fields to User table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "bio" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "secondary_objectives" TEXT[] DEFAULT '{}';
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "current_focus" TEXT[] DEFAULT '{}';
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "dream_statement" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "main_blocker" TEXT;

-- Step 2: Add UserBeta fields to User table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "beta_key_id" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "beta_created_at" TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "beta_updated_at" TIMESTAMPTZ DEFAULT NOW();

-- Step 3: Copy data from user_profile to user
UPDATE "user" u
SET
  "bio" = up."bio",
  "secondary_objectives" = up."secondaryObjectives",
  "current_focus" = up."currentFocus",
  "dream_statement" = up."dreamStatement",
  "main_blocker" = up."mainBlocker"
FROM "user_profile" up
WHERE u."id" = up."userId";

-- Step 4: Copy data from user_beta to user
UPDATE "user" u
SET
  "beta_key_id" = ub."betaKeyId",
  "beta_created_at" = ub."createdAt",
  "beta_updated_at" = ub."updatedAt"
FROM "user_beta" ub
WHERE u."id" = ub."userId";

-- Step 5: Drop the old tables (after verifying data migration)
-- DROP TABLE "user_profile";
-- DROP TABLE "user_beta";

-- Note: The DROP TABLE statements are commented out for safety.
-- Uncomment and run after verifying the data migration in production.