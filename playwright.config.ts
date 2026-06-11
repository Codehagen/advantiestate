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
    baseURL: `http://localhost:${process.env.PW_PORT ?? 3000}`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Tests run against a production build — prerendered pages, realistic, and
  // fast (no dev compile-on-hit). The build also fails loudly on any page error.
  // PW_PORT escapes a port-3000 collision with another locally running app
  // (reuseExistingServer would otherwise silently test the WRONG server):
  //   PW_PORT=3105 npx playwright test …
  webServer: {
    command: `pnpm build && PORT=${process.env.PW_PORT ?? 3000} pnpm start`,
    url: `http://localhost:${process.env.PW_PORT ?? 3000}`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
