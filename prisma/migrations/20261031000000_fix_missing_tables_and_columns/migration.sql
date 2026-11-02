-- Create enums if missing
DO $$ BEGIN
    CREATE TYPE "Language" AS ENUM ('FR', 'EN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE "ContentType" AS ENUM ('VIDEO', 'AUDIO', 'PDF', 'DOCUMENT', 'QUIZ');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE "ResourceType" AS ENUM ('LINK', 'FILE', 'VIDEO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Fix missing tables/columns for Better Auth and LMS models (additive)

-- Better Auth twoFactor
CREATE TABLE IF NOT EXISTS "twoFactor" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "backupCodes" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verified" BOOLEAN DEFAULT true,
    CONSTRAINT "twoFactor_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "twoFactor_secret_idx" ON "twoFactor"("secret");
CREATE INDEX IF NOT EXISTS "twoFactor_userId_idx" ON "twoFactor"("userId");
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'twoFactor_userId_fkey'
  ) THEN
    ALTER TABLE "twoFactor" ADD CONSTRAINT "twoFactor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Better Auth passkey
CREATE TABLE IF NOT EXISTS "passkey" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "publicKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialID" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "deviceType" TEXT NOT NULL,
    "backedUp" BOOLEAN NOT NULL,
    "transports" TEXT,
    "createdAt" TIMESTAMP(3),
    "aaguid" TEXT,
    CONSTRAINT "passkey_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "passkey_userId_idx" ON "passkey"("userId");
CREATE INDEX IF NOT EXISTS "passkey_credentialID_idx" ON "passkey"("credentialID");
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'passkey_userId_fkey'
  ) THEN
    ALTER TABLE "passkey" ADD CONSTRAINT "passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Invitation createdAt
ALTER TABLE "invitation" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Organization lastComboAt
ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "lastComboAt" TIMESTAMP(3);

-- Academy/LMS tables (minimal for used models)
CREATE TABLE IF NOT EXISTS "course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "thumbnail" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "instructorId" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'FR',
    "level" "CourseLevel" NOT NULL DEFAULT 'BEGINNER',
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "totalLearners" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT,
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pillarId" TEXT,
    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "course_slug_key" ON "course"("slug");
CREATE INDEX IF NOT EXISTS "course_instructorId_idx" ON "course"("instructorId");
CREATE INDEX IF NOT EXISTS "course_categoryId_idx" ON "course"("categoryId");

CREATE TABLE IF NOT EXISTS "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "category_name_key" ON "category"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "category_slug_key" ON "category"("slug");

CREATE TABLE IF NOT EXISTS "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "tag_name_key" ON "tag"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "tag_slug_key" ON "tag"("slug");

CREATE TABLE IF NOT EXISTS "_CourseToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "_CourseToTag_AB_unique" ON "_CourseToTag"("A", "B");
CREATE INDEX IF NOT EXISTS "_CourseToTag_B_index" ON "_CourseToTag"("B");

CREATE TABLE IF NOT EXISTS "program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT,
    "vision" TEXT,
    "icon" TEXT,
    "coverImage" TEXT,
    "durationMonths" INTEGER NOT NULL DEFAULT 24,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "program_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "program_slug_key" ON "program"("slug");

CREATE TABLE IF NOT EXISTS "pillar" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT,
    CONSTRAINT "pillar_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "pillar_programId_idx" ON "pillar"("programId");

CREATE TABLE IF NOT EXISTS "program_phase" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "objectives" JSONB,
    "durationWeeks" INTEGER NOT NULL DEFAULT 4,
    CONSTRAINT "program_phase_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "program_phase_programId_idx" ON "program_phase"("programId");

CREATE TABLE IF NOT EXISTS "section" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "section_courseId_idx" ON "section"("courseId");

