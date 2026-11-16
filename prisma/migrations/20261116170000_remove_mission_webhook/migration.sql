-- DropForeignKey
ALTER TABLE "mission_webhook" DROP CONSTRAINT IF EXISTS "mission_webhook_missionId_fkey";

-- DropTable
DROP TABLE IF EXISTS "mission_webhook";
