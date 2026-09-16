-- Align j7Activated column to snake_case convention
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user' AND column_name='j7Activated') THEN
    ALTER TABLE "user" RENAME COLUMN "j7Activated" TO "j7_activated";
  END IF;
END $$;
