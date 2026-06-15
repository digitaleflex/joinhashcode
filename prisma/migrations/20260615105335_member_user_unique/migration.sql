/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `member` will be added. If there are existing duplicate values, this will fail.

*/
-- Clean up duplicate member rows (keep oldest for each userId)
DELETE FROM "member" m1 USING "member" m2
WHERE m1."userId" = m2."userId"
  AND m1."createdAt" > m2."createdAt";

-- Drop the existing non-unique index (will be replaced by unique constraint)
DROP INDEX IF EXISTS "member_userId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "member_userId_key" ON "member"("userId");
