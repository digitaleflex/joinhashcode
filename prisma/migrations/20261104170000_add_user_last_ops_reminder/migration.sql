-- Track the last operational reminder sent by an admin.
ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS "lastOpsReminderAt" TIMESTAMP(3);
