-- DropColumn
ALTER TABLE "user" DROP COLUMN IF EXISTS "badges";
ALTER TABLE "user" DROP COLUMN IF EXISTS "level";
ALTER TABLE "user" DROP COLUMN IF EXISTS "experience";
ALTER TABLE "user" DROP COLUMN IF EXISTS "currentStreak";
ALTER TABLE "mission" DROP COLUMN IF EXISTS "xp";
ALTER TABLE "mission_submission" DROP COLUMN IF EXISTS "xpAwarded";
