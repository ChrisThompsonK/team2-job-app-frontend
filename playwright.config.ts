import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
testDir: "./e2e/tests",
timeout: 30000,
fullyParallel: true,
forbidOnly: !!process.env.CI,
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 1 : undefined,

reporter: [
["html", { outputFolder: "playwright-report" }],
["list"],
["json", { outputFile: "test-results/results.json" }],
],

use: {
baseURL: "http://localhost:3000",
trace: "on-first-retry",
screenshot: "only-on-failure",
video: "retain-on-failure",
viewport: { width: 1280, height: 720 },
ignoreHTTPSErrors: true,
actionTimeout: 10000,
navigationTimeout: 30000,
},

projects: [
{
name: "chromium",
use: {
...devices["Desktop Chrome"],
launchOptions: {
args: ["--disable-web-security"],
},
},
},
],

webServer: {
command: "npm run dev",
url: "http://localhost:3000",
reuseExistingServer: !process.env.CI,
timeout: 120000,
stdout: "ignore",
stderr: "pipe",
},
});
