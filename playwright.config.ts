import { defineConfig } from "@playwright/test";

export default defineConfig({
  maxFailures: 1,
  testDir: "e2e",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "bun run dev",
    port: 5173,
    reuseExistingServer: true,
  },
});
