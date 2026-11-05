-- Multi-artefacts submissions for HEF labs.
-- Additive migration: keeps `mission_submission.content` as legacy fallback.

ALTER TABLE "mission"
  ADD COLUMN IF NOT EXISTS "submissionSchema" JSONB;

CREATE TABLE IF NOT EXISTS "mission_submission_artifact" (
  "id"           TEXT NOT NULL,
  "submissionId" TEXT NOT NULL,
  "key"          TEXT NOT NULL,
  "type"         TEXT NOT NULL,
  "label"        TEXT NOT NULL,
  "value"        TEXT,
  "fileUrl"      TEXT,
  "fileName"     TEXT,
  "mimeType"     TEXT,
  "size"         INTEGER,
  "metadata"     JSONB,
  "status"       TEXT NOT NULL DEFAULT 'SUBMITTED',
  "reviewerNote" TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL,
  CONSTRAINT "mission_submission_artifact_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "mission_submission_artifact_submissionId_key_key"
  ON "mission_submission_artifact"("submissionId", "key");

CREATE INDEX IF NOT EXISTS "mission_submission_artifact_submissionId_idx"
  ON "mission_submission_artifact"("submissionId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'mission_submission_artifact_submissionId_fkey'
  ) THEN
    ALTER TABLE "mission_submission_artifact"
      ADD CONSTRAINT "mission_submission_artifact_submissionId_fkey"
      FOREIGN KEY ("submissionId") REFERENCES "mission_submission"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Backfill: preserve every existing single-link submission as a `legacy`
-- artifact so old submissions remain readable after the schema change.
INSERT INTO "mission_submission_artifact"
  ("id", "submissionId", "key", "type", "label", "value", "status", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  ms."id",
  'legacy',
  'LINK',
  'Livrable (legacy)',
  ms."content",
  'SUBMITTED',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "mission_submission" ms
WHERE ms."content" IS NOT NULL
  AND ms."content" <> ''
ON CONFLICT ("submissionId", "key") DO NOTHING;
