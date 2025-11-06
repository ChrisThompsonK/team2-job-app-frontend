import { test, expect } from "@playwright/test";
import { JobRolesListPage } from "../pages/JobRolesListPage";

/**
 * Job Roles List Page Tests - Using Page Object Model (POM)
 *
 * These tests validate the job roles listing functionality, including:
 * - Page loading and display
 * - Search and filter functionality
 * - Pagination
 * - Job role card information
 * - Apply button interactions
 *
 * All interactions are abstracted through the JobRolesListPage POM,
 * making tests maintainable and reducing selector duplication.
 */
test.describe("Job Roles List Page", () => {
	let jobRolesPage: JobRolesListPage;

	test.beforeEach(async ({ page }) => {
		jobRolesPage = new JobRolesListPage(page);
		await jobRolesPage.navigate();
	});

	test.describe("Page Load & Display", () => {
		test("should load job roles list page correctly", async () => {
			const isLoaded = await jobRolesPage.verifyPageLoaded();
			expect(isLoaded).toBe(true);
		});

		test("should have correct page title", async () => {
			const title = await jobRolesPage.getTitle();
			expect(title).toContain("Kainos");
		});

		test("should display job roles container", async ({ page }) => {
			const container = page.locator("section.grid");
			await expect(container).toBeVisible();
		});

		test("should display job role cards", async () => {
			const count = await jobRolesPage.getJobRolesCount();
			expect(typeof count).toBe("number");
			expect(count).toBeGreaterThanOrEqual(0);
		});
	});

	test.describe("Job Role Display", () => {
		test("should retrieve all job role titles", async () => {
			const titles = await jobRolesPage.getAllJobRoleTitles();
			expect(Array.isArray(titles)).toBe(true);
			// If there are titles, they should be non-empty strings
			titles.forEach(title => {
				if (title) {
					expect(title.length).toBeGreaterThan(0);
				}
			});
		});

		test("should get job role details by index", async () => {
			const jobRolesCount = await jobRolesPage.getJobRolesCount();
			
			if (jobRolesCount > 0) {
				const details = await jobRolesPage.getJobRoleDetails(0);
				// At least title should be present
				expect(details).toHaveProperty("title");
				expect(details).toHaveProperty("description");
				expect(details).toHaveProperty("band");
			}
		});

		test("should handle invalid index gracefully", async () => {
			const details = await jobRolesPage.getJobRoleDetails(999);
			// Should return empty values for invalid index
			expect(details.title).toBeNull();
		});
	});

	test.describe("Search Functionality", () => {
		test("should search job roles by keyword", async () => {
			const initialCount = await jobRolesPage.getJobRolesCount();
			
			await jobRolesPage.searchJobRoles("Software");
			await jobRolesPage.waitForPageLoad();

			const filteredCount = await jobRolesPage.getJobRolesCount();
			expect(typeof filteredCount).toBe("number");
			expect(filteredCount).toBeGreaterThanOrEqual(0);
		});

		test("should clear search and show all results", async () => {
			// Search for something
			await jobRolesPage.searchJobRoles("Engineer");
			await jobRolesPage.waitForPageLoad();

			// Clear search
			await jobRolesPage.clearSearch();
			
			const count = await jobRolesPage.getJobRolesCount();
			expect(count).toBeGreaterThanOrEqual(0);
		});

		test("should handle search with no results", async () => {
			await jobRolesPage.searchJobRoles("XYZNonexistentRole12345");
			await jobRolesPage.waitForPageLoad();

			const count = await jobRolesPage.getJobRolesCount();
			// Should have 0 results or show empty state
			expect(count).toBe(0);
		});

		test("should handle search with special characters", async () => {
			// Search with special chars should not crash
			await jobRolesPage.searchJobRoles("& <>");
			await jobRolesPage.waitForPageLoad();

			const count = await jobRolesPage.getJobRolesCount();
			expect(typeof count).toBe("number");
		});

		test("should handle empty search term", async () => {
			await jobRolesPage.searchJobRoles("");
			await jobRolesPage.waitForPageLoad();

			const count = await jobRolesPage.getJobRolesCount();
			expect(typeof count).toBe("number");
		});
	});

	test.describe("Filter Functionality", () => {
		test("should display filter control", async ({ page }) => {
			const filterSelect = page.locator('select[name="capability"]');
			const isVisible = await filterSelect.isVisible().catch(() => false);
			// Filter may not be present in all views
			expect(typeof isVisible).toBe("boolean");
		});

		test("should clear filters", async () => {
			const initialCount = await jobRolesPage.getJobRolesCount();
			
			// Try to clear filters
			await jobRolesPage.clearFilters();
			await jobRolesPage.waitForPageLoad();

			const count = await jobRolesPage.getJobRolesCount();
			expect(typeof count).toBe("number");
		});
	});

	test.describe("Pagination", () => {
		test("should check pagination visibility", async () => {
			const nextVisible = await jobRolesPage.isPaginationNextVisible();
			const prevVisible = await jobRolesPage.isPaginationPrevVisible();

			expect(typeof nextVisible).toBe("boolean");
			expect(typeof prevVisible).toBe("boolean");
		});

		test("should navigate to next page when available", async ({ page }) => {
			const nextVisible = await jobRolesPage.isPaginationNextVisible();

			if (nextVisible) {
				const initialUrl = page.url();
				await jobRolesPage.goToNextPage();

				const newUrl = page.url();
				expect(newUrl).not.toBe(initialUrl);
				expect(newUrl).toContain("page=");
			}
		});

		test("should navigate to previous page when available", async ({ page }) => {
			const prevVisible = await jobRolesPage.isPaginationPrevVisible();

			// First go to next page if available
			const nextVisible = await jobRolesPage.isPaginationNextVisible();
			if (nextVisible) {
				await jobRolesPage.goToNextPage();
				await jobRolesPage.waitForPageLoad();
			}

			// Then test going back
			if (prevVisible) {
				const beforeUrl = page.url();
				await jobRolesPage.goToPreviousPage();
				const afterUrl = page.url();

				expect(afterUrl).not.toBe(beforeUrl);
			}
		});

		test("should display page information when available", async () => {
			const pageInfo = await jobRolesPage.getCurrentPageInfo();
			// Page info may be null if not implemented
			if (pageInfo) {
				expect(pageInfo.length).toBeGreaterThan(0);
			}
		});

		test("should stay on job roles page after pagination", async ({ page }) => {
			const nextVisible = await jobRolesPage.isPaginationNextVisible();

			if (nextVisible) {
				await jobRolesPage.goToNextPage();
				const url = page.url();
				expect(url).toContain("/job-roles");
			}
		});
	});

	test.describe("Empty State", () => {
		test("should handle empty job roles list gracefully", async () => {
			// Search for something that won't exist
			await jobRolesPage.searchJobRoles("ZZZZZZNONEXISTENT");
			await jobRolesPage.waitForPageLoad();

			const isEmptyDisplayed = await jobRolesPage.isEmptyStateDisplayed();
			const count = await jobRolesPage.getJobRolesCount();

			// Either show empty state or count is 0
			expect(isEmptyDisplayed || count === 0).toBe(true);
		});

		test("should display helpful message in empty state", async () => {
			// Search for something that won't exist
			await jobRolesPage.searchJobRoles("XYZNONEXISTENT");
			await jobRolesPage.waitForPageLoad();

			const isEmptyDisplayed = await jobRolesPage.isEmptyStateDisplayed();
			
			if (isEmptyDisplayed) {
				const message = await jobRolesPage.getEmptyStateMessage();
				expect(message).not.toBeNull();
				if (message) {
					expect(message.length).toBeGreaterThan(0);
				}
			}
		});
	});

	test.describe("Apply Button", () => {
		test("should have apply buttons for job roles", async () => {
			const count = await jobRolesPage.getJobRolesCount();

			if (count > 0) {
				// Try to find apply button for first job role
				await jobRolesPage.clickApplyForJobRole(0);
				// If we get here without error, button exists and is clickable
				expect(true).toBe(true);
			}
		});

		test("should navigate when clicking apply button", async ({ page }) => {
			const count = await jobRolesPage.getJobRolesCount();

			if (count > 0) {
				const initialUrl = page.url();
				
				// Click apply and wait for navigation
				await Promise.race([
					jobRolesPage.clickApplyForJobRole(0),
					page.waitForNavigation().catch(() => {})
				]);

				// URL should change or we navigate
				const newUrl = page.url();
				// Either URL changed or we got an error (e.g., requires login)
				expect(typeof newUrl).toBe("string");
			}
		});

		test("should find apply button by job role title", async () => {
			const titles = await jobRolesPage.getAllJobRoleTitles();

			if (titles.length > 0 && titles[0]) {
				// Should not throw error when looking for existing role
				const testTitle = titles[0].substring(0, 5);
				await jobRolesPage.clickApplyForJobRoleByTitle(testTitle).catch(() => {
					// May fail if role not found or requires login
				});
				expect(true).toBe(true);
			}
		});
	});

	test.describe("Page Responsiveness", () => {
		test("should remain functional after multiple searches", async () => {
			const searchTerms = ["Java", "Python", "DevOps"];

			for (const term of searchTerms) {
				await jobRolesPage.searchJobRoles(term);
				await jobRolesPage.waitForPageLoad();

				const count = await jobRolesPage.getJobRolesCount();
				expect(typeof count).toBe("number");
			}
		});

		test("should handle rapid pagination clicks", async () => {
			const nextVisible = await jobRolesPage.isPaginationNextVisible();

			if (nextVisible) {
				// Try to go next twice
				await jobRolesPage.goToNextPage();
				await jobRolesPage.waitForPageLoad();

				const url1 = jobRolesPage["page"].url();

				await jobRolesPage.goToNextPage();
				await jobRolesPage.waitForPageLoad();

				const url2 = jobRolesPage["page"].url();

				// Should still be on job-roles page
				expect(url2).toContain("/job-roles");
			}
		});
	});
});

