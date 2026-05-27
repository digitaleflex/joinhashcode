-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "emailStatus" TEXT NOT NULL DEFAULT 'VALID',
    "emailLastBounced" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "profile_class" TEXT,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "activePaths" TEXT[],
    "ageRange" TEXT,
    "answerConsistency" DOUBLE PRECISION,
    "badges" TEXT[],
    "behavioralVibrancy" JSONB,
    "builderScore" INTEGER NOT NULL DEFAULT 0,
    "catalystScore" INTEGER NOT NULL DEFAULT 0,
    "cardSecretHash" TEXT,
    "cardSignature" TEXT,
    "cardIssuedAt" TIMESTAMP(3),
    "cardTier" TEXT DEFAULT 'STANDARD',
    "city" TEXT,
    "cohortsJoined" TEXT[],
    "collaborativeProjects" TEXT[],
    "communityEngagement" DOUBLE PRECISION,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    "connectionFrequency" DOUBLE PRECISION,
    "country" TEXT,
    "creatorScore" INTEGER NOT NULL DEFAULT 0,
    "currentSituation" TEXT,
    "dashboardActivity" DOUBLE PRECISION,
    "domains" TEXT[],
    "dominantMotivation" TEXT,
    "githubUrl" TEXT,
    "language" TEXT NOT NULL DEFAULT 'fr',
    "lastHypothesisUpdate" TIMESTAMP(3),
    "longTermObjective" TEXT,
    "mainObjective" TEXT,
    "mentorId" TEXT,
    "missionsCompletedCount" INTEGER NOT NULL DEFAULT 0,
    "onboardingSpeed" INTEGER,
    "polarization" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "portfolioUrl" TEXT,
    "predictedEngagementScore" DOUBLE PRECISION,
    "preferredRhythm" TEXT,
    "profileDrift" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profileStability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "projectsRealized" TEXT[],
    "pseudo" TEXT,
    "recommendedPath" TEXT[],
    "recommendedTools" TEXT[],
    "strategistScore" INTEGER NOT NULL DEFAULT 0,
    "technicalLevel" TEXT,
    "tools" TEXT[],
    "secondaryObjectives" TEXT[],
    "bio" TEXT,
    "linkedinUrl" TEXT,
    "memberNumber" SERIAL NOT NULL,
    "twitterUrl" TEXT,
    "currentFocus" TEXT[],
    "dreamStatement" TEXT,
    "lastCheckinAt" TIMESTAMP(3),
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastStreakDate" TIMESTAMP(3),
    "mainBlocker" TEXT,
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),
    "canReviewProfiles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reviewsCompleted" INTEGER NOT NULL DEFAULT 0,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "twoFactorBackupCodes" TEXT,
    "betaKeyId" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "metadata" TEXT,
    "cohesionScore" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "streakCount" INTEGER NOT NULL DEFAULT 0,
    "lastStreakAt" TIMESTAMP(3),
    "requiredLevel" INTEGER NOT NULL DEFAULT 1,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "twoFactorBackupCodes" TEXT,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "inviterId" TEXT NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_checkin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "note" VARCHAR(150) NOT NULL,
    "domain" TEXT NOT NULL,
    "energy" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_checkin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 100,
    "weightBuilder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weightCreator" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weightStrategist" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weightCatalyst" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "duration" TEXT,
    "missionLevel" TEXT,
    "requirements" TEXT[],
    "shortDesc" TEXT,
    "targetProfiles" TEXT[],
    "deliverables" TEXT[],
    "fullBriefing" TEXT,
    "submissionMethod" TEXT NOT NULL DEFAULT 'ANY_LINK',
    "acceptanceCriteria" JSONB NOT NULL DEFAULT '[]',
    "evaluatorNotes" TEXT,
    "qualityIndicators" JSONB NOT NULL DEFAULT '[]',
    "isWeeklyChallenge" BOOLEAN NOT NULL DEFAULT false,
    "weeklySlot" INTEGER,

    CONSTRAINT "mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "requiredLevel" INTEGER NOT NULL DEFAULT 1,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "cohesionScore" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "streakCount" INTEGER NOT NULL DEFAULT 0,
    "lastStreakAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guild_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "activeOrganizationId" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_result" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "profileType" TEXT NOT NULL,
    "score" INTEGER,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "average_response_time" INTEGER,
    "detailed_response_times" JSONB,
    "diagnostic_answers" JSONB,

    CONSTRAINT "quiz_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "cycleKey" TEXT NOT NULL DEFAULT 'PERMANENT',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "content" TEXT,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "improvementSuggestions" TEXT,
    "projectDescription" TEXT,
    "reviewerFeedback" TEXT,
    "userDifficulty" INTEGER,
    "userFeedback" TEXT,
    "userRating" INTEGER,
    "adminFeedback" TEXT,
    "reviewerId" TEXT,
    "qualityLevel" TEXT,
    "revisionCount" INTEGER NOT NULL DEFAULT 0,
    "revisionNotes" TEXT,
    "reviewerType" TEXT,

    CONSTRAINT "mission_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_review" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "criteria" JSONB NOT NULL,
    "qualityLevel" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "revisionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mission_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_message" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNREAD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beta_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "join_request" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "join_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_key" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedBy" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beta_key_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_cardSignature_key" ON "user"("cardSignature");

