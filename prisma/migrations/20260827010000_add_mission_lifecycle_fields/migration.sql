-- AlterTable: Add lifecycle and soft-delete fields to Mission
ALTER TABLE "mission" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'DRAFT';
ALTER TABLE "mission" ADD COLUMN "publishAt" TIMESTAMP(3);
ALTER TABLE "mission" ADD COLUMN "deadline" TIMESTAMP(3);
ALTER TABLE "mission" ADD COLUMN "closedAt" TIMESTAMP(3);
ALTER TABLE "mission" ADD COLUMN "deletedAt" TIMESTAMP(3);
