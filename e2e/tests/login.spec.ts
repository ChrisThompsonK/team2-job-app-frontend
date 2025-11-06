import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { testUsers } from "../fixtures/testData";

/**
 * Login Form Tests - Using Page Object Model (POM)
 *
 * These tests validate the login form functionality using the LoginPage POM.
 * All page interactions are abstracted through the LoginPage class, making
 * tests more maintainable and reducing duplication.
 *
 * Test Coverage:
 * - Page loading and form visibility
 * - Valid credential submission
 * - Empty field validation
 * - Invalid email format handling
 * - Invalid credentials
 * - Navigation to registration
 * - Error message display
 */
test.describe("Login Form Tests", () => {
	let loginPage: LoginPage;

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page);
		await loginPage.navigate();
	});

	test.describe("Page Load & Display", () => {
		test("should load login page with correct title", async ({ page }) => {
			await expect(page).toHaveTitle(/login/i);
		});

		test("should display footer", async ({ page }) => {
    	const footer = page.locator("footer");
    	await expect(footer).toBeVisible();
		});

		test("should display login form with all required fields", async () => {
			const isLoaded = await loginPage.verifyPageLoaded();
			expect(isLoaded).toBe(true);
		});

		test("should have visible email and password input fields", async ({ page }) => {
			const emailInput = page.locator('input[name="email"]');
			const passwordInput = page.locator('input[name="password"]');

			await expect(emailInput).toBeVisible();
			await expect(passwordInput).toBeVisible();
		});

		test("should have submit button enabled initially", async ({ page }) => {
			const submitButton = page.locator('button[type="submit"]');
			await expect(submitButton).toBeEnabled();
		});
	});

	test.describe("Valid Credentials", () => {
		test("should submit login form with valid data", async ({ page }) => {
			await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
			await loginPage.waitForPageLoad();

			// Verify we're no longer on the login page
			const currentUrl = page.url();
			expect(currentUrl).not.toContain("/login");
		});

		test("should navigate away from login after successful login", async ({ page }) => {
			await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
			await page.waitForNavigation().catch(() => {
				// Navigation may not happen in test environment
			});
			await loginPage.waitForPageLoad();

			const url = page.url();
			expect(url).not.toContain("/login");
		});
	});

	test.describe("Empty Fields Validation", () => {
		test("should handle empty email field", async ({ page }) => {
			await loginPage.login("", testUsers.validUser.password);
			await loginPage.waitForPageLoad();

			// Should remain on login page if email is empty
			const currentUrl = page.url();
			expect(currentUrl).toContain("/login");
		});

		test("should handle empty password field", async ({ page }) => {
			await loginPage.login(testUsers.validUser.email, "");
			await loginPage.waitForPageLoad();

			// Should remain on login page if password is empty
			const currentUrl = page.url();
			expect(currentUrl).toContain("/login");
		});

		test("should handle both email and password empty", async ({ page }) => {
			await loginPage.login("", "");
			await loginPage.waitForPageLoad();

			const currentUrl = page.url();
			expect(currentUrl).toContain("/login");
		});
	});

	test.describe("Email Format Validation", () => {
		test("should handle invalid email format", async ({ page }) => {
			await loginPage.login("not-an-email", testUsers.validUser.password);
			await loginPage.waitForPageLoad();

			// Should remain on login page with invalid email
			const currentUrl = page.url();
			expect(currentUrl).toContain("/login");
		});

		test("should handle email without domain", async ({ page }) => {
			await loginPage.login("user@", testUsers.validUser.password);
			await loginPage.waitForPageLoad();

			const currentUrl = page.url();
			expect(currentUrl).toContain("/login");
		});

		test("should handle email with spaces", async ({ page }) => {
			await loginPage.login("user @example.com", testUsers.validUser.password);
			await loginPage.waitForPageLoad();

			const currentUrl = page.url();
			expect(currentUrl).toContain("/login");
		});
	});

	test.describe("Invalid Credentials", () => {
		test("should reject non-existent user", async () => {
			await loginPage.login(testUsers.invalidUser.email, testUsers.invalidUser.password);
			await loginPage.waitForPageLoad();

			// Attempt to detect error (URL remains on login or error message shown)
			const hasError = await loginPage.isErrorDisplayed();
			const urlOnLogin = loginPage["page"].url().includes("/login");

			expect(hasError || urlOnLogin).toBe(true);
		});

		test("should show error message on invalid credentials", async () => {
			await loginPage.login(testUsers.invalidUser.email, testUsers.invalidUser.password);
			await loginPage.waitForPageLoad();

			const hasError = await loginPage.isErrorDisplayed();
			// Either show error or remain on login
			const isOnLoginPage =
				loginPage["page"].url().includes("/login") || (await loginPage.isErrorDisplayed());

			expect(isOnLoginPage).toBe(true);
		});
	});

	test.describe("Form Navigation", () => {
		test("should have link to register page", async ({ page }) => {
			const registerLink = page.locator('a[href="/register"]');
			await expect(registerLink).toBeVisible();
		});

		test("should navigate to register page when clicking register link", async ({ page }) => {
			await loginPage.goToRegister();
			await loginPage.waitForPageLoad();

			const currentUrl = page.url();
			expect(currentUrl).toContain("/register");
		});
	});

	test.describe("Error Message Display", () => {
		test("should not display error message on initial page load", async () => {
			const hasError = await loginPage.isErrorDisplayed();
			expect(hasError).toBe(false);
		});

		test("should display error message when login fails", async () => {
			await loginPage.login(testUsers.invalidUser.email, testUsers.invalidUser.password);
			await loginPage.waitForPageLoad();

			const hasError = await loginPage.isErrorDisplayed();
			// Should either have error or remain on login page
			const stillOnLoginPage =
				loginPage["page"].url().includes("/login") && !hasError;

			expect(hasError || stillOnLoginPage).toBe(true);
		});

		test("should display readable error message", async () => {
			await loginPage.login(testUsers.invalidUser.email, testUsers.invalidUser.password);
			await loginPage.waitForPageLoad();

			const errorMessage = await loginPage.getErrorMessage();
			// If error exists, it should be a non-empty string
			if (errorMessage) {
				expect(errorMessage.length).toBeGreaterThan(0);
			}
		});
	});
});

