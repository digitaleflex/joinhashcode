-- Create UserProfile table
CREATE TABLE "user_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "secondaryObjectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "currentFocus" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dreamStatement" TEXT,
    "mainBlocker" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- Create unique index on userId
CREATE UNIQUE INDEX "user_profile_userId_key" ON "user_profile"("userId");

-- Add foreign key
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create index
CREATE INDEX "user_profile_userId_idx" ON "user_profile"("userId");

-- Migrate existing data from user table
INSERT INTO "user_profile" ("id", "userId", "bio", "secondaryObjectives", "currentFocus", "dreamStatement", "mainBlocker", "createdAt", "updatedAt")
SELECT
    gen_random_uuid()::text,
    "id",
    "bio",
    COALESCE("secondaryObjectives", ARRAY[]::TEXT[]),
    COALESCE("currentFocus", ARRAY[]::TEXT[]),
    "dreamStatement",
    "mainBlocker",
    NOW(),
    NOW()
FROM "user"
WHERE "bio" IS NOT NULL
   OR "dreamStatement" IS NOT NULL
   OR "mainBlocker" IS NOT NULL
   OR array_length("secondaryObjectives", 1) > 0
   OR array_length("currentFocus", 1) > 0;

-- Drop columns from user table
ALTER TABLE "user" DROP COLUMN IF EXISTS "bio";
ALTER TABLE "user" DROP COLUMN IF EXISTS "secondaryObjectives";
ALTER TABLE "user" DROP COLUMN IF EXISTS "currentFocus";
ALTER TABLE "user" DROP COLUMN IF EXISTS "dreamStatement";
ALTER TABLE "user" DROP COLUMN IF EXISTS "mainBlocker";
