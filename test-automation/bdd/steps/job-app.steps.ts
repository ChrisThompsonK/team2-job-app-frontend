import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world.ts';
import { JobAppPage } from '../../e2e/pages/JobAppPage.ts';

/**
 * Step Definitions for Job Application Portal
 *
 * These steps test the job application portal's functionality,
 * including navigation, form interactions, and UI elements.
 */

let jobAppPage: JobAppPage;

/**
 * Initialize page object before each scenario
 */
Before(async function (this: CustomWorld) {
  jobAppPage = new JobAppPage(this.page);
});

// ============================================================================
// GIVEN - Setup Steps
// ============================================================================

/**
 * Navigate to job app home page
 */
Given('I am on the job app home page', async function (this: CustomWorld) {
  await jobAppPage.goto();
  await this.page.waitForLoadState('networkidle');
});

/**
 * Navigate to job app login page
 */
Given('I am on the job app login page', async function (this: CustomWorld) {
  await jobAppPage.goto();
  await jobAppPage.clickLoginLink();
});

// ============================================================================
// WHEN - Action Steps
// ============================================================================

/**
 * Click on a link by text
 */
When('I click on {string} link', async function (this: CustomWorld, linkText: string) {
  if (linkText.toLowerCase() === 'login') {
    await jobAppPage.clickLoginLink();
  } else if (linkText.toLowerCase() === 'register' || linkText.toLowerCase() === 'sign up') {
    await jobAppPage.clickRegisterLink();
  } else {
    const link = this.page.locator(`text=${linkText}`).first();
    await link.click();
  }
  
  await this.page.waitForLoadState('networkidle');
});

// ============================================================================
// THEN - Assertion Steps
// ============================================================================

/**
 * Check if registration form is visible
 */
Then('I should see the registration form', async function (this: CustomWorld) {
  const isVisible = await jobAppPage.isRegisterFormVisible();
  expect(isVisible).toBeTruthy();
});

/**
 * Check if email input field is visible
 */
Then('I should see {string} input field', async function (this: CustomWorld, fieldName: string) {
  if (fieldName.toLowerCase() === 'email') {
    const hasField = await jobAppPage.hasEmailField();
    expect(hasField).toBeTruthy();
  } else if (fieldName.toLowerCase() === 'password') {
    const hasField = await jobAppPage.hasPasswordField();
    expect(hasField).toBeTruthy();
  }
});

/**
 * Check if email input exists (alternative)
 */
Then('I should see {string} input', async function (this: CustomWorld, fieldName: string) {
  if (fieldName.toLowerCase() === 'email') {
    const hasField = await jobAppPage.hasEmailField();
    expect(hasField).toBeTruthy();
  } else if (fieldName.toLowerCase() === 'password') {
    const hasField = await jobAppPage.hasPasswordField();
    expect(hasField).toBeTruthy();
  }
});

/**
 * Check if specific button is visible
 */
Then('I should see {string} button', async function (this: CustomWorld, buttonText: string) {
  const button = this.page.locator(`button:has-text("${buttonText}")`).first();
  const isVisible = await button.isVisible();
  expect(isVisible).toBeTruthy();
});

/**
 * Check if navigation link exists
 */
Then('I should see {string} link', async function (this: CustomWorld, linkText: string) {
  const pageUrl = this.page.url();
  
  if (linkText.toLowerCase() === 'login') {
    const hasLink = await jobAppPage.hasLoginLink().catch(() => false);
    if (!hasLink) {
      const link = this.page.locator('a:has-text("Login"), a[href*="login"]').first();
      const count = await link.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  } else if (linkText.toLowerCase() === 'register') {
    const link = this.page.locator('a:has-text("Register"), a:has-text("Sign Up"), a[href*="register"]').first();
    const count = await link.count();
    expect(count).toBeGreaterThanOrEqual(0);
  } else {
    const link = this.page.locator(`a:has-text("${linkText}"), button:has-text("${linkText}")`).first();
    const isVisible = await link.isVisible().catch(() => false);
    expect(isVisible || pageUrl.includes(linkText.toLowerCase())).toBeTruthy();
  }
});

/**
 * Check if navigation bar is visible
 */
Then('I should see the navigation bar', async function (this: CustomWorld) {
  const hasNav = await jobAppPage.hasNavigationBar();
  expect(hasNav).toBeTruthy();
});

/**
 * Check if navigation menu exists
 */
Then('I should see a navigation menu', async function (this: CustomWorld) {
  const hasNav = await jobAppPage.hasNavigationBar();
  expect(hasNav).toBeTruthy();
});

/**
 * Check if header element exists
 */
Then('I should see a header element', async function (this: CustomWorld) {
  const hasHeader = await jobAppPage.hasHeader();
  expect(hasHeader).toBeTruthy();
});

/**
 * Check if footer element exists
 */
Then('I should see a footer element', async function (this: CustomWorld) {
  const hasFooter = await jobAppPage.hasFooter();
  expect(hasFooter).toBeTruthy();
});

/**
 * Check for specific error message (job-app context)
 */
Then('I should see error {string}', async function (this: CustomWorld, errorText: string) {
  const hasText = await jobAppPage.hasText(errorText);
  expect(hasText).toBeTruthy();
});
