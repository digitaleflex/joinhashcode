-- CreateTable
CREATE TABLE "mission_snapshot" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mission_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mission_snapshot_missionId_idx" ON "mission_snapshot"("missionId");

-- AddForeignKey
ALTER TABLE "mission_snapshot" ADD CONSTRAINT "mission_snapshot_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
