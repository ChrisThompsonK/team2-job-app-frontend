import type { Page } from 'playwright';

/**
 * JobAppPage Object Model
 *
 * Encapsulates all selectors and methods for interacting with the
 * job application portal. This page object handles navigation,
 * form interactions, and assertions.
 *
 * All selectors are maintained in one place for easy updates
 * when the application UI changes.
 */
export class JobAppPage {
  private page: Page;

  // Main navigation elements
  private loginLink = 'a:has-text("Login")';
  private registerLink = 'a:has-text("Register")';
  private navigationBar = 'nav, header nav, .navbar';
  private header = 'header';
  private footer = 'footer';

  // Login page elements
  private emailInput = 'input[type="email"], input[name="email"], input[placeholder*="email" i]';
  private passwordInput = 'input[type="password"], input[name="password"]';
  private loginButton = 'button:has-text("Login"), button:has-text("Sign In"), input[type="submit"][value*="Login" i]';

  // Register page elements
  private registerForm = 'form[class*="register"], form[class*="signup"]';
  private createAccountButton = 'button:has-text("Create Account"), button:has-text("Register"), button:has-text("Sign Up")';

  // Error messages
  private errorMessage = '.error, .alert-error, [role="alert"]';

  /**
   * Constructor
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to job app home page
   */
  async goto(): Promise<void> {
    const baseUrl = process.env['BASE_URL'] || 'http://localhost:3000';
    await this.page.goto(baseUrl);
    
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on Login link
   */
  async clickLoginLink(): Promise<void> {
    await this.page.click(this.loginLink);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on Register link
   */
  async clickRegisterLink(): Promise<void> {
    await this.page.click(this.registerLink);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Enter email address
   * @param email - Email address to enter
   */
  async enterEmail(email: string): Promise<void> {
    const emailField = this.page.locator(this.emailInput).first();
    await emailField.waitFor({ state: 'visible' });
    await emailField.fill(email);
  }

  /**
   * Enter password
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    const passwordField = this.page.locator(this.passwordInput).first();
    await passwordField.waitFor({ state: 'visible' });
    await passwordField.fill(password);
  }

  /**
   * Click the login/submit button
   */
  async clickLoginButton(): Promise<void> {
    const button = this.page.locator(this.loginButton).first();
    await button.waitFor({ state: 'visible' });
    await button.click();
    
    // Wait for navigation or response
    await this.page.waitForTimeout(1000);
  }

  /**
   * Check if login form is visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    const emailField = this.page.locator(this.emailInput);
    return emailField.isVisible();
  }

  /**
   * Check if registration form is visible
   */
  async isRegisterFormVisible(): Promise<boolean> {
    const form = this.page.locator(this.registerForm);
    return form.isVisible();
  }

  /**
   * Check if email input field exists
   */
  async hasEmailField(): Promise<boolean> {
    const field = this.page.locator(this.emailInput);
    return field.isVisible();
  }

  /**
   * Check if password input field exists
   */
  async hasPasswordField(): Promise<boolean> {
    const field = this.page.locator(this.passwordInput);
    return field.isVisible();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    const error = this.page.locator(this.errorMessage);
    
    if (await error.isVisible()) {
      return error.textContent().then(text => text?.trim() || '');
    }
    
    return '';
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    const error = this.page.locator(this.errorMessage);
    return error.isVisible().catch(() => false);
  }

  /**
   * Check if login button is visible
   */
  async isLoginButtonVisible(): Promise<boolean> {
    const button = this.page.locator(this.loginButton);
    return button.isVisible();
  }

  /**
   * Check if register button is visible
   */
  async isRegisterButtonVisible(): Promise<boolean> {
    const button = this.page.locator(this.createAccountButton);
    return button.isVisible();
  }

  /**
   * Check if login link is visible
   */
  async hasLoginLink(): Promise<boolean> {
    const link = this.page.locator(this.loginLink);
    return link.isVisible().catch(() => false);
  }

  /**
   * Check if register link is visible
   */
  async hasRegisterLink(): Promise<boolean> {
    const link = this.page.locator(this.registerLink);
    return link.isVisible().catch(() => false);
  }

  /**
   * Check if navigation bar is visible
   */
  async hasNavigationBar(): Promise<boolean> {
    const nav = this.page.locator(this.navigationBar);
    return nav.isVisible().catch(() => false);
  }

  /**
   * Check if header element exists
   */
  async hasHeader(): Promise<boolean> {
    const header = this.page.locator(this.header);
    return header.isVisible().catch(() => false);
  }

  /**
   * Check if footer element exists
   */
  async hasFooter(): Promise<boolean> {
    const footer = this.page.locator(this.footer);
    return footer.isVisible().catch(() => false);
  }

  /**
   * Get current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Check if page contains specific text
   */
  async hasText(text: string): Promise<boolean> {
    return this.page.locator(`text=${text}`).isVisible().catch(() => false);
  }

  /**
   * Wait for page title to contain text
   */
  async waitForTitle(titleText: string): Promise<void> {
    await this.page.waitForURL(`**${titleText}**`, { timeout: 5000 }).catch(() => {
      // Title might not be in URL, that's OK
    });
  }

  /**
   * Take a screenshot for debugging
   */
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `test-results/screenshots/${timestamp}_${name}.png`;
    await this.page.screenshot({ path: filename, fullPage: true });
  }
}
