import { test, expect } from '@playwright/test';

test('has title and landing content', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/HASHCODE/);

  // Check if landing page content is visible
  const mainHeading = page.locator('h1');
  await expect(mainHeading).toBeVisible();
});

test('can navigate to login page', async ({ page }) => {
  await page.goto('/');

  // Le lien de connexion de la nav pointe vers /signin
  const loginLink = page.getByRole('link', { name: /connexion|se connecter|login/i }).first();
  if (await loginLink.isVisible()) {
    await loginLink.click();
    await expect(page).toHaveURL(/\/signin/);
  }
});
