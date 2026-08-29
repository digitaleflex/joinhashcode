-- Add j7Activated column for J+7 activation tracking (perf: avoid HTTP fetch in /api/user/me)
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "j7Activated" BOOLEAN NOT NULL DEFAULT false;

-- Composite indexes for admin/dashboard filtering (perf)
CREATE INDEX IF NOT EXISTS "user_class_role_idx" ON "user"("profile_class", "role");
CREATE INDEX IF NOT EXISTS "user_createdAt_class_idx" ON "user"("createdAt", "profile_class");
