import { createRequire } from "node:module";
import { defineConfig, env } from "@prisma/config";

// Charge les fichiers .env en développement local.
// Fix #354: on charge `.env.local` AVANT `.env` (dotenv ne surcharge pas une
// variable déjà définie) afin que la Prisma CLI respecte les mêmes overrides
// locaux que Next.js — sinon `DIRECT_URL` venait de `.env` et ignorait `.env.local`.
// En production (conteneur de migration), les variables sont injectées et dotenv
// n'est pas installé, donc on ignore l'erreur silencieusement.
const require = createRequire(import.meta.url);
try {
  const dotenv = require("dotenv");
  dotenv.config({ path: ".env.local" });
  dotenv.config({ path: ".env" });
} catch {
  // dotenv optionnel — env vars déjà présentes
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
