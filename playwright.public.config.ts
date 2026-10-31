import { defineConfig } from "@playwright/test"

const PORT = Number(process.env.PORT ?? 3000)
const baseURL = `http://127.0.0.1:${PORT}`

/**
 * Minimal Playwright profile for the public showcase.
 * Intentionally excludes the authenticated E2E globalSetup: public pages
 * must be testable without provisioning Academy data or signing test sessions.
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: ["public-site.spec.ts"],
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "line",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-public",
      use: { browserName: "chromium" },
    },
  ],
  webServer: {
    command: "pnpm start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
  },
})
