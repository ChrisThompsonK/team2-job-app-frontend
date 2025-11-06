import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Job Roles List Page Object
 * Handles interactions with the job roles listing page
 *
 * This page manages:
 * - Display of all available job roles
 * - Search and filtering functionality
 * - Pagination controls
 * - Apply button interactions
 */
export class JobRolesListPage extends BasePage {
	// Locators - Page Structure
	private readonly jobRolesContainer: Locator;
	private readonly jobRoleCards: Locator;

	// Locators - Search and Filter
	private readonly searchInput: Locator;
	private readonly filterSelect: Locator;
	private readonly clearFiltersButton: Locator;

	// Locators - Job Role Card Elements
	private readonly jobRoleTitle: Locator;
	private readonly jobRoleDescription: Locator;
	private readonly jobRoleBand: Locator;
	private readonly applyButtons: Locator;

	// Locators - Pagination
	private readonly paginationContainer: Locator;
	private readonly paginationNext: Locator;
	private readonly paginationPrev: Locator;
	private readonly pageInfo: Locator;

	// Locators - Empty State
	private readonly emptyStateMessage: Locator;

	constructor(page: Page) {
		super(page);
		// Main containers
		this.jobRolesContainer = page.locator("section.grid"); // Grid container for cards
		this.jobRoleCards = page.locator(".bg-white.rounded-2xl.shadow-md"); // Individual job role cards

		// Search and Filter
		this.searchInput = page.locator('input[name="search"]');
		this.filterSelect = page.locator('select[name="capability"]');
		this.clearFiltersButton = page.locator('button:has-text("Clear"), button[type="reset"]');

		// Card Elements (relative to each card)
		this.jobRoleTitle = page.locator(".bg-white.rounded-2xl h2, .bg-white.rounded-2xl h3"); // Title in card
		this.jobRoleDescription = page.locator(".bg-white.rounded-2xl p"); // Description in card
		this.jobRoleBand = page.locator(".badge, .label"); // Band/level badge
		this.applyButtons = page.locator('a[href*="/apply"], button:has-text("Apply")');

		// Pagination
		this.paginationContainer = page.locator("nav[aria-label*=pagination], div.pagination, .btn-group");
		this.paginationNext = page.locator(
			'a[aria-label="Next page"], button:has-text("Next"), a.btn-next'
		);
		this.paginationPrev = page.locator(
			'a[aria-label="Previous page"], button:has-text("Previous"), a.btn-prev'
		);
		this.pageInfo = page.locator("span:has-text(/page|of/i)");

		// Empty State
		this.emptyStateMessage = page.locator(".alert-info, .empty-state, .no-results");
	}

	/**
	 * Navigate to job roles list page
	 */
	async navigate(): Promise<void> {
		await this.goto("/job-roles");
		await this.waitForPageLoad();
	}

	/**
	 * Get all job roles displayed
	 */
	async getJobRolesCount(): Promise<number> {
		return await this.jobRoleCards.count();
	}

	/**
	 * Get all job role titles as an array
	 */
	async getAllJobRoleTitles(): Promise<string[]> {
		const cards = await this.jobRoleCards.all();
		const titles: string[] = [];

		for (const card of cards) {
			const title = await card.locator("h2, h3").textContent();
			if (title) {
				titles.push(title.trim());
			}
		}

		return titles;
	}

	/**
	 * Get job role details by index
	 */
	async getJobRoleDetails(index: number): Promise<{
		title: string | null;
		description: string | null;
		band: string | null;
	}> {
		const cards = await this.jobRoleCards.all();
		if (!cards[index]) {
			return { title: null, description: null, band: null };
		}

		const card = cards[index];
		return {
			title: await card.locator("h2, h3").textContent(),
			description: await card.locator("p").first().textContent(),
			band: await card.locator(".badge").textContent(),
		};
	}

	/**
	 * Search for job roles by keyword
	 */
	async searchJobRoles(searchTerm: string): Promise<void> {
		await this.fillField(this.searchInput, searchTerm);
		// Wait a moment for debounce, then press Enter
		await this.page.waitForTimeout(300);
		await this.page.keyboard.press("Enter");
		await this.waitForPageLoad();
	}

	/**
	 * Clear search input
	 */
	async clearSearch(): Promise<void> {
		await this.searchInput.clear();
		await this.page.keyboard.press("Enter");
		await this.waitForPageLoad();
	}

	/**
	 * Filter job roles by capability
	 */
	async filterByCapability(capability: string): Promise<void> {
		await this.selectOption(this.filterSelect, capability);
		await this.waitForPageLoad();
	}

	/**
	 * Clear all filters
	 */
	async clearFilters(): Promise<void> {
		const clearButton = await this.isVisible(this.clearFiltersButton);
		if (clearButton) {
			await this.clickElement(this.clearFiltersButton);
			await this.waitForPageLoad();
		}
	}

	/**
	 * Click apply button for a specific job role by index
	 */
	async clickApplyForJobRole(jobRoleIndex: number = 0): Promise<void> {
		const buttons = await this.applyButtons.all();
		if (buttons[jobRoleIndex]) {
			await buttons[jobRoleIndex].click();
		}
	}

	/**
	 * Click apply button for a job role by title (fuzzy match)
	 */
	async clickApplyForJobRoleByTitle(title: string): Promise<void> {
		const cards = await this.jobRoleCards.all();

		for (const card of cards) {
			const cardTitle = await card.locator("h2, h3").textContent();
			if (cardTitle?.toLowerCase().includes(title.toLowerCase())) {
				const applyBtn = card.locator('a[href*="/apply"], button:has-text("Apply")');
				await applyBtn.click();
				return;
			}
		}

		throw new Error(`Job role with title containing "${title}" not found`);
	}

	/**
	 * Check if pagination next button is visible
	 */
	async isPaginationNextVisible(): Promise<boolean> {
		return await this.isVisible(this.paginationNext);
	}

	/**
	 * Check if pagination previous button is visible
	 */
	async isPaginationPrevVisible(): Promise<boolean> {
		return await this.isVisible(this.paginationPrev);
	}

	/**
	 * Navigate to next page
	 */
	async goToNextPage(): Promise<void> {
		if (await this.isPaginationNextVisible()) {
			await this.clickElement(this.paginationNext);
			await this.waitForPageLoad();
		}
	}

	/**
	 * Navigate to previous page
	 */
	async goToPreviousPage(): Promise<void> {
		if (await this.isPaginationPrevVisible()) {
			await this.clickElement(this.paginationPrev);
			await this.waitForPageLoad();
		}
	}

	/**
	 * Get current page info
	 */
	async getCurrentPageInfo(): Promise<string | null> {
		return await this.getTextContent(this.pageInfo);
	}

	/**
	 * Check if empty state is displayed
	 */
	async isEmptyStateDisplayed(): Promise<boolean> {
		return await this.isVisible(this.emptyStateMessage);
	}

	/**
	 * Get empty state message
	 */
	async getEmptyStateMessage(): Promise<string | null> {
		const isVisible = await this.isEmptyStateDisplayed();
		if (isVisible) {
			return await this.getTextContent(this.emptyStateMessage);
		}
		return null;
	}

	/**
	 * Verify job roles list loaded
	 */
	async verifyPageLoaded(): Promise<boolean> {
		await this.waitForElement(this.jobRolesContainer);
		return true;
	}
}
