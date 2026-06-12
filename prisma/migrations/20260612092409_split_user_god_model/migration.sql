/*
  Warnings:

  - You are about to drop the column `builderScore` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `catalystScore` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `confidenceScore` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `creatorScore` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `currentStreak` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `githubUrl` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastCheckinAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastStreakDate` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinUrl` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `longestStreak` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `portfolioUrl` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `strategistScore` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `twitterUrl` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "builderScore",
DROP COLUMN "catalystScore",
DROP COLUMN "confidenceScore",
DROP COLUMN "creatorScore",
DROP COLUMN "currentStreak",
DROP COLUMN "githubUrl",
DROP COLUMN "lastCheckinAt",
DROP COLUMN "lastStreakDate",
DROP COLUMN "linkedinUrl",
DROP COLUMN "longestStreak",
DROP COLUMN "portfolioUrl",
DROP COLUMN "strategistScore",
DROP COLUMN "twitterUrl";

-- CreateTable
CREATE TABLE "psychometric" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "builderScore" INTEGER NOT NULL DEFAULT 0,
    "creatorScore" INTEGER NOT NULL DEFAULT 0,
    "strategistScore" INTEGER NOT NULL DEFAULT 0,
    "catalystScore" INTEGER NOT NULL DEFAULT 0,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.25,

    CONSTRAINT "psychometric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_socials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "githubUrl" TEXT,
    "portfolioUrl" TEXT,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,

    CONSTRAINT "user_socials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engagement_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastCheckinAt" TIMESTAMP(3),
    "lastStreakDate" TIMESTAMP(3),

    CONSTRAINT "engagement_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "psychometric_userId_key" ON "psychometric"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_socials_userId_key" ON "user_socials"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "engagement_stats_userId_key" ON "engagement_stats"("userId");

-- AddForeignKey
ALTER TABLE "psychometric" ADD CONSTRAINT "psychometric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_socials" ADD CONSTRAINT "user_socials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engagement_stats" ADD CONSTRAINT "engagement_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
