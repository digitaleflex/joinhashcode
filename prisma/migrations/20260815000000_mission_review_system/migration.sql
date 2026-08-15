-- AlterTable
ALTER TABLE "mission" ADD COLUMN "isOnboarding" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX "mission_isOnboarding_idx" ON "mission"("isOnboarding");

-- CreateTable
CREATE TABLE "mission_step" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fields" JSONB NOT NULL DEFAULT '[]',
    "required" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_attempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" TIMESTAMP(3),
    "reviewerId" TEXT,
    "score" INTEGER,
    "decision" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_step_response" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "score" INTEGER,
    "feedback" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_step_response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_review_log" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "message" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mission_review_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_v1" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "attemptId" TEXT,
    "data" JSONB NOT NULL,
    "declaredSkills" JSONB NOT NULL DEFAULT '[]',
    "observed" JSONB NOT NULL DEFAULT '{}',
    "demonstrated" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_v1_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mission_step_missionId_stepOrder_key" ON "mission_step"("missionId", "stepOrder");
CREATE UNIQUE INDEX "mission_step_missionId_key_key" ON "mission_step"("missionId", "key");
CREATE INDEX "mission_step_missionId_idx" ON "mission_step"("missionId");

CREATE UNIQUE INDEX "mission_attempt_userId_missionId_key" ON "mission_attempt"("userId", "missionId");
CREATE INDEX "mission_attempt_missionId_idx" ON "mission_attempt"("missionId");
CREATE INDEX "mission_attempt_status_idx" ON "mission_attempt"("status");
CREATE INDEX "mission_attempt_userId_status_idx" ON "mission_attempt"("userId", "status");

CREATE UNIQUE INDEX "mission_step_response_attemptId_stepId_key" ON "mission_step_response"("attemptId", "stepId");
CREATE INDEX "mission_step_response_attemptId_idx" ON "mission_step_response"("attemptId");

CREATE INDEX "mission_review_log_attemptId_idx" ON "mission_review_log"("attemptId");
CREATE INDEX "mission_review_log_createdAt_idx" ON "mission_review_log"("createdAt");

CREATE UNIQUE INDEX "profile_v1_userId_key" ON "profile_v1"("userId");
CREATE UNIQUE INDEX "profile_v1_attemptId_key" ON "profile_v1"("attemptId");
CREATE INDEX "profile_v1_userId_idx" ON "profile_v1"("userId");

-- AddForeignKey
ALTER TABLE "mission_step" ADD CONSTRAINT "mission_step_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "mission_attempt" ADD CONSTRAINT "mission_attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mission_attempt" ADD CONSTRAINT "mission_attempt_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mission_attempt" ADD CONSTRAINT "mission_attempt_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "mission_step_response" ADD CONSTRAINT "mission_step_response_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "mission_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mission_step_response" ADD CONSTRAINT "mission_step_response_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "mission_step"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mission_step_response" ADD CONSTRAINT "mission_step_response_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "mission_review_log" ADD CONSTRAINT "mission_review_log_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "mission_attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mission_review_log" ADD CONSTRAINT "mission_review_log_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "profile_v1" ADD CONSTRAINT "profile_v1_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "profile_v1" ADD CONSTRAINT "profile_v1_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "mission_attempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
