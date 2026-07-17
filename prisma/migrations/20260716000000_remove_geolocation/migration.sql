-- Remove geolocation fields from user table
ALTER TABLE "user" DROP COLUMN IF EXISTS "visitorId";
ALTER TABLE "user" DROP COLUMN IF EXISTS "consentLocation";
ALTER TABLE "user" DROP COLUMN IF EXISTS "consentLocationAt";
ALTER TABLE "user" DROP COLUMN IF EXISTS "latitude";
ALTER TABLE "user" DROP COLUMN IF EXISTS "longitude";
ALTER TABLE "user" DROP COLUMN IF EXISTS "locationAccuracy";
ALTER TABLE "user" DROP COLUMN IF EXISTS "locationUpdatedAt";
ALTER TABLE "user" DROP COLUMN IF EXISTS "ipCountry";

-- Drop user_location table
DROP TABLE IF EXISTS "user_location";
