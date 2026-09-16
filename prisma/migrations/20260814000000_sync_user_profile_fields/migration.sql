-- Sync production DB with the schema that the deployed build expects.
-- These columns were added to the schema via local `db push` without a
-- migration, so `getCachedUser` / middleware-session threw and caused an
-- infinite redirect loop (/onboarding <-> /dashboard).
ALTER TABLE "user" ADD COLUMN "currentStreak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "user" ADD COLUMN "longestStreak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "user" ADD COLUMN "lastCheckinAt" TIMESTAMP(3);
ALTER TABLE "user" ADD COLUMN "lastStreakDate" TIMESTAMP(3);
ALTER TABLE "user" ADD COLUMN "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user" ADD COLUMN "twoFactorSecret" TEXT;
ALTER TABLE "user" ADD COLUMN "referralCode" TEXT;
ALTER TABLE "user" ADD COLUMN "referralCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "user" ADD COLUMN "referrerId" TEXT;
ALTER TABLE "user" ADD COLUMN "githubUrl" TEXT;
ALTER TABLE "user" ADD COLUMN "portfolioUrl" TEXT;
ALTER TABLE "user" ADD COLUMN "linkedinUrl" TEXT;
ALTER TABLE "user" ADD COLUMN "twitterUrl" TEXT;
ALTER TABLE "user" ADD COLUMN "level" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "user" ADD COLUMN "experience" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "user" ADD COLUMN "missionsCompletedCount" INTEGER NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX "user_referralCode_key" ON "user"("referralCode");
