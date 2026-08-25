-- Bouclier de série : 1 pardon/semaine pour éviter l'anxiété de rupture de streak
ALTER TABLE "organization" ADD COLUMN "streakFreezes" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "organization" ADD COLUMN "lastStreakFreezeAt" TIMESTAMP(3);
