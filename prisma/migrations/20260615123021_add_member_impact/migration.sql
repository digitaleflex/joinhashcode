-- CreateTable
CREATE TABLE "member_impact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score7d" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "score30d" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "score90d" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scoreAllTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "integrityScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "missionsCount" INTEGER NOT NULL DEFAULT 0,
    "qualityRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "contributionScore" INTEGER NOT NULL DEFAULT 0,
    "topSpecialties" TEXT[],
    "titleOfGlory" TEXT,
    "talentJourney" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_impact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_impact_userId_key" ON "member_impact"("userId");

-- CreateIndex
CREATE INDEX "member_impact_score7d_idx" ON "member_impact"("score7d" DESC);

-- CreateIndex
CREATE INDEX "member_impact_score30d_idx" ON "member_impact"("score30d" DESC);

-- AddForeignKey
ALTER TABLE "member_impact" ADD CONSTRAINT "member_impact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
