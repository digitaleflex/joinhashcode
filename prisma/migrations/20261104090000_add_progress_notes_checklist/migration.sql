-- Lesson annotations and lab checklist progress.
ALTER TABLE "progress"
  ADD COLUMN IF NOT EXISTS "note" TEXT,
  ADD COLUMN IF NOT EXISTS "checklist" JSONB;
