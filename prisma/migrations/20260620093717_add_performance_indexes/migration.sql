-- CreateIndex
CREATE INDEX "invitation_email_idx" ON "invitation"("email");

-- CreateIndex
CREATE INDEX "invitation_organizationId_idx" ON "invitation"("organizationId");

-- CreateIndex
CREATE INDEX "invitation_status_idx" ON "invitation"("status");

-- CreateIndex
CREATE INDEX "user_progress_experience_idx" ON "user_progress"("experience");

-- CreateIndex
CREATE INDEX "user_progress_level_idx" ON "user_progress"("level");
