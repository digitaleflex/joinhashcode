/*
  Warnings:

  - You are about to drop the column `detailed_response_times` on the `quiz_result` table. All the data in the column will be lost.
  - You are about to drop the column `diagnostic_answers` on the `quiz_result` table. All the data in the column will be lost.
  - You are about to drop the column `activePaths` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `ageRange` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `answerConsistency` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `cardSecretHash` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `cohortsJoined` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `collaborativeProjects` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `communityEngagement` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `connectionFrequency` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `dashboardActivity` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `dominantMotivation` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `longTermObjective` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `mentorId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `onboardingSpeed` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `polarization` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `predictedEngagementScore` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `preferredRhythm` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `profileDrift` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `profileStability` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `projectsRealized` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `recommendedPath` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `recommendedTools` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_mentorId_fkey";

-- AlterTable
ALTER TABLE "quiz_result" DROP COLUMN "detailed_response_times",
DROP COLUMN "diagnostic_answers";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "activePaths",
DROP COLUMN "ageRange",
DROP COLUMN "answerConsistency",
DROP COLUMN "cardSecretHash",
DROP COLUMN "cohortsJoined",
DROP COLUMN "collaborativeProjects",
DROP COLUMN "communityEngagement",
DROP COLUMN "connectionFrequency",
DROP COLUMN "dashboardActivity",
DROP COLUMN "dominantMotivation",
DROP COLUMN "longTermObjective",
DROP COLUMN "mentorId",
DROP COLUMN "onboardingSpeed",
DROP COLUMN "polarization",
DROP COLUMN "predictedEngagementScore",
DROP COLUMN "preferredRhythm",
DROP COLUMN "profileDrift",
DROP COLUMN "profileStability",
DROP COLUMN "projectsRealized",
DROP COLUMN "recommendedPath",
DROP COLUMN "recommendedTools";
