import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT || 3000;
const baseURL = `http://localhost:${PORT}`;

/**
 * E2E du parcours auth OTP.
 * L'email est mocké (RESEND_API_KEY vide) : le code est lu dans la base.
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: ["auth-otp.spec.ts"],
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "line",
  timeout: process.env.CI ? 60_000 : 120_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-auth",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: process.env.CI ? "pnpm start" : "pnpm dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      RESEND_API_KEY: "",
    },
    stdout: "pipe",
    stderr: "pipe",
  },
});