CREATE TABLE IF NOT EXISTS "content" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "videoUrl" TEXT,
    "videoDuration" INTEGER,
    "textContent" TEXT,
    "resourceUrl" TEXT,
    "quizId" TEXT,
    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "content_sectionId_idx" ON "content"("sectionId");
CREATE UNIQUE INDEX IF NOT EXISTS "content_quizId_key" ON "content"("quizId");

CREATE TABLE IF NOT EXISTS "course_quiz" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "difficulty" "CourseLevel" NOT NULL DEFAULT 'BEGINNER',
    "isAIGenerated" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "course_quiz_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "course_quiz_contentId_key" ON "course_quiz"("contentId");

CREATE TABLE IF NOT EXISTS "course_question" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "course_question_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "course_question_quizId_idx" ON "course_question"("quizId");

CREATE TABLE IF NOT EXISTS "course_option" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "course_option_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "course_option_questionId_idx" ON "course_option"("questionId");

CREATE TABLE IF NOT EXISTS "course_quiz_attempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "totalPoints" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "course_quiz_attempt_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "course_quiz_attempt_userId_idx" ON "course_quiz_attempt"("userId");
CREATE INDEX IF NOT EXISTS "course_quiz_attempt_quizId_idx" ON "course_quiz_attempt"("quizId");

CREATE TABLE IF NOT EXISTS "enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastAccessedAt" TIMESTAMP(3),
    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "enrollment_userId_courseId_key" ON "enrollment"("userId", "courseId");
CREATE INDEX IF NOT EXISTS "enrollment_userId_idx" ON "enrollment"("userId");
CREATE INDEX IF NOT EXISTS "enrollment_courseId_idx" ON "enrollment"("courseId");

CREATE TABLE IF NOT EXISTS "resource" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "ResourceType" NOT NULL,
    "url" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "resource_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "resource_courseId_idx" ON "resource"("courseId");

CREATE TABLE IF NOT EXISTS "forum" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "forum_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "forum_courseId_key" ON "forum"("courseId");

