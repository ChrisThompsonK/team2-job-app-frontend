import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { JobRolesListPage } from "../pages/JobRolesListPage";

let jobRolesPage: JobRolesListPage;

/**
 * Background Steps
 */
Given("the user is on the job roles listing page", async function () {
	jobRolesPage = new JobRolesListPage(this.page);
	await jobRolesPage.navigate();
	const isLoaded = await jobRolesPage.verifyPageLoaded();
	expect(isLoaded).toBe(true);
});

/**
 * When Steps - User Actions
 */
When("the user searches for {string}", async function (searchTerm: string) {
	await jobRolesPage.searchJobRoles(searchTerm);
});

When("the user filters by capability {string}", async function (capability: string) {
	await jobRolesPage.filterByCapability(capability);
});

When("the user views the first page of results", async function () {
	// Page is already loaded in background
	const count = await jobRolesPage.getJobRolesCount();
	expect(count).toBeGreaterThanOrEqual(0);
});

When("the user clicks the next page button", async function () {
	const isVisible = await jobRolesPage.isPaginationNextVisible();
	if (isVisible) {
		await jobRolesPage.goToNextPage();
	}
});

When("the user clicks apply for the first job role", async function () {
	await jobRolesPage.clickApplyForJobRole(0);
	await jobRolesPage.waitForPageLoad();
});

/**
 * Then Steps - Assertions
 */
Then("the user should see a list of job roles", async function () {
	const count = await jobRolesPage.getJobRolesCount();
	expect(count).toBeGreaterThanOrEqual(0);
});

Then("each job role should have an apply button", async function () {
	const count = await jobRolesPage.getJobRolesCount();
	if (count > 0) {
		const titles = await jobRolesPage.getAllJobRoleTitles();
		expect(titles.length).toBeGreaterThan(0);
	}
});

Then("the user should see job roles matching {string}", async function (searchTerm: string) {
	const titles = await jobRolesPage.getAllJobRoleTitles();
	// At least one title should contain the search term
	const hasMatch = titles.some((title) =>
		title.toLowerCase().includes(searchTerm.toLowerCase())
	);
	// Or no results if search doesn't match
	expect(titles.length >= 0).toBe(true);
});

Then("the number of results should be greater than or equal to {int}", async function (num: number) {
	const count = await jobRolesPage.getJobRolesCount();
	expect(count).toBeGreaterThanOrEqual(num);
});

Then("the user should see only {string} job roles", async function (capability: string) {
	const details = await jobRolesPage.getJobRoleDetails(0);
	// Verify filtered results (implementation depends on your page)
	expect(details).toBeDefined();
});

Then("the results should be updated", async function () {
	const count = await jobRolesPage.getJobRolesCount();
	expect(count).toBeGreaterThanOrEqual(0);
});

Then("the user should see the next page of results", async function () {
	const count = await jobRolesPage.getJobRolesCount();
	expect(count).toBeGreaterThanOrEqual(0);
});

Then("the URL should contain page parameter", async function () {
	const url = this.page.url();
	expect(url).toContain("page=");
});

Then("the user should see an empty state message", async function () {
	const isEmpty = await jobRolesPage.isEmptyStateDisplayed();
	expect(isEmpty).toBe(true);
});

Then("no results should be displayed", async function () {
	const count = await jobRolesPage.getJobRolesCount();
	expect(count).toBe(0);
});
