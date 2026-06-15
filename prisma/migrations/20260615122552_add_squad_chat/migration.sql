-- CreateTable
CREATE TABLE "squad_message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "squad_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_application" (
    "id" TEXT NOT NULL,
    "signalId" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "expertiseVector" TEXT NOT NULL,
    "proofOfWork" TEXT NOT NULL,
    "cognitiveTest" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "squad_message_organizationId_idx" ON "squad_message"("organizationId");

-- CreateIndex
CREATE INDEX "squad_message_createdAt_idx" ON "squad_message"("createdAt");

-- CreateIndex
CREATE INDEX "member_userId_idx" ON "member"("userId");

-- AddForeignKey
ALTER TABLE "squad_message" ADD CONSTRAINT "squad_message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "squad_message" ADD CONSTRAINT "squad_message_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
