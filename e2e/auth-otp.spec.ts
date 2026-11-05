import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { prisma } from "@/lib/prisma";

/**
 * E2E réel du parcours inscription / connexion par OTP.
 *
 * Le code OTP est lu directement dans la table `verification` (Better Auth le
 * stocke sous `sign-in-otp-<email>`), ce qui évite toute dépendance à un
 * fournisseur email. En CI, RESEND_API_KEY est vide → email mocké.
 *
 * Chaque test utilise une IP synthétique (`x-forwarded-for`) pour ne pas
 * partager le bucket de rate limiting des autres tests : Better Auth limite
 * l'envoi d'OTP à 2 requêtes/minute par IP et par route.
 */

const stamp = Date.now();
let emailSeq = 0;
const emailsToCleanup = new Set<string>();

function uniqueEmail(prefix: string): string {
  emailSeq += 1;
  const email = `e2e-otp-${prefix}-${stamp}-${emailSeq}@hashcode.test`;
  emailsToCleanup.add(email);
  return email;
}

async function useTestIp(page: Page, testInfo: TestInfo, base: number) {
  const ip = `203.0.113.${base + testInfo.retry}`;
  await page.setExtraHTTPHeaders({ "x-forwarded-for": ip });
}

async function requestOtp(page: Page, email: string) {
  await page.goto("/signin");
  await page.getByLabel(/adresse email/i).fill(email);
  await page.getByRole("button", { name: /recevoir un code sécurisé/i }).click();
  await expect(page.getByText(/code de sécurité/i).first()).toBeVisible({
    timeout: 60_000,
  });
}

async function readOtp(email: string) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const record = await prisma.verification.findFirst({
      where: { identifier: `sign-in-otp-${email}` },
      orderBy: { createdAt: "desc" },
    });
    if (record?.value) return record;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`OTP introuvable pour ${email}`);
}

async function submitOtp(page: Page, otp: string) {
  await page
    .locator('input[aria-label^="Code de sécurité"]')
    .fill(otp, { force: true });
  await page.getByRole("button", { name: /valider l'accès/i }).click();
}

test.afterAll(async () => {
  for (const email of emailsToCleanup) {
    await prisma.verification.deleteMany({
      where: { identifier: `sign-in-otp-${email}` },
    });
    await prisma.user.deleteMany({ where: { email } });
  }
  await prisma.$disconnect();
});

test.describe("Auth OTP — inscription et arrivée dans la plateforme", () => {
  test("un nouvel email reçoit un code, se connecte et arrive sur l'onboarding", async ({
    page,
  }, testInfo) => {
    await useTestIp(page, testInfo, 10);
    const email = uniqueEmail("success");

    await requestOtp(page, email);
    const record = await readOtp(email);
    const otp = record.value.split(":")[0];

    expect(otp).toMatch(/^[A-Z0-9]{8}$/);

    await submitOtp(page, otp);

    // Le proxy envoie un nouvel utilisateur sans situation vers l'onboarding.
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 60_000 });

    const user = await prisma.user.findUnique({ where: { email } });
    expect(user).not.toBeNull();
    expect(user?.referralCode).toBeTruthy();
  });

  test("un code invalide affiche une erreur explicite", async ({
    page,
  }, testInfo) => {
    await useTestIp(page, testInfo, 20);
    const email = uniqueEmail("invalid");

    await requestOtp(page, email);
    await submitOtp(page, "ZZZZZZZZ");

    await expect(
      page.getByText(/code incorrect|code expiré|vérification a échoué/i),
    ).toBeVisible({ timeout: 30_000 });

    expect(await prisma.user.findUnique({ where: { email } })).toBeNull();
  });

  test("un code expiré est refusé avec un message explicite et ne crée pas de compte", async ({
    page,
  }, testInfo) => {
    await useTestIp(page, testInfo, 30);
    const email = uniqueEmail("expired");

    await requestOtp(page, email);
    const record = await readOtp(email);
    const otp = record.value.split(":")[0];

    await prisma.verification.update({
      where: { id: record.id },
      data: { expiresAt: new Date(Date.now() - 60_000) },
    });

    await submitOtp(page, otp);

    await expect(page.getByText(/ce code a expiré/i)).toBeVisible({
      timeout: 30_000,
    });
    expect(await prisma.user.findUnique({ where: { email } })).toBeNull();
  });

  test("un compte existant se reconnecte sans créer de second profil", async ({
    page,
  }, testInfo) => {
    await useTestIp(page, testInfo, 40);
    const email = uniqueEmail("returning");

    await requestOtp(page, email);
    const firstRecord = await readOtp(email);
    await submitOtp(page, firstRecord.value.split(":")[0]);
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 60_000 });

    const firstUser = await prisma.user.findUnique({ where: { email } });
    expect(firstUser).not.toBeNull();
    expect(firstUser?.referralCode).toBeTruthy();

    // Simule un profil incomplet (échec transitoire de provisionnement) puis
    // un changement d'appareil / une déconnexion.
    await prisma.user.update({
      where: { email },
      data: { referralCode: null },
    });
    await page.context().clearCookies();

    await requestOtp(page, email);
    const secondRecord = await readOtp(email);
    await submitOtp(page, secondRecord.value.split(":")[0]);
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 60_000 });

    const secondUser = await prisma.user.findUnique({ where: { email } });
    expect(secondUser?.id).toBe(firstUser?.id);
    await expect
      .poll(
        async () =>
          (await prisma.user.findUnique({ where: { email } }))?.referralCode,
        { timeout: 15_000 },
      )
      .toBeTruthy();
    expect(await prisma.user.count({ where: { email } })).toBe(1);
  });

  test("les liens OAuth Google et GitHub sont initiés avec le bon callback", async ({
    page,
  }) => {
    await page.route("https://accounts.google.com/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<html><body>Google OAuth mock</body></html>",
      }),
    );
    await page.route("https://github.com/login/oauth/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<html><body>GitHub OAuth mock</body></html>",
      }),
    );

    await page.goto("/signin");

    await page.getByRole("button", { name: /continuer avec google/i }).click();
    await page.waitForURL(/accounts\.google\.com/, { timeout: 45_000 });

    const google = new URL(page.url());
    expect(google.pathname).toBe("/o/oauth2/v2/auth");
    expect(google.searchParams.get("client_id")).toBeTruthy();
    expect(google.searchParams.get("redirect_uri")).toContain(
      "/api/auth/callback/google",
    );
    expect(google.searchParams.get("state")).toBeTruthy();
    expect(google.searchParams.get("scope")).toContain("email");

    // Nouvelle page pour repartir d'un état propre.
    await page.goto("/signin");
    await page.getByRole("button", { name: /continuer avec github/i }).click();
    await page.waitForURL(/github\.com\/login\/oauth\/authorize/, {
      timeout: 45_000,
    });

    const github = new URL(page.url());
    expect(github.searchParams.get("client_id")).toBeTruthy();
    expect(github.searchParams.get("redirect_uri")).toContain(
      "/api/auth/callback/github",
    );
    expect(github.searchParams.get("state")).toBeTruthy();
    expect(github.searchParams.get("scope")).toContain("user:email");
  });
});

test.describe("Auth OTP — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("le parcours OTP fonctionne sur mobile sans débordement horizontal", async ({
    page,
  }, testInfo) => {
    await useTestIp(page, testInfo, 50);
    const email = uniqueEmail("mobile");

    await page.goto("/signin");

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    await requestOtp(page, email);
    const record = await readOtp(email);
    await submitOtp(page, record.value.split(":")[0]);

    await expect(page).toHaveURL(/\/onboarding/, { timeout: 60_000 });
  });
});
