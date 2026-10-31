import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { testAuth } from "./helpers/test-auth";
import { prisma } from "@/lib/prisma";
import type { FullConfig, Cookie } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function globalSetup(_config: FullConfig) {
  // 1. Vérifie la DB
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    throw new Error(
      "DB injoignable — lancement: docker compose -f compose.db.yml up -d db pgbouncer"
    );
  }

  // 2. Crée/récupère les utilisateurs de test (idempotent)
  //
  // ATTENTION — le proxy (proxy.ts) applique 3 redirections de parcours :
  //   needsOnboarding     = !user.currentSituation
  //   needsQuiz           = user.currentSituation && !user.class
  //   needsSpecialization = user.class && !user.primaryDomain
  // Sans ces champs renseignés, TOUTE route protégée renvoie 307 → /onboarding.
  // On les remplit donc dans `create` ET `update` (pour réparer un user existant).
  // NB: `class` est mappé sur la colonne `profile_class`.
  const profile = {
    currentSituation: "Student",
    class: "E2E",
    primaryDomain: "web",
    emailVerified: true,
    emailStatus: "VALID",
  };

  const instructor = await prisma.user.upsert({
    where: { email: "e2e-instructor@hashcode.test" },
    update: { ...profile, role: "INSTRUCTOR" },
    create: {
      id: crypto.randomUUID(),
      name: "E2E Instructor",
      email: "e2e-instructor@hashcode.test",
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "INSTRUCTOR",
      language: "fr",
      ...profile,
    },
    select: { id: true },
  });

  const member = await prisma.user.upsert({
    where: { email: "e2e-member@hashcode.test" },
    update: { ...profile, role: "MEMBER" },
    create: {
      id: crypto.randomUUID(),
      name: "E2E Member",
      email: "e2e-member@hashcode.test",
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "MEMBER",
      language: "fr",
      ...profile,
    },
    select: { id: true },
  });

  // 3. Écrit les storageState Playwright
  const authDir = path.resolve(__dirname, ".auth");
  await fs.promises.mkdir(authDir, { recursive: true });

  const ctx = await testAuth.$context;
  const test = ctx.test;

  for (const { file, userId } of [
    { file: "instructor.json", userId: instructor.id },
    { file: "member.json", userId: member.id },
  ]) {
    const { cookies: rawCookies } = await test.login({ userId });

    const playwrightCookies: Cookie[] = rawCookies.map((c) => ({
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path,
      httpOnly: c.httpOnly ?? true,
      secure: c.secure ?? false,
      sameSite: (c.sameSite as "Lax" | "Strict" | "None") ?? "Lax",
      expires: c.expires ?? Math.floor(Date.now() / 1000) + 7 * 86400,
    }));

    await fs.promises.writeFile(
      path.join(authDir, file),
      JSON.stringify({ cookies: playwrightCookies, origins: [] }, null, 2)
    );
  }
}
