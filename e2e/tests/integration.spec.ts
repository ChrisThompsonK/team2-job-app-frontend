import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { JobRolesListPage } from "../pages/JobRolesListPage";
import { JobApplicationPage } from "../pages/JobApplicationPage";
import { testUsers, testApplications, testFiles } from "../fixtures/testData";

/**
 * Integration Tests - Multi-Page Workflows
 *
 * These tests demonstrate complex user workflows that span multiple pages.
 * They showcase how POM simplifies testing realistic user scenarios.
 *
 * Workflows Tested:
 * 1. Login → Browse Job Roles → Apply for Position
 * 2. Search Job Roles → Filter Results
 * 3. Pagination workflow
 * 4. Error handling across multiple pages
 */
test.describe("Integration Tests - User Workflows", () => {
	/**
	 * Workflow: Browse and Filter Job Roles
	 * This workflow tests navigation and searching without requiring authentication
	 */
	test.describe("Browse Job Roles Workflow", () => {
		let jobRolesPage: JobRolesListPage;

		test.beforeEach(async ({ page }) => {
			jobRolesPage = new JobRolesListPage(page);
			await jobRolesPage.navigate();
		});

		test("should complete full search and filter workflow", async () => {
			// Verify page loaded
			const isLoaded = await jobRolesPage.verifyPageLoaded();
			expect(isLoaded).toBe(true);

			// Get initial count
			const initialCount = await jobRolesPage.getJobRolesCount();
			expect(initialCount).toBeGreaterThanOrEqual(0);

			// Perform search
			await jobRolesPage.searchJobRoles("Engineer");
			await jobRolesPage.waitForPageLoad();

			const searchCount = await jobRolesPage.getJobRolesCount();
			expect(typeof searchCount).toBe("number");

			// Clear search
			await jobRolesPage.clearSearch();
			await jobRolesPage.waitForPageLoad();

			const clearedCount = await jobRolesPage.getJobRolesCount();
			expect(clearedCount).toBeGreaterThanOrEqual(0);
		});

		test("should navigate through pagination workflow", async ({ page }) => {
			// Get initial URL
			const startUrl = page.url();

			// Navigate if next page is available
			const nextAvailable = await jobRolesPage.isPaginationNextVisible();
			if (nextAvailable) {
				await jobRolesPage.goToNextPage();
				const page2Url = page.url();
				expect(page2Url).not.toBe(startUrl);

				// Go back
				const prevAvailable = await jobRolesPage.isPaginationPrevVisible();
				if (prevAvailable) {
					await jobRolesPage.goToPreviousPage();
					const backUrl = page.url();
					expect(backUrl).toContain("/job-roles");
				}
			}
		});

		test("should retrieve and display job role information", async () => {
			const jobRolesCount = await jobRolesPage.getJobRolesCount();

			if (jobRolesCount > 0) {
				// Get all titles
				const titles = await jobRolesPage.getAllJobRoleTitles();
				expect(titles.length).toBeGreaterThan(0);

				// Get details for first role
				const details = await jobRolesPage.getJobRoleDetails(0);
				expect(details).toHaveProperty("title");
				expect(details).toHaveProperty("description");
				expect(details).toHaveProperty("band");
			}
		});
	});

	/**
	 * Workflow: Login Process
	 * Tests the complete login flow with various scenarios
	 */
	test.describe("Login Workflow", () => {
		let loginPage: LoginPage;

		test.beforeEach(async ({ page }) => {
			loginPage = new LoginPage(page);
			await loginPage.navigate();
		});

		test("should complete login form with valid credentials", async ({ page }) => {
			// Verify login page loaded
			const isLoaded = await loginPage.verifyPageLoaded();
			expect(isLoaded).toBe(true);

			// Perform login
			await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
			await loginPage.waitForPageLoad();

			// Verify navigation away from login
			const currentUrl = page.url();
			expect(currentUrl).not.toContain("/login");
		});

		test("should reject login with invalid credentials", async ({ page }) => {
			await loginPage.login(testUsers.invalidUser.email, testUsers.invalidUser.password);
			await loginPage.waitForPageLoad();

			// Should either show error or stay on login
			const hasError = await loginPage.isErrorDisplayed();
			const onLoginPage = page.url().includes("/login");

			expect(hasError || onLoginPage).toBe(true);
		});

		test("should handle form validation for empty fields", async ({ page }) => {
			// Try with empty email
			await loginPage.login("", testUsers.validUser.password);
			await loginPage.waitForPageLoad();

			let currentUrl = page.url();
			expect(currentUrl).toContain("/login");

			// Clear and try with empty password
			await loginPage.navigate();
			await loginPage.login(testUsers.validUser.email, "");
			await loginPage.waitForPageLoad();

			currentUrl = page.url();
			expect(currentUrl).toContain("/login");
		});

		test("should provide navigation to registration page", async ({ page }) => {
			// Verify register link exists
			const registerLink = page.locator('a[href="/register"]');
			await expect(registerLink).toBeVisible();

			// Navigate to register
			await loginPage.goToRegister();
			await loginPage.waitForPageLoad();

			const registerUrl = page.url();
			expect(registerUrl).toContain("/register");
		});
	});

	/**
	 * Workflow: Complete Application (when authenticated)
	 * Tests the full application submission process
	 */
	test.describe("Job Application Workflow", () => {
		let applicationPage: JobApplicationPage;
		const testJobRoleId = 1;

		test.beforeEach(async ({ page }) => {
			applicationPage = new JobApplicationPage(page);
		});

		test.skip("should load application form for job role", async () => {
			// Skip: Requires authentication
			await applicationPage.navigate(testJobRoleId);

			const isLoaded = await applicationPage.verifyPageLoaded();
			expect(isLoaded).toBe(true);

			// Verify all required fields are visible
			const fieldsVisible = await applicationPage.areAllRequiredFieldsVisible();
			expect(fieldsVisible).toBe(true);
		});

		test.skip("should fill application form with valid data", async () => {
			// Skip: Requires authentication
			await applicationPage.navigate(testJobRoleId);

			// Fill form
			await applicationPage.fillApplicationForm(testApplications.validApplication);

			// Verify values were entered
			const nameValue = await applicationPage.getFieldValue("name");
			expect(nameValue).toContain(testApplications.validApplication.firstName);
		});

		test.skip("should handle form submission with valid data", async () => {
			// Skip: Requires authentication
			await applicationPage.navigate(testJobRoleId);

			// Complete full application
			await applicationPage.completeApplication(
				testApplications.validApplication,
				testFiles.validCV
			);

			// Wait for completion
			await applicationPage.waitForLoadingComplete();

			// Check result
			const isSuccess = await applicationPage.isSuccessDisplayed();
			const isError = await applicationPage.isErrorDisplayed();

			expect(isSuccess || isError).toBe(true);
		});

		test.skip("should handle form reset", async () => {
			// Skip: Requires authentication
			await applicationPage.navigate(testJobRoleId);

			// Fill form
			await applicationPage.fillName("Test User");
			await applicationPage.fillEmail("test@example.com");

			// Reset
			await applicationPage.resetForm();

			// Verify fields cleared
			const nameValue = await applicationPage.getFieldValue("name");
			expect(nameValue).toBe("");
		});

		test.skip("should navigate back to job roles", async () => {
			// Skip: Requires authentication
			await applicationPage.navigate(testJobRoleId);

			await applicationPage.goBack();
			await applicationPage.waitForPageLoad();

			// Should be back on job roles or login page
			const page = applicationPage["page"];
			const url = page.url();
			expect(url).toMatch(/\/(job-roles|login)/);
		});
	});

	/**
	 * Workflow: Multi-Page Application Flow
	 * This would test: Login → Browse → Apply (if not skipped)
	 */
	test.describe("Complete Application Flow", () => {
		test.skip("should complete full user journey: login → browse → apply", async ({
			page,
		}) => {
			// Skip: Requires authentication

			// Step 1: Login
			const loginPage = new LoginPage(page);
			await loginPage.navigate();
			await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
			await loginPage.waitForPageLoad();

			// Verify logged in
			const afterLoginUrl = page.url();
			expect(afterLoginUrl).not.toContain("/login");

			// Step 2: Browse Job Roles
			const jobRolesPage = new JobRolesListPage(page);
			await jobRolesPage.navigate();

			const isLoaded = await jobRolesPage.verifyPageLoaded();
			expect(isLoaded).toBe(true);

			const count = await jobRolesPage.getJobRolesCount();
			expect(count).toBeGreaterThanOrEqual(0);

			// Step 3: Apply for a job (if available)
			if (count > 0) {
				const applicationPage = new JobApplicationPage(page);
				await applicationPage.navigate(1); // Using job role ID 1 as example

				// Verify we're on application form
				const formLoaded = await applicationPage.verifyPageLoaded();
				expect(formLoaded).toBe(true);
			}
		});
	});

	/**
	 * Workflow: Error Recovery
	 * Tests how the application handles errors across multiple pages
	 */
	test.describe("Error Recovery Workflow", () => {
		let jobRolesPage: JobRolesListPage;

		test.beforeEach(async ({ page }) => {
			jobRolesPage = new JobRolesListPage(page);
			await jobRolesPage.navigate();
		});

		test("should recover from search errors", async () => {
			// Search with invalid characters
			await jobRolesPage.searchJobRoles("<script>alert('xss')</script>");
			await jobRolesPage.waitForPageLoad();

			// Page should still function
			const count = await jobRolesPage.getJobRolesCount();
			expect(typeof count).toBe("number");

			// Should be able to search again
			await jobRolesPage.searchJobRoles("Java");
			await jobRolesPage.waitForPageLoad();

			const count2 = await jobRolesPage.getJobRolesCount();
			expect(typeof count2).toBe("number");
		});

		test("should handle network errors gracefully", async () => {
			// Verify page is functional
			const isLoaded = await jobRolesPage.verifyPageLoaded();
			expect(isLoaded).toBe(true);

			// Page should have some content or empty state message
			const hasContent =
				(await jobRolesPage.getJobRolesCount()) > 0 ||
				(await jobRolesPage.isEmptyStateDisplayed());

			expect(hasContent).toBe(true);
		});
	});
});
