-- Add the Kalman filter confidence score back to the user table.
-- The 20260612092409_split_user_god_model migration dropped `confidenceScore`
-- from `user`, but the quiz action (app/actions/quiz.ts) persists the Kalman
-- state confidence there after each quiz submission.
ALTER TABLE "user" ADD COLUMN     "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.3;
