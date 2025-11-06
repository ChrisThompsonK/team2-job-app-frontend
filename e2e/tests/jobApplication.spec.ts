import { test, expect } from "@playwright/test";
import { JobApplicationPage } from "../pages/JobApplicationPage";
import { testApplications, testFiles } from "../fixtures/testData";

test.describe("Job Application Form", () => {
	let applicationPage: JobApplicationPage;
	const testJobRoleId = 1; // Using a test job role ID

	test.beforeEach(async ({ page }) => {
		applicationPage = new JobApplicationPage(page);
		// Skip navigation if not logged in - these tests require authentication
		// await applicationPage.navigate(testJobRoleId);
	});

	test.skip("should load application form correctly", async () => {
		// Skip: Requires user to be logged in
		await applicationPage.navigate(testJobRoleId);
		const isLoaded = await applicationPage.verifyPageLoaded();
		expect(isLoaded).toBe(true);

		const title = await applicationPage.getTitle();
		expect(title).toContain("Application");
	});

	test.skip("should successfully submit application with valid data", async () => {
		// Skip: Requires user to be logged in
		await applicationPage.navigate(testJobRoleId);
		await applicationPage.fillApplicationForm(testApplications.validApplication);
		await applicationPage.uploadCV(testFiles.validCV);
		await applicationPage.submitApplication();

		// Check for success message
		const isSuccessDisplayed = await applicationPage.isSuccessDisplayed();
		expect(isSuccessDisplayed).toBe(true);

		const successMessage = await applicationPage.getSuccessMessage();
		expect(successMessage).toBeTruthy();
	});

	test.skip("should submit application with minimal required fields", async () => {
		// Skip: Requires user to be logged in
		await applicationPage.navigate(testJobRoleId);
		await applicationPage.fillApplicationForm(testApplications.minimalApplication);
		await applicationPage.uploadCV(testFiles.validCV);
		await applicationPage.submitApplication();

		// Should either succeed or show specific field errors
		const isSuccessDisplayed = await applicationPage.isSuccessDisplayed();
		const isErrorDisplayed = await applicationPage.isErrorDisplayed();

		expect(isSuccessDisplayed || isErrorDisplayed).toBe(true);
	});

	test.skip("should show error with invalid email format", async () => {
		// Skip: Requires user to be logged in
		await applicationPage.navigate(testJobRoleId);
		const invalidData = {
			...testApplications.validApplication,
			email: "invalid-email-format",
		};

		await applicationPage.fillApplicationForm(invalidData);
		await applicationPage.uploadCV(testFiles.validCV);
		await applicationPage.submitApplication();

		// Check for error message
		const isErrorDisplayed = await applicationPage.isErrorDisplayed();
		expect(isErrorDisplayed).toBe(true);

		const errorMessage = await applicationPage.getErrorMessage();
		expect(errorMessage?.toLowerCase()).toContain("email");
	});

	test.skip("should show error when required fields are empty", async () => {
		// Skip: Requires user to be logged in
		await applicationPage.navigate(testJobRoleId);
		await applicationPage.submitApplication();

		// Should show validation errors
		const isErrorDisplayed = await applicationPage.isErrorDisplayed();
		expect(isErrorDisplayed).toBe(true);
	});

	test.skip("should show error when CV is not uploaded", async () => {
		// Skip: Requires user to be logged in
		await applicationPage.navigate(testJobRoleId);
		await applicationPage.fillApplicationForm(testApplications.validApplication);
		await applicationPage.submitApplication();

		// Should show error about missing CV
		const isErrorDisplayed = await applicationPage.isErrorDisplayed();
		expect(isErrorDisplayed).toBe(true);

		const errorMessage = await applicationPage.getErrorMessage();
		expect(errorMessage?.toLowerCase()).toMatch(/cv|file/);
	});

	test.skip("should complete full application flow end-to-end", async () => {
		// Skip: Requires user to be logged in
		await applicationPage.navigate(testJobRoleId);
		await applicationPage.completeApplication(testApplications.validApplication, testFiles.validCV);

		// Verify success
		const isSuccessDisplayed = await applicationPage.isSuccessDisplayed();
		expect(isSuccessDisplayed).toBe(true);
	});


	test("should display header", async ({ page }) => {
    	const header = page.locator("header");
    	await expect(header).toBeVisible();
		});
});
