import { test, expect } from "@playwright/test";
import { prisma } from "@/lib/prisma";

/**
 * E2E réel du parcours inscription / connexion par OTP.
 *
 * Le code OTP est lu directement dans la table `verification` (Better Auth le
 * stocke sous `sign-in-otp-<email>`), ce qui évite toute dépendance à un
 * fournisseur email. En CI, RESEND_API_KEY est vide → email mocké.
 */
test.describe("Auth OTP — inscription et arrivée dans la plateforme", () => {
  const email = `e2e-otp-${Date.now()}@hashcode.test`;

  test.afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.verification.deleteMany({
      where: { identifier: `sign-in-otp-${email}` },
    });
    await prisma.$disconnect();
  });

  test("un nouvel email reçoit un code, se connecte et arrive sur l'onboarding", async ({
    page,
  }) => {
    await page.goto("/signin");

    await page.getByLabel(/adresse email/i).fill(email);
    await page.getByRole("button", { name: /recevoir un code sécurisé/i }).click();

    await expect(page.getByText(/code de sécurité/i).first()).toBeVisible({
      timeout: 20_000,
    });

    let otp = "";
    for (let attempt = 0; attempt < 20 && !otp; attempt += 1) {
      const record = await prisma.verification.findFirst({
        where: { identifier: `sign-in-otp-${email}` },
        orderBy: { createdAt: "desc" },
      });
      if (record?.value) {
        otp = record.value.split(":")[0];
        break;
      }
      await page.waitForTimeout(500);
    }

    expect(otp).toMatch(/^[A-Z0-9]{8}$/);

    const otpInput = page.locator('input[aria-label^="Code de sécurité"]');
    await otpInput.fill(otp, { force: true });
    await page.getByRole("button", { name: /valider l'accès/i }).click();

    // Le proxy envoie un nouvel utilisateur sans situation vers l'onboarding.
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 30_000 });

    const user = await prisma.user.findUnique({ where: { email } });
    expect(user).not.toBeNull();
    expect(user?.referralCode).toBeTruthy();
  });

  test("un code invalide affiche une erreur explicite", async ({ page }) => {
    const invalidEmail = `e2e-otp-invalid-${Date.now()}@hashcode.test`;

    await page.goto("/signin");
    await page.getByLabel(/adresse email/i).fill(invalidEmail);
    await page.getByRole("button", { name: /recevoir un code sécurisé/i }).click();
    await expect(page.getByText(/code de sécurité/i).first()).toBeVisible({
      timeout: 20_000,
    });

    const otpInput = page.locator('input[aria-label^="Code de sécurité"]');
    await otpInput.fill("ZZZZZZZZ", { force: true });
    await page.getByRole("button", { name: /valider l'accès/i }).click();

    await expect(
      page.getByText(/code incorrect|code expiré|vérification a échoué/i),
    ).toBeVisible({ timeout: 15_000 });

    await prisma.user.deleteMany({ where: { email: invalidEmail } });
    await prisma.verification.deleteMany({
      where: { identifier: `sign-in-otp-${invalidEmail}` },
    });
  });
});
