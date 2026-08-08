-- Re-enable the `banned` column on the user table.
-- The 20260619112511_add_satellite_tables migration dropped it when ban state was
-- moved to user_security, but the Better Auth admin plugin still writes `banned`
-- when creating/updating users, breaking user creation (auth).
ALTER TABLE "user" ADD COLUMN "banned" BOOLEAN DEFAULT false;