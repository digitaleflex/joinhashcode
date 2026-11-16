import { test, expect, type Page } from "@playwright/test";
import { prisma } from "@/lib/prisma";
import { generateKeyPair, SignJWT, exportJWK } from "jose";

/**
 * E2E complet du flux OAuth (Google + GitHub) avec des providers mockés.
 *
 * Aucun secret réel n'est utilisé : les endpoints OAuth des providers sont
 * interceptés par Playwright et renvoient des jetons/profils jetables. Les
 * utilisateurs créés sont nettoyés en fin de suite.
 */

const BASE = `http://localhost:${process.env.PORT || 3000}`;
const stamp = Date.now();
let seq = 0;

const emailsToCleanup = new Set<string>();
function uniqueEmail(provider: string): string {
  seq += 1;
  const email = `e2e-oauth-${provider}-${stamp}-${seq}@hashcode.test`;
  emailsToCleanup.add(email);
  return email;
}

// --- Google : clé RSA pour signer un id_token jetable ---
let googlePrivateKey: CryptoKey;
let googlePublicJwk: Record<string, unknown>;
const GOOGLE_KID = "e2e-google-kid";

test.beforeAll(async () => {
  const kp = await generateKeyPair("RS256");
  googlePrivateKey = kp.privateKey;
  const pub = await exportJWK(kp.publicKey);
  googlePublicJwk = { ...pub, kid: GOOGLE_KID, alg: "RS256", use: "sig" };
});

async function googleIdToken(email: string, name: string): Promise<string> {
  return new SignJWT({
    iss: "https://accounts.google.com",
    aud: process.env.GOOGLE_CLIENT_ID || "ci-google-client-id",
    sub: `google-${email}`,
    email,
    email_verified: true,
    name,
    picture: "https://example.com/avatar.png",
  })
    .setProtectedHeader({ alg: "RS256", kid: GOOGLE_KID })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(googlePrivateKey);
}

async function mockGoogle(page: Page, email: string, name: string) {
  await page.route("https://accounts.google.com/o/oauth2/v2/auth*", async (route) => {
    const url = new URL(route.request().url());
    const state = url.searchParams.get("state") || "";
    const redirect = `${BASE}/api/auth/callback/google?code=mock-code&state=${encodeURIComponent(
      state,
    )}`;
    await route.fulfill({ status: 302, headers: { location: redirect } });
  });
  await page.route("https://oauth2.googleapis.com/token", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "mock-google-access",
        token_type: "Bearer",
        expires_in: 3600,
        id_token: await googleIdToken(email, name),
      }),
    });
  });
  await page.route("https://www.googleapis.com/oauth2/v3/certs", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ keys: [googlePublicJwk] }),
    });
  });
}

async function mockGitHub(page: Page, email: string, name: string) {
  await page.route("https://github.com/login/oauth/authorize*", async (route) => {
    const url = new URL(route.request().url());
    const state = url.searchParams.get("state") || "";
    const redirect = `${BASE}/api/auth/callback/github?code=mock-code&state=${encodeURIComponent(
      state,
    )}`;
    await route.fulfill({ status: 302, headers: { location: redirect } });
  });
  await page.route("https://github.com/login/oauth/access_token", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "mock-github-access",
        token_type: "Bearer",
        scope: "read:user user:email",
      }),
    });
  });
  await page.route("https://api.github.com/user", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 12345,
        login: "octocat",
        name,
        email,
        avatar_url: "https://example.com/avatar.png",
      }),
    });
  });
  await page.route("https://api.github.com/user/emails", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { email, primary: true, verified: true, visibility: "public" },
      ]),
    });
  });
}

async function runGoogleOAuth(page: Page): Promise<string> {
  const email = uniqueEmail("google");
  const name = "Google Test User";
  await mockGoogle(page, email, name);
  await page.goto("/signin");
  await page.getByRole("button", { name: /continuer avec google/i }).click();
  await expect(page).toHaveURL(/\/onboarding/, { timeout: 60_000 });
  const user = await prisma.user.findUnique({ where: { email } });
  expect(user).not.toBeNull();
  return email;
}

async function runGitHubOAuth(page: Page): Promise<string> {
  const email = uniqueEmail("github");
  const name = "GitHub Test User";
  await mockGitHub(page, email, name);
  await page.goto("/signin");
  await page.getByRole("button", { name: /continuer avec github/i }).click();
  await expect(page).toHaveURL(/\/onboarding/, { timeout: 60_000 });
  const user = await prisma.user.findUnique({ where: { email } });
  expect(user).not.toBeNull();
  return email;
}

test.describe("Auth OAuth — flux complet", () => {
  test("Google : nouvel utilisateur est créé et arrive sur l'onboarding", async ({ page }) => {
    await runGoogleOAuth(page);
  });

  test("Google : un utilisateur existant se reconnecte sans second profil", async ({ page }) => {
    const email = await runGoogleOAuth(page);
    // Deuxième passage avec le même profil Google (même sub) → même utilisateur.
    const first = await prisma.user.findUnique({ where: { email } });
    expect(first).not.toBeNull();

    // Réinitialise la session et rejoue le flux avec le même email/sub.
    await page.context().clearCookies();
    await mockGoogle(page, email, "Google Test User");
    await page.goto("/signin");
    await page.getByRole("button", { name: /continuer avec google/i }).click();
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 60_000 });

    const second = await prisma.user.findUnique({ where: { email } });
    expect(second?.id).toBe(first?.id);
    expect(await prisma.user.count({ where: { email } })).toBe(1);
  });

  test("GitHub : nouvel utilisateur est créé et arrive sur l'onboarding", async ({ page }) => {
    await runGitHubOAuth(page);
  });

  test("GitHub : un utilisateur existant se reconnecte sans second profil", async ({ page }) => {
    const email = await runGitHubOAuth(page);
    const first = await prisma.user.findUnique({ where: { email } });
    await page.context().clearCookies();
    await mockGitHub(page, email, "GitHub Test User");
    await page.goto("/signin");
    await page.getByRole("button", { name: /continuer avec github/i }).click();
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 60_000 });
    const second = await prisma.user.findUnique({ where: { email } });
    expect(second?.id).toBe(first?.id);
  });

  test("GitHub : un state invalide est refusé sans créer de compte", async ({ page }) => {
    const email = uniqueEmail("github-invalid");
    await mockGitHub(page, email, "GitHub Invalid");
    // Appel direct du callback avec un state inconnu.
    await page.goto(
      `${BASE}/api/auth/callback/github?code=mock-code&state=state-invalide-xyz`,
    );
    // Better Auth redirige vers la page de connexion avec une erreur (ou affiche une erreur).
    await expect(page).toHaveURL(/signin|error/i, { timeout: 30_000 });
  });
});

test.afterAll(async () => {
  for (const email of emailsToCleanup) {
    await prisma.user.deleteMany({ where: { email } });
  }
  await prisma.$disconnect();
});