CREATE TABLE IF NOT EXISTS "forum_topic" (
    "id" TEXT NOT NULL,
    "forumId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "forum_topic_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "forum_topic_forumId_idx" ON "forum_topic"("forumId");
CREATE INDEX IF NOT EXISTS "forum_topic_authorId_idx" ON "forum_topic"("authorId");

CREATE TABLE IF NOT EXISTS "forum_post" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isAnswer" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "forum_post_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "forum_post_topicId_idx" ON "forum_post"("topicId");
CREATE INDEX IF NOT EXISTS "forum_post_authorId_idx" ON "forum_post"("authorId");

CREATE TABLE IF NOT EXISTS "forum_like" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "forum_like_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "forum_like_postId_userId_key" ON "forum_like"("postId", "userId");
CREATE INDEX IF NOT EXISTS "forum_like_userId_idx" ON "forum_like"("userId");

CREATE TABLE IF NOT EXISTS "progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "progress_userId_contentId_key" ON "progress"("userId", "contentId");
CREATE INDEX IF NOT EXISTS "progress_userId_idx" ON "progress"("userId");
CREATE INDEX IF NOT EXISTS "progress_contentId_idx" ON "progress"("contentId");

CREATE TABLE IF NOT EXISTS "certificate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdfUrl" TEXT,
    "metadata" JSONB,
    CONSTRAINT "certificate_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "certificate_certificateNumber_key" ON "certificate"("certificateNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "certificate_userId_courseId_key" ON "certificate"("userId", "courseId");
CREATE INDEX IF NOT EXISTS "certificate_userId_idx" ON "certificate"("userId");
CREATE INDEX IF NOT EXISTS "certificate_courseId_idx" ON "certificate"("courseId");

CREATE TABLE IF NOT EXISTS "badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rarity" TEXT NOT NULL DEFAULT 'COMMON',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "badge_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "badge_name_key" ON "badge"("name");

CREATE TABLE IF NOT EXISTS "user_badge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_badge_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "user_badge_userId_badgeId_key" ON "user_badge"("userId", "badgeId");
CREATE INDEX IF NOT EXISTS "user_badge_userId_idx" ON "user_badge"("userId");
CREATE INDEX IF NOT EXISTS "user_badge_badgeId_idx" ON "user_badge"("badgeId");

CREATE TABLE IF NOT EXISTS "a_i_conversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "title" TEXT NOT NULL DEFAULT 'Nouvelle conversation',
    "messages" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "a_i_conversation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "a_i_conversation_userId_idx" ON "a_i_conversation"("userId");
CREATE INDEX IF NOT EXISTS "a_i_conversation_courseId_idx" ON "a_i_conversation"("courseId");

-- Atelier/Intervention (legacy used by site-data)
CREATE TABLE IF NOT EXISTS "atelier" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT,
    "category" TEXT NOT NULL,
    "prerequisites" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "profile" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,
    "specializationLabel" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "missionSlugs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "pourquoi" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "atelier_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "atelier_profile_idx" ON "atelier"("profile");
CREATE INDEX IF NOT EXISTS "atelier_category_idx" ON "atelier"("category");
CREATE INDEX IF NOT EXISTS "atelier_isActive_order_idx" ON "atelier"("isActive", "order");

CREATE TABLE IF NOT EXISTS "intervention" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "speaker" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "locationUrl" TEXT,
    "recordingUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    CONSTRAINT "intervention_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "intervention_date_idx" ON "intervention"("date");
CREATE INDEX IF NOT EXISTS "intervention_status_idx" ON "intervention"("status");

CREATE TABLE IF NOT EXISTS "intervention_attendee" (
    "id" TEXT NOT NULL,
    "interventionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendedAt" TIMESTAMP(3),
    "feedback" TEXT,
    "rating" INTEGER,
    CONSTRAINT "intervention_attendee_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "intervention_attendee_interventionId_userId_key" ON "intervention_attendee"("interventionId", "userId");
CREATE INDEX IF NOT EXISTS "intervention_attendee_userId_idx" ON "intervention_attendee"("userId");
CREATE INDEX IF NOT EXISTS "intervention_attendee_status_idx" ON "intervention_attendee"("status");

CREATE TABLE IF NOT EXISTS "profile_content" (
    "id" TEXT NOT NULL,
    "profile" TEXT NOT NULL,
    "pain" TEXT NOT NULL,
    "painBold" TEXT NOT NULL,
    "truths" JSONB NOT NULL,
    "unlockedMissions" JSONB NOT NULL,
    "lockedMissions" JSONB NOT NULL,
    "socialProof" TEXT NOT NULL,
    "whatsappText" TEXT NOT NULL,
    "ctaLabel" TEXT NOT NULL,
    "possibleSpecializations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "profile_content_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "profile_content_profile_key" ON "profile_content"("profile");

CREATE TABLE IF NOT EXISTS "specialization" (
    "id" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "missions" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "specialization_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "specialization_specializationId_key" ON "specialization"("specializationId");
CREATE INDEX IF NOT EXISTS "specialization_class_idx" ON "specialization"("class");
CREATE INDEX IF NOT EXISTS "specialization_isActive_order_idx" ON "specialization"("isActive", "order");

CREATE TABLE IF NOT EXISTS "knowledge_article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "visibility" TEXT NOT NULL DEFAULT 'PRIVATE',
    "slug" TEXT NOT NULL,
    "authorId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "knowledge_article_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "knowledge_article_slug_key" ON "knowledge_article"("slug");
CREATE INDEX IF NOT EXISTS "knowledge_article_category_idx" ON "knowledge_article"("category");
CREATE INDEX IF NOT EXISTS "knowledge_article_visibility_idx" ON "knowledge_article"("visibility");
CREATE INDEX IF NOT EXISTS "knowledge_article_isPublished_publishedAt_idx" ON "knowledge_article"("isPublished", "publishedAt");
