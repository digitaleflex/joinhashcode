-- Create AtelierProgress table
CREATE TABLE "atelier_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "atelierSlug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atelier_progress_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on userId + atelierSlug
CREATE UNIQUE INDEX "atelier_progress_userId_atelierSlug_key" ON "atelier_progress"("userId", "atelierSlug");

-- Add foreign key
ALTER TABLE "atelier_progress" ADD CONSTRAINT "atelier_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes
CREATE INDEX "atelier_progress_userId_idx" ON "atelier_progress"("userId");
CREATE INDEX "atelier_progress_atelierSlug_idx" ON "atelier_progress"("atelierSlug");
