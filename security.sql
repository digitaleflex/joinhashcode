-- ACTIVATION DU RLS (Row Level Security)
-- Cette opération est SANS RISQUE pour tes données existantes.
-- Elle change uniquement la manière dont l'API publique (PostgREST) traite les accès.
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "quiz_result" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "guild_member" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "guild" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "daily_checkin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "mission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "beta_feedback" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "mission_submission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "mission_review" ENABLE ROW LEVEL SECURITY;

-- PROTECTION DES COLONNES SENSIBLES
-- On retire le droit de lecture sur les tokens et mots de passe pour l'API publique uniquement.
REVOKE SELECT ON "account" FROM anon, authenticated;
REVOKE SELECT ON "session" FROM anon, authenticated;
