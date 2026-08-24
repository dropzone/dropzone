import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.TEST_SERVER_PORT ?? 8888);

// End-to-end tests drive the built files in dist/ through a real browser, so
// `pnpm build` has to have run first. The unit suite (vitest) covers src/.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Replaces the old start-test-server + wait-on dance: Playwright starts the
  // server, waits for it, and shuts it down again.
  webServer: {
    command: "node test/test-server.js",
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
  },
});
