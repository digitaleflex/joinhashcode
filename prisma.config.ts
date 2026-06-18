import { createRequire } from "node:module";
import { defineConfig, env } from "@prisma/config";

// Charge les fichiers .env en développement local.
// En production (conteneur de migration), les variables sont injectées et dotenv
// n'est pas installé, donc on ignore l'erreur silencieusement.
const require = createRequire(import.meta.url);
try {
  require("dotenv/config");
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
