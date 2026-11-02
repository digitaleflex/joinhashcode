-- Reconcile the Academy/LMS schema with prisma/schema.prisma (additive, forward-only).
-- Generated from `prisma migrate diff` filtered to non-destructive statements.
-- Legacy tables/columns are intentionally kept; nothing is dropped.

-- ── Enums ────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('ADMIN', 'INSTRUCTOR', 'LEARNER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "AIMessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "NotificationType" AS ENUM ('REPLY_TO_TOPIC', 'REPLY_TO_POST', 'MENTION', 'SYSTEM', 'COURSE_UPDATE', 'ACHIEVEMENT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TYPE "ResourceType" ADD VALUE IF NOT EXISTS 'PDF';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TYPE "ResourceType" ADD VALUE IF NOT EXISTS 'BOOK';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TYPE "ResourceType" ADD VALUE IF NOT EXISTS 'TOOL';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TYPE "ResourceType" ADD VALUE IF NOT EXISTS 'ARTICLE';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Missing tables ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "MissionSnapshot" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MissionSnapshot_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "analytics_event" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "event" TEXT NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_event_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "quiz" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "difficulty" "CourseLevel" NOT NULL DEFAULT 'BEGINNER',
    "isAIGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "question" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "option" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "quiz_attempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_attempt_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "ai_conversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_conversation_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "ai_message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "AIMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_message_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "blog_post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "coverImage" TEXT,
    "authorId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_post_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "mission_assignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mission_assignment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "mentor_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "expertise" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "domains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "maxMentees" INTEGER NOT NULL DEFAULT 3,
    "currentMentees" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentor_profile_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "mentor_match" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "menteeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "matchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentor_match_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "mission_webhook" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "events" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_webhook_pkey" PRIMARY KEY ("id")
);

-- ── Missing columns ──────────────────────────────────────────────────────
ALTER TABLE "badge"
  ADD COLUMN IF NOT EXISTS "xpRequired" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "content"
  ADD COLUMN IF NOT EXISTS "body" TEXT,
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "url" TEXT;
ALTER TABLE "enrollment"
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "forum"
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "forum_like"
  ADD COLUMN IF NOT EXISTS "topicId" TEXT;
ALTER TABLE "forum_topic"
  ADD COLUMN IF NOT EXISTS "lessonId" TEXT,
  ADD COLUMN IF NOT EXISTS "sectionId" TEXT,
  ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "member"
  ADD COLUMN IF NOT EXISTS "acceptedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "accessLane" TEXT,
  ADD COLUMN IF NOT EXISTS "adminNote" TEXT,
  ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "availability" TEXT,
  ADD COLUMN IF NOT EXISTS "availabilityTimes" TEXT,
  ADD COLUMN IF NOT EXISTS "bouncedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "budgetRange" TEXT,
  ADD COLUMN IF NOT EXISTS "budgetWillingness" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "city" TEXT,
  ADD COLUMN IF NOT EXISTS "communityStatus" TEXT,
  ADD COLUMN IF NOT EXISTS "country" TEXT,
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "domainSpecialty" TEXT,
  ADD COLUMN IF NOT EXISTS "email" TEXT,
  ADD COLUMN IF NOT EXISTS "firstName" TEXT,
  ADD COLUMN IF NOT EXISTS "gender" TEXT,
  ADD COLUMN IF NOT EXISTS "goal" TEXT,
  ADD COLUMN IF NOT EXISTS "goalProjectStage" TEXT,
  ADD COLUMN IF NOT EXISTS "goalSituation" TEXT,
  ADD COLUMN IF NOT EXISTS "invitationClicks" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "invitationStatus" TEXT,
  ADD COLUMN IF NOT EXISTS "invitedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "joinedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "lastClickedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "lastName" TEXT,
  ADD COLUMN IF NOT EXISTS "learningStyle" TEXT,
  ADD COLUMN IF NOT EXISTS "level" TEXT,
  ADD COLUMN IF NOT EXISTS "mentoringDomain" TEXT,
  ADD COLUMN IF NOT EXISTS "mentoringFrequency" TEXT,
  ADD COLUMN IF NOT EXISTS "mentoringInterest" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "mentoringMaybeReason" TEXT,
  ADD COLUMN IF NOT EXISTS "mentoringTypes" TEXT[],
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "primaryDomain" TEXT,
  ADD COLUMN IF NOT EXISTS "profileArchetype" TEXT,
  ADD COLUMN IF NOT EXISTS "profileStatus" TEXT,
  ADD COLUMN IF NOT EXISTS "refusedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "refusedReason" TEXT,
  ADD COLUMN IF NOT EXISTS "secondaryDomains" TEXT[],
  ADD COLUMN IF NOT EXISTS "source" TEXT,
  ADD COLUMN IF NOT EXISTS "tags" TEXT[],
  ADD COLUMN IF NOT EXISTS "threeMonthGoal" TEXT;
