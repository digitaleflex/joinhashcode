-- Link HEF labs/projects (Mission) to their Academy course and content.
ALTER TABLE "mission"
  ADD COLUMN IF NOT EXISTS "courseId" TEXT,
  ADD COLUMN IF NOT EXISTS "contentId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "mission_contentId_key" ON "mission"("contentId");
CREATE INDEX IF NOT EXISTS "mission_courseId_idx" ON "mission"("courseId");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mission_courseId_fkey') THEN
    ALTER TABLE "mission" ADD CONSTRAINT "mission_courseId_fkey"
      FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mission_contentId_fkey') THEN
    ALTER TABLE "mission" ADD CONSTRAINT "mission_contentId_fkey"
      FOREIGN KEY ("contentId") REFERENCES "content"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
