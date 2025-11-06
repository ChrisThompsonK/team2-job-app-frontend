import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { Browser, Page } from "@playwright/test";
import { chromium } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { testUsers } from "../fixtures/testData";

let browser: Browser;
let page: Page;
let loginPage: LoginPage;

/**
 * Hooks - Setup and teardown for each scenario
 */
Before(async function () {
	browser = await chromium.launch();
	page = await browser.newPage();
	loginPage = new LoginPage(page);
});

After(async function () {
	await browser.close();
});

/**
 * Background Steps
 */
Given("the user is on the login page", async function () {
	await loginPage.navigate();
	const isLoaded = await loginPage.verifyPageLoaded();
	expect(isLoaded).toBe(true);
});

/**
 * When Steps - User Actions
 */
When("the user enters email {string}", async function (email: string) {
	await loginPage.fillEmail(email);
});

When("the user enters password {string}", async function (password: string) {
	await loginPage.fillPassword(password);
});

When("the user clicks the login button", async function () {
	await loginPage.clickLoginButton();
	await loginPage.waitForPageLoad();
});

When("the user clicks the register link", async function () {
	await loginPage.goToRegister();
	await loginPage.waitForPageLoad();
});

/**
 * Then Steps - Assertions
 */
Then("the user should be logged in", async function () {
	const url = page.url();
	expect(url).not.toContain("/login");
});

Then("the user should not see the login page", async function () {
	const url = page.url();
	expect(url).not.toContain("/login");
});

Then("the user should see an error message", async function () {
	const hasError = await loginPage.isErrorDisplayed();
	expect(hasError).toBe(true);
});

Then("the user should remain on the login page", async function () {
	const url = page.url();
	expect(url).toContain("/login");
});

Then("the user should be navigated to the register page", async function () {
	const url = page.url();
	expect(url).toContain("/register");
});
