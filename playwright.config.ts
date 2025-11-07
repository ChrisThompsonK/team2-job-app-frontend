import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the test automation framework.
 *
 * This configuration defines browser settings, test execution options,
 * and reporting preferences for the BDD test framework.
 *
 * Key features:
 * - Multiple browser support (Chromium, Firefox, WebKit)
 * - Screenshot and video capture on failure
 * - HTML reporting
 * - Parallel execution support
 * - Custom test directory structure
 */
export default defineConfig({
  // Directory containing the test files (Playwright specs only)
  testDir: './test-automation/e2e/playwright',

  // Timeout settings for tests and actions
  timeout: 30 * 1000, // 30 seconds for test timeout
  expect: {
    timeout: 5000, // 5 seconds for expect assertions
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html'], // HTML report
    ['json', { outputFile: 'test-results/results.json' }], // JSON report for CI
    ['junit', { outputFile: 'test-results/results.xml' }], // JUnit for CI integration
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL for the application under test
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Take screenshot only when test fails
    screenshot: 'only-on-failure',

    // Record video for all tests (set to 'on' to always record; 'retain-on-failure' keeps only failures)
    video: 'retain-on-failure',

    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // Action timeout
    actionTimeout: 10000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // Disabled for now - form field selection issues on mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Folder for test artifacts such as screenshots, videos, traces, etc.
  // Use a subfolder for Playwright artifacts so it's easy to find videos
  outputDir: 'test-results/playwright',

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});