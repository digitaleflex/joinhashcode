-- CreateIndex
CREATE INDEX "activity_log_action_createdAt_idx" ON "activity_log"("action", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "daily_checkin_userId_createdAt_idx" ON "daily_checkin"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "mission_submission_status_updatedAt_idx" ON "mission_submission"("status", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "notification_userId_isRead_createdAt_idx" ON "notification"("userId", "isRead", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "organization_isPrivate_cohesionScore_streakCount_idx" ON "organization"("isPrivate", "cohesionScore" DESC, "streakCount" DESC);

-- CreateIndex
CREATE INDEX "organization_isPrivate_createdAt_idx" ON "organization"("isPrivate", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "session_expiresAt_token_idx" ON "session"("expiresAt", "token");
