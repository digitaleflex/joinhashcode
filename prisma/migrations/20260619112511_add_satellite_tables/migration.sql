/*
  Warnings:

  - You are about to drop the column `lastComboAt` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the column `banned` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `betaKeyId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `fraudRiskScore` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `missionsCompletedCount` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `referralCode` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `referralCount` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `referrerId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorEnabled` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorSecret` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `member_impact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "member_impact" DROP CONSTRAINT "member_impact_userId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_betaKeyId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_referrerId_fkey";

-- DropIndex
DROP INDEX "user_betaKeyId_key";

-- DropIndex
DROP INDEX "user_level_idx";

-- DropIndex
DROP INDEX "user_referralCode_key";

-- AlterTable
ALTER TABLE "organization" DROP COLUMN "lastComboAt";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "banned",
DROP COLUMN "betaKeyId",
DROP COLUMN "experience",
DROP COLUMN "fraudRiskScore",
DROP COLUMN "level",
DROP COLUMN "missionsCompletedCount",
DROP COLUMN "referralCode",
DROP COLUMN "referralCount",
DROP COLUMN "referrerId",
DROP COLUMN "twoFactorEnabled",
DROP COLUMN "twoFactorSecret";

-- DropTable
DROP TABLE "member_impact";

-- CreateTable
CREATE TABLE "user_security" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "fraudRiskScore" INTEGER NOT NULL DEFAULT 0,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_referral" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "referrerId" TEXT,
    "referralCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "missionsCompletedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_beta" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "betaKeyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_beta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_security_userId_key" ON "user_security"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_referral_userId_key" ON "user_referral"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_referral_referralCode_key" ON "user_referral"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_userId_key" ON "user_progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_beta_userId_key" ON "user_beta"("userId");

-- AddForeignKey
ALTER TABLE "user_security" ADD CONSTRAINT "user_security_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_referral" ADD CONSTRAINT "user_referral_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_beta" ADD CONSTRAINT "user_beta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
