import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the editorial redesign port.
 * Smoke + regression coverage: page loads, MDX rendering, structured data,
 * the contact form. See ~/.gstack test plan for the full matrix.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Tests run against a production build — prerendered pages, realistic, and
  // fast (no dev compile-on-hit). The build also fails loudly on any page error.
  webServer: {
    command: "pnpm build && pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
