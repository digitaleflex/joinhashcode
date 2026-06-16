-- AlterTable
ALTER TABLE "contact_message" ADD COLUMN     "github" TEXT,
ADD COLUMN     "portfolio" TEXT,
ADD COLUMN     "skills" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "consentLocation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consentLocationAt" TIMESTAMP(3),
ADD COLUMN     "fraudRiskScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ipCountry" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "locationAccuracy" DOUBLE PRECISION,
ADD COLUMN     "locationUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "visitorId" TEXT;

-- CreateTable
CREATE TABLE "fraud_event" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "riskDelta" INTEGER NOT NULL DEFAULT 0,
    "ip" TEXT,
    "visitorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fraud_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_location" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fraud_event_userId_idx" ON "fraud_event"("userId");

-- CreateIndex
CREATE INDEX "fraud_event_action_idx" ON "fraud_event"("action");

-- CreateIndex
CREATE INDEX "fraud_event_createdAt_idx" ON "fraud_event"("createdAt");

-- CreateIndex
CREATE INDEX "user_location_userId_createdAt_idx" ON "user_location"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "user_location_createdAt_idx" ON "user_location"("createdAt");

-- AddForeignKey
ALTER TABLE "fraud_event" ADD CONSTRAINT "fraud_event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_location" ADD CONSTRAINT "user_location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
