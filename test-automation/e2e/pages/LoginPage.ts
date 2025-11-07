import type { Page, Locator } from 'playwright';

/**
 * Page Object Model for the SauceDemo Login Page.
 *
 * This class encapsulates all interactions with the login page,
 * providing a clean interface for test automation. Using POM pattern
 * separates the page structure and selectors from test logic, making
 * tests more maintainable and reducing code duplication.
 *
 * Key benefits of this approach:
 * - Centralized page element definitions
 * - Reusable action methods
 * - Easy maintenance when UI changes
 * - Improved test readability
 */
export class LoginPage {
  private readonly page: Page;

  // Page element selectors
  // Using data-testid attributes for reliable element identification
  // This approach is more stable than CSS selectors that might change with styling updates
  private readonly selectors = {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
    menuButton: '#react-burger-menu-btn',
    logoutLink: '#logout_sidebar_link',
  };

  // Page locators - cached for performance
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private errorMessage: Locator;
  private menuButton: Locator;
  private logoutLink: Locator;

  /**
   * Constructor for LoginPage.
   * @param page - Playwright Page instance passed from test context
   *
   * We pass the page fixture into the POM constructor to ensure it's
   * independent and testable. This allows for better separation of concerns
   * and makes the page objects reusable across different test scenarios.
   */
  constructor(page: Page) {
    this.page = page;

    // Initialize locators for better performance
    // Locators are lazy-loaded and cached after first access
    this.usernameInput = page.locator(this.selectors.usernameInput);
    this.passwordInput = page.locator(this.selectors.passwordInput);
    this.loginButton = page.locator(this.selectors.loginButton);
    this.errorMessage = page.locator(this.selectors.errorMessage);
    this.menuButton = page.locator(this.selectors.menuButton);
    this.logoutLink = page.locator(this.selectors.logoutLink);
  }

  /**
   * Navigate to the login page.
   * @param url - Optional URL to navigate to (defaults to base URL)
   *
   * This method centralizes navigation logic and ensures
   * the page is ready for interaction.
   */
  async goto(url?: string): Promise<void> {
    const targetUrl = url || 'https://www.saucedemo.com';
    await this.page.goto(targetUrl);

    // Wait for the login form to be visible
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  /**
   * Enter username in the username input field.
   * @param username - The username to enter
   *
   * This method handles username input with proper waiting
   * and clearing of existing text for reliable automation.
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
  }

  /**
   * Enter password in the password input field.
   * @param password - The password to enter
   *
   * Similar to enterUsername but for password field.
   * Handles sensitive data input appropriately.
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button to submit credentials.
   *
   * This method includes waiting for navigation or error states
   * to ensure the action completes before proceeding.
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();

    // Wait for either successful navigation or error message
    await Promise.race([
      this.page.waitForURL('**/inventory.html'),
      this.errorMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
    ]);
  }

  /**
   * Perform complete login flow in one method.
   * @param username - The username to login with
   * @param password - The password to login with
   *
   * Convenience method that combines all login steps.
   * Useful for scenarios where you just need to log in quickly.
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /**
   * Get the text content of the error message.
   * @returns The error message text
   *
   * This method safely retrieves error messages for validation
   * in negative test scenarios.
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Check if error message is visible.
   * @returns True if error message is visible
   *
   * Useful for assertions in negative test cases.
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Click the menu button to open the navigation menu.
   *
   * Required step before accessing logout functionality.
   */
  async clickMenuButton(): Promise<void> {
    await this.menuButton.waitFor({ state: 'visible' });
    await this.menuButton.click();
  }

  /**
   * Click the logout link in the menu.
   *
   * Performs logout action after menu is opened.
   */
  async clickLogout(): Promise<void> {
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();

    // Wait for redirect back to login page
    await this.page.waitForURL('**/');
  }

  /**
   * Check if user is on the login page.
   * @returns True if on login page
   *
   * Useful for validation after logout or initial page load.
   */
  async isOnLoginPage(): Promise<boolean> {
    return await this.usernameInput.isVisible() &&
           await this.passwordInput.isVisible() &&
           await this.loginButton.isVisible();
  }

  /**
   * Check if user is logged in (on products page).
   * @returns True if on products/inventory page
   *
   * Useful for validation after successful login.
   */
  async isLoggedIn(): Promise<boolean> {
    return this.page.url().includes('/inventory.html');
  }

  /**
   * Wait for the page to be fully loaded.
   *
   * Ensures all elements are ready for interaction.
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.usernameInput.waitFor({ state: 'visible' });
  }
}