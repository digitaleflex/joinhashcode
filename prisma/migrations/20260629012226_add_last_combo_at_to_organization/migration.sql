/*
  Warnings:

  - You are about to drop the column `talent_visible` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `fraudRiskScore` on the `user_security` table. All the data in the column will be lost.
  - You are about to drop the `fraud_event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `psychometric` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "fraud_event" DROP CONSTRAINT "fraud_event_userId_fkey";

-- DropForeignKey
ALTER TABLE "psychometric" DROP CONSTRAINT "psychometric_userId_fkey";

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "lastComboAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user" DROP COLUMN "talent_visible",
ADD COLUMN     "builderScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "catalystScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
ADD COLUMN     "creatorScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "strategistScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "talentVisible" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "user_security" DROP COLUMN "fraudRiskScore";

-- DropTable
DROP TABLE "fraud_event";

-- DropTable
DROP TABLE "psychometric";

-- CreateIndex
CREATE INDEX "mission_submission_userId_status_idx" ON "mission_submission"("userId", "status");

-- CreateIndex
CREATE INDEX "mission_submission_userId_createdAt_idx" ON "mission_submission"("userId", "createdAt" DESC);
