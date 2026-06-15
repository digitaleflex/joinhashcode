-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSaved" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "notification_isSaved_idx" ON "notification"("isSaved");

-- CreateIndex
CREATE INDEX "notification_isArchived_idx" ON "notification"("isArchived");
