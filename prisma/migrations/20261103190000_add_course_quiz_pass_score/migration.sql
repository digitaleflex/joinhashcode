-- Pass threshold for HEF module assessments (default 60%).
ALTER TABLE "quiz"
  ADD COLUMN IF NOT EXISTS "passScore" INTEGER NOT NULL DEFAULT 60;
