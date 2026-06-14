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

  // Find login link or button and click it
  const loginLink = page.getByRole('link', { name: /Se connecter|Login/i }).first();
  if (await loginLink.isVisible()) {
    await loginLink.click();
    await expect(page).toHaveURL(/\/login|\/sign-in/);
  }
});
