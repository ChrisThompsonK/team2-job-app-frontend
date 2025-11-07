import { BeforeAll, AfterAll, Before, After, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from 'playwright';
import type { Browser } from 'playwright';
import fs from 'fs';
import path from 'path';
import { CustomWorld } from './world.ts';

/**
 * Global test execution variables.
 *
 * These hold the browser instances for all scenarios.
 * Using a single browser across scenarios is more efficient
 * than creating a new browser for each test.
 */
let browser: Browser;

/**
 * HOOK: BeforeAll - Initializes browser before any tests run.
 *
 * This hook runs once before all scenarios in the test suite.
 * It launches the Playwright browser that will be shared across tests.
 *
 * Benefits:
 * - Efficient resource usage (one browser for all tests)
 * - Faster test execution (browser startup happens once)
 * - Consistent browser environment
 */
BeforeAll(async function () {
  console.log('🚀 Starting test execution...');
  console.log(`📋 Browser type: ${process.env['BROWSER'] || 'chromium'}`);

  // Launch browser based on environment variable (default: chromium)
  const browserType = process.env['BROWSER'] || 'chromium';

  switch (browserType) {
    case 'firefox':
      browser = await firefox.launch({
        headless: process.env['HEADLESS'] !== 'false',
        slowMo: parseInt(process.env['SLOW_MO'] || '0'),
      });
      break;
    case 'webkit':
      browser = await webkit.launch({
        headless: process.env['HEADLESS'] !== 'false',
        slowMo: parseInt(process.env['SLOW_MO'] || '0'),
      });
      break;
    case 'chromium':
    default:
      browser = await chromium.launch({
        headless: process.env['HEADLESS'] !== 'false',
        slowMo: parseInt(process.env['SLOW_MO'] || '0'),
      });
      break;
  }

  console.log('✅ Browser launched successfully');
});

/**
 * HOOK: AfterAll - Cleanup after all tests complete.
 *
 * This hook runs once after all scenarios have completed.
 * It ensures the browser is properly closed and resources are freed.
 *
 * Benefits:
 * - Proper resource cleanup
 * - Prevents orphaned processes
 * - Graceful test suite shutdown
 */
AfterAll(async function () {
  console.log('🧹 Cleaning up test resources...');

  if (browser) {
    await browser.close();
    console.log('✅ Browser closed successfully');
  }

  console.log('📊 Test execution completed');
});

/**
 * HOOK: Before - Runs before each scenario.
 *
 * This hook creates a fresh browser context and page for each scenario,
 * ensuring test isolation. Each scenario runs in its own isolated context
 * with its own cookies, local storage, and session data.
 *
 * Key benefits:
 * - Test isolation: Changes in one test don't affect others
 * - Clean state: Each test starts fresh
 * - Parallel-safe: Each test has its own context
 *
 * @param this - Cucumber World instance for the scenario
 */
Before(async function (this: CustomWorld) {
  console.log(`\n🎬 Starting scenario: "${this.scenarioName}"`);
  
  // Track test start time for execution duration calculation
  (this as any).testStartTime = Date.now();

  try {
    // Create a new browser context with specific viewport
    // Context is like a "private window" with its own cookies/storage
    this.browserContext = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,

      // Locale and timezone settings
      locale: 'en-US',
      timezoneId: 'America/New_York',

      // Additional context options
      colorScheme: 'light',
    });

    // Create a new page within the context
    // Page is the actual tab/window where tests run
    this.page = await this.browserContext.newPage();

    // Set default navigation and action timeouts
    this.page.setDefaultNavigationTimeout(30000);
    this.page.setDefaultTimeout(10000);

    // Store browser instance in world context
    this.browser = browser;

    console.log(`✅ Browser context and page created for scenario`);
  } catch (error) {
    console.error('❌ Error setting up browser context:', error);
    throw error;
  }
});

/**
 * HOOK: After - Runs after each scenario.
 *
 * This hook performs cleanup and error handling after each scenario.
 * If a scenario fails, it captures a screenshot and error details.
 *
 * Key responsibilities:
 * - Screenshot capture on failure (for debugging)
 * - Browser context cleanup
 * - Error logging
 * - Page closure
 *
 * @param this - Cucumber World instance for the scenario
 * @param scenario - Scenario object with status information
 */
After(async function (this: CustomWorld, scenario) {
  const scenarioStatus = scenario.result?.status;
  const scenarioName = scenario.pickle.name;

  console.log(`\n🏁 Scenario: "${scenarioName}" - Status: ${scenarioStatus}`);

  try {
    // Capture screenshot if scenario failed
    if (scenarioStatus === Status.FAILED) {
      console.log('📸 Capturing screenshot for failed scenario...');

      // Create screenshots directory if it doesn't exist
      const screenshotsDir = './test-results/screenshots';
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      // Generate filename with timestamp and scenario name
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const sanitizedScenarioName = scenarioName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const screenshotPath = path.join(screenshotsDir, `${timestamp}_${sanitizedScenarioName}.png`);

      // Capture screenshot
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📷 Screenshot saved: ${screenshotPath}`);

      // Optionally capture HTML for debugging
      const htmlPath = path.join(screenshotsDir, `${timestamp}_${sanitizedScenarioName}.html`);
      const html = await this.page.content();
      fs.writeFileSync(htmlPath, html);
      console.log(`📄 Page HTML saved: ${htmlPath}`);
    }

    // Log test execution time
    const executionTime = Date.now() - (this as any).testStartTime;
    console.log(`⏱️  Scenario execution time: ${executionTime}ms`);

    // Close the page
    if (this.page) {
      await this.page.close();
      console.log('✅ Page closed');
    }

    // Close the browser context
    if (this.browserContext) {
      await this.browserContext.close();
      console.log('✅ Browser context closed');
    }
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
});

/**
 * Optional: Additional hook for debugging
 *
 * This hook logs step information for debugging purposes.
 * Enable this if you need detailed step-by-step logging.
 */
/*
Before(function(this: CustomWorld, { pickle }) {
  console.log(`\n📝 Steps in scenario "${pickle.name}":`);
  pickle.steps.forEach((step, index) => {
    console.log(`   ${index + 1}. ${step.type} ${step.text}`);
  });
});
*/