ALTER TABLE "notification"
  ADD COLUMN IF NOT EXISTS "actorId" TEXT,
  ADD COLUMN IF NOT EXISTS "metadata" JSONB,
  ADD COLUMN IF NOT EXISTS "read" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "resourceId" TEXT,
  ADD COLUMN IF NOT EXISTS "resourceType" TEXT;
ALTER TABLE "progress"
  ADD COLUMN IF NOT EXISTS "isCompleted" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "resource"
  ADD COLUMN IF NOT EXISTS "image" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "section"
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "user_badge"
  ADD COLUMN IF NOT EXISTS "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- ── program_phase / pillar (required by the schema, absent from the legacy table)
ALTER TABLE "program_phase"
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "finality" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "pillar"
  ADD COLUMN IF NOT EXISTS "concepts" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "courseId" TEXT,
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "deliverable" TEXT,
  ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "objective" TEXT,
  ADD COLUMN IF NOT EXISTS "project" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "workshop" TEXT,
  ADD COLUMN IF NOT EXISTS "phaseId" TEXT,
  ADD COLUMN IF NOT EXISTS "level" INTEGER,
  ADD COLUMN IF NOT EXISTS "slug" TEXT;

ALTER TABLE "pillar" ALTER COLUMN "phaseId" SET NOT NULL;
ALTER TABLE "pillar" ALTER COLUMN "level" SET NOT NULL;
ALTER TABLE "pillar" ALTER COLUMN "slug" SET NOT NULL;

