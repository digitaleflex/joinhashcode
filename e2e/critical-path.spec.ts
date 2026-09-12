import { test, expect } from '@playwright/test';

/**
 * Parcours critique HashCode (0.23)
 *
 * Vérifie les 4 parcours qui doivent rester fonctionnels après l'unification :
 *  1. Public      — landing
 *  2. Academy     — hub → catalogue → détail cours → programme HEF
 *  3. Acquisition — landing → profiling → invite WhatsApp
 *  4. Auth        — garde proxy.ts sur les routes protégées
 *
 * Prérequis : `pnpm dev` (le webServer Playwright le démarre si absent).
 * Les attentes reflètent l'état réellement vérifié à la main (contenu seedé en DB).
 */

test.describe('Parcours public', () => {
  test('la landing charge', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/HASHCODE/i);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });
});

test.describe('Academy', () => {
  test('le hub academy charge', async ({ page }) => {
    await page.goto('/academy');
    await expect(page).toHaveTitle(/academy/i);
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(/apprends/i);
  });

  test('le catalogue liste les cours seedés', async ({ page }) => {
    await page.goto('/academy/courses');
    // Les 3 cours du seed : hef-devops, hef-bases-donnees, hef-algorithmique
    await expect(page.getByText(/devops/i).first()).toBeVisible();
    // Le catalogue expose bien des liens vers les fiches cours
    await expect(page.locator('a[href*="/academy/courses/"]').first()).toBeVisible();
  });

  test('le détail d’un cours charge', async ({ page }) => {
    await page.goto('/academy/courses/hef-devops');
    await expect(page).toHaveTitle(/DevOps/i);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });

  test('le programme HEF charge avec ses phases', async ({ page }) => {
    await page.goto('/academy/programme');
    await expect(page.getByText(/Foundations/i).first()).toBeVisible();
  });

  test('les parcours (phases HEF) chargent', async ({ page }) => {
    await page.goto('/academy/paths');
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });
});

test.describe('Funnel d’acquisition', () => {
  test('la landing acquisition charge', async ({ page }) => {
    await page.goto('/acquisition');
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(/HASHCODE/i);
  });

  test('le profiling affiche la première question', async ({ page }) => {
    await page.goto('/acquisition/profiling');
    // Regex pour éviter l’apostrophe typographique dans le sélecteur
    await expect(page.getByText(/Comment devons-nous t.appeler/i).first()).toBeVisible();
  });

  test('la page d’invitation WhatsApp charge', async ({ page }) => {
    await page.goto('/acquisition/invite');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/communaut/i);
  });
});

test.describe('Garde d’authentification (proxy.ts)', () => {
  test('/dashboard redirige un visiteur vers /signin', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/signin/);
    await expect(page).toHaveURL(/reason=auth_required/);
  });

  test('/admin redirige un visiteur vers /signin', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/signin/);
  });

  test('/signin est accessible', async ({ page }) => {
    await page.goto('/signin');
    await expect(page).toHaveURL(/\/signin/);
    await expect(page.locator('body')).toBeVisible();
  });
});
