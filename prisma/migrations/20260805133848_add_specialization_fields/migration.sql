-- AlterTable
ALTER TABLE "user" ADD COLUMN "primaryDomain" TEXT;
ALTER TABLE "user" ADD COLUMN "subDomain" TEXT;
ALTER TABLE "user" ADD COLUMN "learningTools" TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL;
ALTER TABLE "user" ADD COLUMN "practiceMode" TEXT;
ALTER TABLE "user" ADD COLUMN "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL;
ALTER TABLE "user" ADD COLUMN "specializationAt" TIMESTAMP(3);
