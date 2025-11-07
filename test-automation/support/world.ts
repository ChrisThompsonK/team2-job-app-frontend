import { World, setWorldConstructor } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from 'playwright';

/**
 * Custom World class for Cucumber.
 *
 * The World object is the context that's available to all step definitions
 * in a test scenario. This custom implementation manages Playwright instances,
 * making them available to all steps without needing to pass them around.
 *
 * Key responsibilities:
 * - Initialize and hold the Playwright Page instance
 * - Provide access to page to all step definitions
 * - Store scenario context and test data
 * - Support screenshot capture on failure (handled in hooks)
 *
 * Best Practice:
 * We use a custom World to manage browser state, ensuring each test runs
 * in isolation. The browser, context, and page are created fresh for
 * each scenario and cleaned up properly after execution.
 */
export class CustomWorld extends World {
  // Playwright instances
  public page!: Page;
  public browser!: Browser;
  public browserContext!: BrowserContext;

  // Test scenario metadata
  public scenarioName: string = '';
  public testStartTime: number = 0;

  // Test data store for sharing data between steps
  public testData: Map<string, unknown> = new Map();

  /**
   * Constructor for CustomWorld.
   * @param options - Options provided by Cucumber with scenario data
   */
  constructor(options: any) {
    super(options);
    this.scenarioName = (options.pickle?.name) || 'Unknown Scenario';
    this.testStartTime = Date.now();
  }

  /**
   * Store test data in the context.
   * Useful for sharing values between steps.
   *
   * @param key - Key to store the value under
   * @param value - The value to store
   *
   * Example usage:
   * this.setTestData('userId', 123);
   * const userId = this.getTestData('userId');
   */
  public setTestData(key: string, value: unknown): void {
    this.testData.set(key, value);
  }

  /**
   * Retrieve test data from context.
   * @param key - Key to retrieve
   * @returns The stored value or undefined
   */
  public getTestData(key: string): unknown {
    return this.testData.get(key);
  }

  /**
   * Get the current scenario execution time in milliseconds.
   * @returns Time elapsed since scenario start
   */
  public getExecutionTime(): number {
    return Date.now() - this.testStartTime;
  }

  /**
   * Clear all test data.
   * Useful for cleanup between scenarios.
   */
  public clearTestData(): void {
    this.testData.clear();
  }
}