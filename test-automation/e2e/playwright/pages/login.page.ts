import { type Page } from '@playwright/test';

/**
 * Page Object Model for Login page
 * Encapsulates all interactions with the login page at /login
 */
export class LoginPage {
  readonly page: Page;
  readonly baseUrl: string;
  readonly loginUrl: string;

  // Admin credentials
  readonly adminEmail = 'admin@example.com';
  readonly adminPassword = 'Admin123!';

  constructor(page: Page, baseUrl: string = 'http://localhost:3000') {
    this.page = page;
    this.baseUrl = baseUrl;
    this.loginUrl = `${baseUrl}/login`;
  }

  /**
   * Navigate to the login page
   */
  async navigate(options?: { timeoutMs?: number; retries?: number }): Promise<void> {
    const timeoutMs = options?.timeoutMs ?? 10000; // per-attempt timeout
    const retries = options?.retries ?? 6; // total attempts

    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    let lastError: unknown = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Try navigating with a sensible per-attempt timeout
        await this.page.goto(this.loginUrl, { waitUntil: 'load', timeout: timeoutMs });
        // Ensure page loaded (some apps navigate client-side)
        await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => {});
        return;
      } catch (err) {
        lastError = err;
        // If this was the last attempt, break and throw below
        if (attempt === retries) break;
        // Wait progressively longer between attempts
        const backoff = Math.min(2000 * attempt, 10000);
        // Small console log to help debug CI flakes
        // eslint-disable-next-line no-console
        console.warn(`LoginPage.navigate attempt ${attempt} failed, retrying in ${backoff}ms:`, (err as Error).message ?? err);
        await sleep(backoff);
      }
    }

    // If we reach here all attempts failed — throw a clearer error
    throw new Error(
      `Failed to navigate to ${this.loginUrl} after ${retries} attempts. Last error: ${(lastError as Error)?.message ?? String(lastError)}`
    );
  }

  /**
   * Log in as admin using email and password
   * Robust cross-browser implementation with fallbacks
   */
  async loginAsAdmin(): Promise<void> {
    await this.navigate();

    // Fill email - try multiple selectors for cross-browser compatibility
    const emailInputs = [
      'input[name="email"]',
      'input[type="email"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="Email" i]',
    ];

    let emailFilled = false;
    for (const selector of emailInputs) {
      try {
        const input = this.page.locator(selector).first();
        if (await input.count()) {
          await input.fill(this.adminEmail);
          emailFilled = true;
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }

    // Fill password - try multiple selectors
    const passwordInputs = [
      'input[name="password"]',
      'input[type="password"]',
      'input[placeholder*="password" i]',
      'input[placeholder*="Password" i]',
    ];

    let passwordFilled = false;
    for (const selector of passwordInputs) {
      try {
        const input = this.page.locator(selector).first();
        if (await input.count()) {
          await input.fill(this.adminPassword);
          passwordFilled = true;
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }

    // Submit form - try multiple button selectors
    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Sign In")',
      'button:has-text("Login")',
      'button:has-text("Log in")',
      'input[type="submit"]',
    ];

    let submitted = false;
    for (const selector of submitSelectors) {
      try {
        const submit = this.page.locator(selector).first();
        if (await submit.count()) {
          await submit.click();
          submitted = true;
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }

    // Fallback: submit form via JavaScript if button not found
    if (!submitted) {
      await this.page.evaluate(() => {
        const form = document.querySelector('form') as HTMLFormElement | null;
        if (form) {
          form.submit();
        }
      });
    }

    // Wait for redirect after login - more robust
    try {
      await this.page.waitForURL(/\/(dashboard|job-roles|admin)/, {
        timeout: 15000,
      });
    } catch (e) {
      // If no specific URL, just wait for load state
      await this.page.waitForLoadState('load');
    }
  }

  /**
   * Get the page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Get the current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take a screenshot and save it
   */
  async takeScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }
}
