import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../e2e/pages/LoginPage.ts';
import { CustomWorld } from '../../support/world.ts';

/**
 * Step definitions for login-related scenarios.
 *
 * This file contains the "glue" code that connects Gherkin feature file steps
 * to the actual automation code. Each step definition corresponds to a
 * Given/When/Then statement in the feature files.
 *
 * The CustomWorld provides access to the Playwright page instance,
 * which is then used to initialize page objects for interaction.
 *
 * Key patterns used:
 * - Page Object Model for UI interactions
 * - Async/await for proper handling of promises
 * - Descriptive step names that match Gherkin syntax
 * - Proper error handling and assertions
 */

// Initialize page object in the world context
let loginPage: LoginPage;

/**
 * Setup step definitions before each scenario.
 *
 * This hook ensures a fresh page object is created for each scenario,
 * providing test isolation and preventing state leakage between tests.
 */
Before(async function (this: CustomWorld) {
  loginPage = new LoginPage(this.page);
});

/**
 * Background step: Navigate to the login page.
 *
 * This step is used in the Background section of the feature file
 * and sets up the initial state for all scenarios.
 */
Given('I am on the SauceDemo login page', async function (this: CustomWorld) {
  await loginPage.goto();
  await loginPage.waitForPageLoad();

  // Verify we're on the login page
  const isOnLoginPage = await loginPage.isOnLoginPage();
  expect(isOnLoginPage).toBe(true);
});

/**
 * Action step: Enter username.
 *
 * @param username - The username to enter (from feature file examples)
 */
When('I enter username {string}', async function (this: CustomWorld, username: string) {
  await loginPage.enterUsername(username);
});

/**
 * Action step: Enter email.
 *
 * @param email - The email to enter (from feature file examples)
 */
When('I enter email {string}', async function (this: CustomWorld, email: string) {
  const emailInput = this.page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
  await emailInput.fill(email);
});

/**
 * Action step: Enter password.
 *
 * @param password - The password to enter (from feature file examples)
 */
When('I enter password {string}', async function (this: CustomWorld, password: string) {
  await loginPage.enterPassword(password);
});

/**
 * Action step: Click login button.
 *
 * This step triggers the login action and handles the async nature
 * of form submission and potential navigation.
 */
When('I click the login button', async function (this: CustomWorld) {
  await loginPage.clickLogin();
});

/**
 * Action step: Click register button.
 *
 * This step triggers navigation to registration page.
 */
When('I click the register button', async function (this: CustomWorld) {
  const button = this.page.locator('button:has-text("Create Account"), button:has-text("Register"), a:has-text("Register")').first();
  await button.click();
  await this.page.waitForLoadState('load');
});

/**
 * Action step: Complete login flow with credentials.
 *
 * Convenience step that combines username, password, and login button click.
 * Useful for scenarios that need to log in quickly.
 *
 * @param username - The username for login
 * @param password - The password for login
 */
Given('I am logged in as {string} with password {string}', async function (this: CustomWorld, username: string, password: string) {
  await loginPage.goto();
  await loginPage.login(username, password);

  // Verify successful login
  const isLoggedIn = await loginPage.isLoggedIn();
  expect(isLoggedIn).toBe(true);
});

/**
 * Action step: Click menu button.
 *
 * Used for accessing the logout functionality which is in a menu.
 */
When('I click the menu button', async function (this: CustomWorld) {
  await loginPage.clickMenuButton();
});

/**
 * Action step: Click logout link.
 *
 * Completes the logout process after opening the menu.
 */
When('I click the logout link', async function (this: CustomWorld) {
  await loginPage.clickLogout();
});

/**
 * Verification step: Check redirection to products page.
 *
 * Asserts that successful login redirects to the inventory/products page.
 */
Then('I should be redirected to the products page', async function (this: CustomWorld) {
  const isLoggedIn = await loginPage.isLoggedIn();
  expect(isLoggedIn).toBe(true);
});

/**
 * Verification step: Check products inventory is visible.
 *
 * After successful login, verifies that the products are displayed.
 * This is a more specific check than just URL verification.
 */
Then('I should see the products inventory', async function (this: CustomWorld) {
  // Check if we're on the inventory page (products page)
  const currentUrl = this.page.url();
  expect(currentUrl).toContain('/inventory.html');
});

/**
 * Verification step: Check error message is displayed.
 *
 * Used for negative test scenarios where login should fail.
 *
 * @param expectedMessage - The exact error message expected
 */
Then('I should see an error message {string}', async function (this: CustomWorld, expectedMessage: string) {
  const isErrorVisible = await loginPage.isErrorMessageVisible();
  expect(isErrorVisible).toBe(true);

  const actualMessage = await loginPage.getErrorMessage();
  expect(actualMessage).toContain(expectedMessage);
});

/**
 * Verification step: Check redirection to login page.
 *
 * Used after logout to verify the user is back on the login page.
 */
Then('I should be redirected to the login page', async function (this: CustomWorld) {
  const isOnLoginPage = await loginPage.isOnLoginPage();
  expect(isOnLoginPage).toBe(true);
});

/**
 * Verification step: Check login form is visible.
 *
 * Additional verification after logout to ensure the login form is displayed.
 * More flexible to handle different page structures.
 */
Then('I should see the login form', async function (this: CustomWorld) {
  
  // Try multiple strategies to find login form
  const loginForm = this.page.locator('form, [data-testid*="login"], .login-form').first();
  const usernameInput = this.page.locator('input[name="username"], input[name="email"], input[type="email"], input[data-test="username"]').first();
  const passwordInput = this.page.locator('input[name="password"], input[type="password"], input[data-test="password"]').first();
  
  const formExists = await loginForm.count() > 0;
  const usernameExists = await usernameInput.count() > 0;
  const passwordExists = await passwordInput.count() > 0;
  
  // Pass if we have a form OR both username and password inputs
  expect(formExists || (usernameExists && passwordExists)).toBeTruthy();
});

/**
 * Verification step: Generic result checker for scenario outlines.
 *
 * This step handles different expected outcomes based on the scenario data.
 * It's more flexible for data-driven tests.
 *
 * @param expectedResult - The expected result (could be "products page" or "error message: ...")
 */
Then('I should see {string}', async function (this: CustomWorld, expectedResult: string) {
  if (expectedResult === 'products page') {
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
  } else if (expectedResult.startsWith('error message:')) {
    const expectedMessage = expectedResult.replace('error message: ', '');
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBe(true);

    const actualMessage = await loginPage.getErrorMessage();
    expect(actualMessage).toContain(expectedMessage);
  } else {
    throw new Error(`Unexpected expected result: ${expectedResult}`);
  }
});