// ⚠️ MODULE RÉSERVÉ AUX TESTS — ne jamais importer depuis lib/ ou app/
// C'est une backdoor de session : cette instance utilise le même
// BETTER_AUTH_SECRET que la prod pour que les cookies signés soient acceptés,
// mais elle ne doit JAMAIS être déployée en production.
//
// Playwright ne charge PAS les fichiers .env : ils sont chargés dans
// `playwright.config.ts` (évalué en tout premier). Ne PAS tenter de charger
// dotenv ici — en ES modules les `import` sont évalués avant le corps du module,
// donc un `dotenv.config()` placé ici s'exécuterait APRÈS `@/lib/prisma`.
import { betterAuth } from "better-auth/minimal";
import { testUtils } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const testAuth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  plugins: [testUtils()],
});