-- CreateIndex
CREATE UNIQUE INDEX "user_pseudo_key" ON "user"("pseudo");

-- CreateIndex
CREATE UNIQUE INDEX "user_memberNumber_key" ON "user"("memberNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_betaKeyId_key" ON "user"("betaKeyId");

-- CreateIndex
CREATE INDEX "user_level_idx" ON "user"("level");

-- CreateIndex
CREATE INDEX "user_profile_class_idx" ON "user"("profile_class");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "user"("role");

-- CreateIndex
CREATE UNIQUE INDEX "organization_slug_key" ON "organization"("slug");

-- CreateIndex
CREATE INDEX "activity_log_userId_idx" ON "activity_log"("userId");

-- CreateIndex
CREATE INDEX "activity_log_action_idx" ON "activity_log"("action");

-- CreateIndex
CREATE INDEX "activity_log_createdAt_idx" ON "activity_log"("createdAt");

-- CreateIndex
CREATE INDEX "activity_log_entity_entityId_idx" ON "activity_log"("entity", "entityId");

-- CreateIndex
CREATE INDEX "daily_checkin_userId_idx" ON "daily_checkin"("userId");

-- CreateIndex
CREATE INDEX "daily_checkin_createdAt_idx" ON "daily_checkin"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "mission_slug_key" ON "mission"("slug");

-- CreateIndex
CREATE INDEX "mission_category_idx" ON "mission"("category");

-- CreateIndex
CREATE INDEX "mission_difficulty_idx" ON "mission"("difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "guild_slug_key" ON "guild"("slug");

-- CreateIndex
CREATE INDEX "guild_member_userId_idx" ON "guild_member"("userId");

-- CreateIndex
CREATE INDEX "guild_member_guildId_idx" ON "guild_member"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "guild_member_userId_guildId_key" ON "guild_member"("userId", "guildId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_identifier_value_key" ON "verification"("identifier", "value");

-- CreateIndex
CREATE INDEX "quiz_result_profileType_idx" ON "quiz_result"("profileType");

-- CreateIndex
CREATE INDEX "quiz_result_userId_idx" ON "quiz_result"("userId");

-- CreateIndex
CREATE INDEX "mission_submission_status_idx" ON "mission_submission"("status");

-- CreateIndex
CREATE INDEX "mission_submission_userId_idx" ON "mission_submission"("userId");

-- CreateIndex
CREATE INDEX "mission_submission_missionId_idx" ON "mission_submission"("missionId");

-- CreateIndex
CREATE INDEX "mission_submission_createdAt_idx" ON "mission_submission"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "mission_submission_userId_missionId_cycleKey_key" ON "mission_submission"("userId", "missionId", "cycleKey");

-- CreateIndex
CREATE INDEX "mission_review_submissionId_idx" ON "mission_review"("submissionId");

-- CreateIndex
CREATE INDEX "mission_review_reviewerId_idx" ON "mission_review"("reviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "mission_review_submissionId_reviewerId_key" ON "mission_review"("submissionId", "reviewerId");

-- CreateIndex
CREATE INDEX "contact_message_type_idx" ON "contact_message"("type");

-- CreateIndex
CREATE INDEX "contact_message_status_idx" ON "contact_message"("status");

-- CreateIndex
CREATE INDEX "notification_userId_idx" ON "notification"("userId");

-- CreateIndex
CREATE INDEX "notification_isRead_idx" ON "notification"("isRead");

-- CreateIndex
CREATE INDEX "notification_createdAt_idx" ON "notification"("createdAt");

-- CreateIndex
CREATE INDEX "beta_feedback_userId_idx" ON "beta_feedback"("userId");

-- CreateIndex
CREATE INDEX "beta_feedback_status_idx" ON "beta_feedback"("status");

-- CreateIndex
CREATE INDEX "beta_feedback_type_idx" ON "beta_feedback"("type");

-- CreateIndex
CREATE UNIQUE INDEX "join_request_userId_organizationId_key" ON "join_request"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "beta_key_key_key" ON "beta_key"("key");

-- CreateIndex
CREATE UNIQUE INDEX "beta_key_usedBy_key" ON "beta_key"("usedBy");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_betaKeyId_fkey" FOREIGN KEY ("betaKeyId") REFERENCES "beta_key"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_checkin" ADD CONSTRAINT "daily_checkin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_member" ADD CONSTRAINT "guild_member_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_member" ADD CONSTRAINT "guild_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_result" ADD CONSTRAINT "quiz_result_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_submission" ADD CONSTRAINT "mission_submission_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_submission" ADD CONSTRAINT "mission_submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_submission" ADD CONSTRAINT "mission_submission_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_review" ADD CONSTRAINT "mission_review_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "mission_submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_review" ADD CONSTRAINT "mission_review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beta_feedback" ADD CONSTRAINT "beta_feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "join_request" ADD CONSTRAINT "join_request_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "join_request" ADD CONSTRAINT "join_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
