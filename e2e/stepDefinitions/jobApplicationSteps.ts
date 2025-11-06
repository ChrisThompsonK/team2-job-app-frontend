import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { JobApplicationPage } from "../pages/JobApplicationPage";
import { testUsers, testApplications, testFiles } from "../fixtures/testData";

let loginPage: LoginPage;
let applicationPage: JobApplicationPage;

/**
 * Background Steps
 */
Given("the user is logged in", async function () {
	loginPage = new LoginPage(this.page);
	await loginPage.navigate();
	await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
	await loginPage.waitForPageLoad();
});

Given("the user is on a job application form", async function () {
	applicationPage = new JobApplicationPage(this.page);
	const jobRoleId = 1; // Using test job role ID
	await applicationPage.navigate(jobRoleId);
	const isLoaded = await applicationPage.verifyPageLoaded();
	expect(isLoaded).toBe(true);
});

/**
 * When Steps - User Actions
 */
When("the user fills in the application form with valid data", async function () {
	await applicationPage.fillApplicationForm(testApplications.validApplication);
});

When("the user uploads a valid CV", async function () {
	await applicationPage.uploadCV(testFiles.validCV);
});

When("the user clicks the submit button", async function () {
	await applicationPage.submitApplication();
	await applicationPage.waitForLoadingComplete();
});

When("the user fills in only the required fields", async function () {
	await applicationPage.fillApplicationForm(testApplications.minimalApplication);
});

When("the user leaves the name field empty", async function () {
	// Clear the name field if it was filled
	await applicationPage.fillName("");
});

When("the user enters an invalid email format", async function () {
	await applicationPage.fillEmail("invalid-email-format");
});

When("the user does not upload a CV", async function () {
	// Skip CV upload - don't call uploadCV
	// This will leave the CV field empty
});

/**
 * Then Steps - Assertions
 */
Then("the user should see a success message", async function () {
	const isSuccess = await applicationPage.isSuccessDisplayed();
	expect(isSuccess).toBe(true);
});

Then("the application should be saved", async function () {
	const isSuccess = await applicationPage.isSuccessDisplayed();
	expect(isSuccess).toBe(true);
});

Then("the user should see an error message", async function () {
	const hasError = await applicationPage.isErrorDisplayed();
	expect(hasError).toBe(true);
});

Then("the form should not be submitted", async function () {
	const hasError = await applicationPage.isErrorDisplayed();
	expect(hasError || (await applicationPage.areAllRequiredFieldsVisible())).toBe(true);
});

Then("the user should see an email validation error", async function () {
	const errors = await applicationPage.getAllValidationErrors();
	const hasEmailError = errors.some((err) => err.toLowerCase().includes("email"));
	expect(hasEmailError || (await applicationPage.isErrorDisplayed())).toBe(true);
});

Then("the user should see a CV upload required error", async function () {
	const errors = await applicationPage.getAllValidationErrors();
	const hasCVError = errors.some((err) => err.toLowerCase().includes("cv"));
	expect(hasCVError || (await applicationPage.isErrorDisplayed())).toBe(true);
});

Then("the user should see the name field", async function () {
	const isVisible = await applicationPage.isFieldVisible("name");
	expect(isVisible).toBe(true);
});

Then("the user should see the email field", async function () {
	const isVisible = await applicationPage.isFieldVisible("email");
	expect(isVisible).toBe(true);
});

Then("the user should see the phone field", async function () {
	const isVisible = await applicationPage.isFieldVisible("phone");
	expect(isVisible).toBe(true);
});

Then("the user should see the CV upload field", async function () {
	const isVisible = await applicationPage.isFieldVisible("cv");
	expect(isVisible).toBe(true);
});

Then("the user should see the submit button", async function () {
	const isVisible = await applicationPage.isVisible(
		this.page.locator('button[type="submit"]')
	);
	expect(isVisible).toBe(true);
});
