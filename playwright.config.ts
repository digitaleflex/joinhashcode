// Charge les .env EN PREMIER — Playwright ne les charge pas automatiquement.
// Indispensable : le globalSetup lit BETTER_AUTH_SECRET (signature des cookies de
// session) et @/lib/prisma lit DATABASE_URL. Sans ça, les sessions de test sont
// signées avec un mauvais secret et rejetées par l'application.
// NB: en ES modules, tous les `import` sont évalués avant le corps du module —
// charger dotenv dans un module importé ne suffit donc pas.
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT || 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  globalSetup: "./e2e/global-setup.ts",
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  // Dev server Turbopack : la 1re compilation d'une route peut dépasser 45 s.
  // En CI (build de prod) on garde un timeout serré.
  timeout: process.env.CI ? 60_000 : 120_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
