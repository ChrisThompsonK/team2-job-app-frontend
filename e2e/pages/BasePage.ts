import type { Page, Locator } from "@playwright/test";

/**
 * Base Page Object class
 * All page objects should extend this class
 */
export class BasePage {
	protected page: Page;
	protected baseURL: string;

	constructor(page: Page) {
		this.page = page;
		this.baseURL = "http://localhost:3000";
	}

	/**
	 * Navigate to a specific path
	 */
	async goto(path: string = ""): Promise<void> {
		await this.page.goto(`${this.baseURL}${path}`);
	}

	/**
	 * Wait for page to load
	 */
	async waitForPageLoad(): Promise<void> {
		await this.page.waitForLoadState("domcontentloaded");
	}

	/**
	 * Get page title
	 */
	async getTitle(): Promise<string> {
		return await this.page.title();
	}

	/**
	 * Take a screenshot
	 */
	async takeScreenshot(name: string): Promise<void> {
		await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
	}

	/**
	 * Wait for an element to be visible
	 */
	async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
		await locator.waitFor({ state: "visible", timeout });
	}

	/**
	 * Fill form field
	 */
	async fillField(locator: Locator, value: string): Promise<void> {
		await locator.fill(value);
	}

	/**
	 * Click element
	 */
	async clickElement(locator: Locator): Promise<void> {
		await locator.click();
	}

	/**
	 * Get text content
	 */
	async getTextContent(locator: Locator): Promise<string | null> {
		return await locator.textContent();
	}

	/**
	 * Check if element is visible
	 */
	async isVisible(locator: Locator): Promise<boolean> {
		return await locator.isVisible();
	}

	/**
	 * Select option from dropdown
	 */
	async selectOption(locator: Locator, value: string): Promise<void> {
		await locator.selectOption(value);
	}

	/**
	 * Upload file
	 */
	async uploadFile(locator: Locator, filePath: string): Promise<void> {
		await locator.setInputFiles(filePath);
	}
}