-- ── Unique / lookup indexes ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS "MissionSnapshot_missionId_idx" ON "MissionSnapshot"("missionId");
CREATE INDEX IF NOT EXISTS "analytics_event_userId_idx" ON "analytics_event"("userId");
CREATE INDEX IF NOT EXISTS "analytics_event_event_idx" ON "analytics_event"("event");
CREATE INDEX IF NOT EXISTS "analytics_event_createdAt_idx" ON "analytics_event"("createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "quiz_contentId_key" ON "quiz"("contentId");
CREATE INDEX IF NOT EXISTS "question_quizId_idx" ON "question"("quizId");
CREATE INDEX IF NOT EXISTS "option_questionId_idx" ON "option"("questionId");
CREATE INDEX IF NOT EXISTS "quiz_attempt_userId_idx" ON "quiz_attempt"("userId");
CREATE INDEX IF NOT EXISTS "quiz_attempt_quizId_idx" ON "quiz_attempt"("quizId");
CREATE INDEX IF NOT EXISTS "ai_conversation_userId_idx" ON "ai_conversation"("userId");
CREATE INDEX IF NOT EXISTS "ai_conversation_courseId_idx" ON "ai_conversation"("courseId");
CREATE UNIQUE INDEX IF NOT EXISTS "ai_conversation_userId_courseId_key" ON "ai_conversation"("userId", "courseId");
CREATE INDEX IF NOT EXISTS "ai_message_conversationId_idx" ON "ai_message"("conversationId");
CREATE UNIQUE INDEX IF NOT EXISTS "blog_post_slug_key" ON "blog_post"("slug");
CREATE INDEX IF NOT EXISTS "blog_post_authorId_idx" ON "blog_post"("authorId");
CREATE INDEX IF NOT EXISTS "mission_assignment_missionId_idx" ON "mission_assignment"("missionId");
CREATE INDEX IF NOT EXISTS "mission_assignment_userId_idx" ON "mission_assignment"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "mission_assignment_userId_missionId_key" ON "mission_assignment"("userId", "missionId");
CREATE UNIQUE INDEX IF NOT EXISTS "mentor_profile_userId_key" ON "mentor_profile"("userId");
CREATE INDEX IF NOT EXISTS "mentor_profile_isActive_idx" ON "mentor_profile"("isActive");
CREATE INDEX IF NOT EXISTS "mentor_match_mentorId_idx" ON "mentor_match"("mentorId");
CREATE INDEX IF NOT EXISTS "mentor_match_menteeId_idx" ON "mentor_match"("menteeId");
CREATE INDEX IF NOT EXISTS "mentor_match_status_idx" ON "mentor_match"("status");
CREATE UNIQUE INDEX IF NOT EXISTS "mentor_match_mentorId_menteeId_key" ON "mentor_match"("mentorId", "menteeId");
CREATE INDEX IF NOT EXISTS "mission_webhook_missionId_idx" ON "mission_webhook"("missionId");
CREATE INDEX IF NOT EXISTS "content_sectionId_order_idx" ON "content"("sectionId", "order");
CREATE UNIQUE INDEX IF NOT EXISTS "content_sectionId_order_key" ON "content"("sectionId", "order");
CREATE INDEX IF NOT EXISTS "course_slug_idx" ON "course"("slug");
CREATE INDEX IF NOT EXISTS "forum_like_topicId_idx" ON "forum_like"("topicId");
CREATE INDEX IF NOT EXISTS "forum_like_postId_idx" ON "forum_like"("postId");
CREATE UNIQUE INDEX IF NOT EXISTS "forum_like_userId_topicId_key" ON "forum_like"("userId", "topicId");
CREATE UNIQUE INDEX IF NOT EXISTS "forum_like_userId_postId_key" ON "forum_like"("userId", "postId");
CREATE INDEX IF NOT EXISTS "forum_topic_sectionId_idx" ON "forum_topic"("sectionId");
CREATE INDEX IF NOT EXISTS "forum_topic_lessonId_idx" ON "forum_topic"("lessonId");
CREATE UNIQUE INDEX IF NOT EXISTS "pillar_slug_key" ON "pillar"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "pillar_courseId_key" ON "pillar"("courseId");
CREATE INDEX IF NOT EXISTS "pillar_phaseId_idx" ON "pillar"("phaseId");
CREATE UNIQUE INDEX IF NOT EXISTS "pillar_phaseId_level_key" ON "pillar"("phaseId", "level");
CREATE UNIQUE INDEX IF NOT EXISTS "program_phase_programId_number_key" ON "program_phase"("programId", "number");
CREATE INDEX IF NOT EXISTS "section_courseId_order_idx" ON "section"("courseId", "order");

-- ── Foreign keys ─────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MissionSnapshot_missionId_fkey') THEN
    ALTER TABLE "MissionSnapshot" ADD CONSTRAINT "MissionSnapshot_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notification_actorId_fkey') THEN
    ALTER TABLE "notification" ADD CONSTRAINT "notification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'analytics_event_userId_fkey') THEN
    ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_instructorId_fkey') THEN
    ALTER TABLE "course" ADD CONSTRAINT "course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_categoryId_fkey') THEN
    ALTER TABLE "course" ADD CONSTRAINT "course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'program_phase_programId_fkey') THEN
    ALTER TABLE "program_phase" ADD CONSTRAINT "program_phase_programId_fkey" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pillar_programId_fkey') THEN
    ALTER TABLE "pillar" ADD CONSTRAINT "pillar_programId_fkey" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pillar_phaseId_fkey') THEN
    ALTER TABLE "pillar" ADD CONSTRAINT "pillar_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "program_phase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pillar_courseId_fkey') THEN
    ALTER TABLE "pillar" ADD CONSTRAINT "pillar_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'section_courseId_fkey') THEN
    ALTER TABLE "section" ADD CONSTRAINT "section_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_sectionId_fkey') THEN
    ALTER TABLE "content" ADD CONSTRAINT "content_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enrollment_userId_fkey') THEN
    ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enrollment_courseId_fkey') THEN
    ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'progress_userId_fkey') THEN
    ALTER TABLE "progress" ADD CONSTRAINT "progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'progress_contentId_fkey') THEN
    ALTER TABLE "progress" ADD CONSTRAINT "progress_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_contentId_fkey') THEN
    ALTER TABLE "quiz" ADD CONSTRAINT "quiz_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'question_quizId_fkey') THEN
    ALTER TABLE "question" ADD CONSTRAINT "question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'option_questionId_fkey') THEN
    ALTER TABLE "option" ADD CONSTRAINT "option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_attempt_userId_fkey') THEN
    ALTER TABLE "quiz_attempt" ADD CONSTRAINT "quiz_attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_attempt_quizId_fkey') THEN
    ALTER TABLE "quiz_attempt" ADD CONSTRAINT "quiz_attempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'resource_courseId_fkey') THEN
    ALTER TABLE "resource" ADD CONSTRAINT "resource_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forum_courseId_fkey') THEN
    ALTER TABLE "forum" ADD CONSTRAINT "forum_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forum_topic_forumId_fkey') THEN
    ALTER TABLE "forum_topic" ADD CONSTRAINT "forum_topic_forumId_fkey" FOREIGN KEY ("forumId") REFERENCES "forum"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forum_topic_sectionId_fkey') THEN
    ALTER TABLE "forum_topic" ADD CONSTRAINT "forum_topic_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "section"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forum_topic_lessonId_fkey') THEN
    ALTER TABLE "forum_topic" ADD CONSTRAINT "forum_topic_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "content"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forum_topic_authorId_fkey') THEN
    ALTER TABLE "forum_topic" ADD CONSTRAINT "forum_topic_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forum_post_topicId_fkey') THEN
    ALTER TABLE "forum_post" ADD CONSTRAINT "forum_post_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "forum_topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forum_post_authorId_fkey') THEN
    ALTER TABLE "forum_post" ADD CONSTRAINT "forum_post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forum_like_userId_fkey') THEN
    ALTER TABLE "forum_like" ADD CONSTRAINT "forum_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forum_like_topicId_fkey') THEN
    ALTER TABLE "forum_like" ADD CONSTRAINT "forum_like_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "forum_topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forum_like_postId_fkey') THEN
    ALTER TABLE "forum_like" ADD CONSTRAINT "forum_like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "forum_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_conversation_userId_fkey') THEN
    ALTER TABLE "ai_conversation" ADD CONSTRAINT "ai_conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_conversation_courseId_fkey') THEN
    ALTER TABLE "ai_conversation" ADD CONSTRAINT "ai_conversation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_message_conversationId_fkey') THEN
    ALTER TABLE "ai_message" ADD CONSTRAINT "ai_message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'certificate_userId_fkey') THEN
    ALTER TABLE "certificate" ADD CONSTRAINT "certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'certificate_courseId_fkey') THEN
    ALTER TABLE "certificate" ADD CONSTRAINT "certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_badge_userId_fkey') THEN
    ALTER TABLE "user_badge" ADD CONSTRAINT "user_badge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_badge_badgeId_fkey') THEN
    ALTER TABLE "user_badge" ADD CONSTRAINT "user_badge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blog_post_authorId_fkey') THEN
    ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mission_assignment_userId_fkey') THEN
    ALTER TABLE "mission_assignment" ADD CONSTRAINT "mission_assignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mission_assignment_missionId_fkey') THEN
    ALTER TABLE "mission_assignment" ADD CONSTRAINT "mission_assignment_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'intervention_attendee_interventionId_fkey') THEN
    ALTER TABLE "intervention_attendee" ADD CONSTRAINT "intervention_attendee_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "intervention"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'intervention_attendee_userId_fkey') THEN
    ALTER TABLE "intervention_attendee" ADD CONSTRAINT "intervention_attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mentor_profile_userId_fkey') THEN
    ALTER TABLE "mentor_profile" ADD CONSTRAINT "mentor_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mentor_match_mentorId_fkey') THEN
    ALTER TABLE "mentor_match" ADD CONSTRAINT "mentor_match_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mentor_match_menteeId_fkey') THEN
    ALTER TABLE "mentor_match" ADD CONSTRAINT "mentor_match_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mission_webhook_missionId_fkey') THEN
    ALTER TABLE "mission_webhook" ADD CONSTRAINT "mission_webhook_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_CourseToTag_A_fkey') THEN
    ALTER TABLE "_CourseToTag" ADD CONSTRAINT "_CourseToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_CourseToTag_B_fkey') THEN
    ALTER TABLE "_CourseToTag" ADD CONSTRAINT "_CourseToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ── Legacy columns kept for history but relaxed to allow inserts ─────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'badge' AND column_name = 'criteria' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "badge" ALTER COLUMN "criteria" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'badge' AND column_name = 'points' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "badge" ALTER COLUMN "points" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'badge' AND column_name = 'rarity' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "badge" ALTER COLUMN "rarity" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'certificate' AND column_name = 'metadata' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "certificate" ALTER COLUMN "metadata" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'certificate' AND column_name = 'pdfUrl' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "certificate" ALTER COLUMN "pdfUrl" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'content' AND column_name = 'isPublished' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "content" ALTER COLUMN "isPublished" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'content' AND column_name = 'quizId' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "content" ALTER COLUMN "quizId" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'content' AND column_name = 'resourceUrl' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "content" ALTER COLUMN "resourceUrl" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'content' AND column_name = 'textContent' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "content" ALTER COLUMN "textContent" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'content' AND column_name = 'videoDuration' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "content" ALTER COLUMN "videoDuration" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'content' AND column_name = 'videoUrl' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "content" ALTER COLUMN "videoUrl" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'course' AND column_name = 'pillarId' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "course" ALTER COLUMN "pillarId" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'course' AND column_name = 'tags' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "course" ALTER COLUMN "tags" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'enrollment' AND column_name = 'completedAt' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "enrollment" ALTER COLUMN "completedAt" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'enrollment' AND column_name = 'enrolledAt' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "enrollment" ALTER COLUMN "enrolledAt" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'enrollment' AND column_name = 'lastAccessedAt' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "enrollment" ALTER COLUMN "lastAccessedAt" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'enrollment' AND column_name = 'progress' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "enrollment" ALTER COLUMN "progress" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'forum_post' AND column_name = 'isAnswer' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "forum_post" ALTER COLUMN "isAnswer" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'forum_topic' AND column_name = 'views' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "forum_topic" ALTER COLUMN "views" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'organization' AND column_name = 'lastComboAt' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "organization" ALTER COLUMN "lastComboAt" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pillar' AND column_name = 'description' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "pillar" ALTER COLUMN "description" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pillar' AND column_name = 'icon' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "pillar" ALTER COLUMN "icon" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'program_phase' AND column_name = 'durationWeeks' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "program_phase" ALTER COLUMN "durationWeeks" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'program_phase' AND column_name = 'objectives' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "program_phase" ALTER COLUMN "objectives" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'progress' AND column_name = 'completed' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "progress" ALTER COLUMN "completed" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'progress' AND column_name = 'completedAt' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "progress" ALTER COLUMN "completedAt" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'progress' AND column_name = 'timeSpent' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "progress" ALTER COLUMN "timeSpent" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'resource' AND column_name = 'isPublished' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "resource" ALTER COLUMN "isPublished" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'section' AND column_name = 'description' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "section" ALTER COLUMN "description" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'section' AND column_name = 'isPublished' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "section" ALTER COLUMN "isPublished" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user' AND column_name = 'canReviewProfiles' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "user" ALTER COLUMN "canReviewProfiles" DROP NOT NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_badge' AND column_name = 'earnedAt' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "user_badge" ALTER COLUMN "earnedAt" DROP NOT NULL;
  END IF;
END $$;
