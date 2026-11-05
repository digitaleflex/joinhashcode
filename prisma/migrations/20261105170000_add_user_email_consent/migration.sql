-- Migration: consentement et désabonnement des communications opérationnelles
-- (#403, prépare #406). Additive uniquement : colonnes nullables, aucun impact
-- sur les lignes existantes.

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "email_consent_at" TIMESTAMP(3);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "email_opt_out_at" TIMESTAMP(3);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "email_opt_out_token" TEXT;

-- Un token unique par utilisateur pour signer le lien de désabonnement.
-- Les comptes existants n'ont pas de token : il est généré à la volée au
-- premier envoi d'un lien (voir lib/email-consent.ts).
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_opt_out_token_key"
  ON "user" ("email_opt_out_token");
