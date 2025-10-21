/**
 * Tests for URL Builder Utility
 */

import type { JobRoleSearchParams } from "../models/job-role-search-params.js";
import {
	buildPaginationUrl,
	buildPaginationUrls,
	buildSearchQueryString,
} from "./url-builder.js";

describe("URL Builder Utility", () => {
	describe("buildSearchQueryString", () => {
		it("should return empty string when searchParams is null", () => {
			const result = buildSearchQueryString(null);
			expect(result).toBe("");
		});

		it("should return empty string when searchParams is empty object", () => {
			const result = buildSearchQueryString({});
			expect(result).toBe("");
		});

		it("should build query string with single search parameter", () => {
			const params: Partial<JobRoleSearchParams> = {
				search: "Software Engineer",
			};
			const result = buildSearchQueryString(params);
			expect(result).toBe("&search=Software%20Engineer");
		});

		it("should build query string with all parameters", () => {
			const params: Partial<JobRoleSearchParams> = {
				search: "Engineer",
				capability: "Engineering",
				location: "Belfast",
				band: "Senior",
				status: "Open",
			};
			const result = buildSearchQueryString(params);
			expect(result).toContain("search=Engineer");
			expect(result).toContain("capability=Engineering");
			expect(result).toContain("location=Belfast");
			expect(result).toContain("band=Senior");
			expect(result).toContain("status=Open");
			expect(result.charAt(0)).toBe("&");
		});

		it("should properly encode special characters", () => {
			const params: Partial<JobRoleSearchParams> = {
				search: "C++ Developer & Tester",
				location: "San Francisco, CA",
			};
			const result = buildSearchQueryString(params);
			expect(result).toBe(
				"&search=C%2B%2B%20Developer%20%26%20Tester&location=San%20Francisco%2C%20CA"
			);
		});

		it("should handle parameters with leading/trailing whitespace", () => {
			const params: Partial<JobRoleSearchParams> = {
				search: "  Software Engineer  ",
				capability: " Engineering ",
			};
			const result = buildSearchQueryString(params);
			expect(result).toBe("&search=Software%20Engineer&capability=Engineering");
		});

		it("should ignore empty string parameters", () => {
			const params: Partial<JobRoleSearchParams> = {
				search: "Engineer",
				capability: "",
				location: "   ",
				band: "Senior",
			};
			const result = buildSearchQueryString(params);
			expect(result).toBe("&search=Engineer&band=Senior");
		});

		it("should handle URL-unsafe characters correctly", () => {
			const params: Partial<JobRoleSearchParams> = {
				search: "?&=#+%!<>\\|{}[]^`",
			};
			const result = buildSearchQueryString(params);
			// encodeURIComponent should properly encode all these characters
			expect(result).toContain("search=");
			expect(decodeURIComponent(result)).toContain("?&=#+%!<>\\|{}[]^`");
		});

		it("should handle unicode characters", () => {
			const params: Partial<JobRoleSearchParams> = {
				search: "Développeur",
				location: "Москва",
			};
			const result = buildSearchQueryString(params);
			expect(result).toContain("search=D%C3%A9veloppeur");
			expect(result).toContain("location=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0");
		});
	});

	describe("buildPaginationUrl", () => {
		it("should build URL with page and limit only", () => {
			const result = buildPaginationUrl("/job-roles", 2, 10);
			expect(result).toBe("/job-roles?page=2&limit=10");
		});

		it("should build URL with page, limit, and search parameters", () => {
			const params: Partial<JobRoleSearchParams> = {
				search: "Engineer",
				capability: "Engineering",
			};
			const result = buildPaginationUrl("/job-roles", 3, 20, params);
			expect(result).toBe(
				"/job-roles?page=3&limit=20&search=Engineer&capability=Engineering"
			);
		});

		it("should handle null searchParams", () => {
			const result = buildPaginationUrl("/job-roles", 1, 10, null);
			expect(result).toBe("/job-roles?page=1&limit=10");
		});

		it("should handle undefined searchParams", () => {
			const result = buildPaginationUrl("/job-roles", 1, 10, undefined);
			expect(result).toBe("/job-roles?page=1&limit=10");
		});

		it("should work with search endpoint base URL", () => {
			const params: Partial<JobRoleSearchParams> = {
				search: "Developer",
			};
			const result = buildPaginationUrl("/jobs/search", 1, 10, params);
			expect(result).toBe("/jobs/search?page=1&limit=10&search=Developer");
		});

		it("should properly encode search parameters in URL", () => {
			const params: Partial<JobRoleSearchParams> = {
				search: "C++ & Java",
			};
			const result = buildPaginationUrl("/job-roles", 1, 10, params);
			expect(result).toBe(
				"/job-roles?page=1&limit=10&search=C%2B%2B%20%26%20Java"
			);
		});
	});

	describe("buildPaginationUrls", () => {
		it("should build all pagination URLs for a small page set", () => {
			const params: Partial<JobRoleSearchParams> = {
				search: "Engineer",
			};
			const result = buildPaginationUrls("/job-roles", 2, 5, 10, params);

			expect(result.first).toBe("/job-roles?page=1&limit=10&search=Engineer");
			expect(result.previous).toBe(
				"/job-roles?page=1&limit=10&search=Engineer"
			);
			expect(result.next).toBe("/job-roles?page=3&limit=10&search=Engineer");
			expect(result.last).toBe("/job-roles?page=5&limit=10&search=Engineer");
			expect(result.pages).toHaveLength(5);
		});

		it("should have null previous on first page", () => {
			const result = buildPaginationUrls("/job-roles", 1, 5, 10);

			expect(result.previous).toBeNull();
			expect(result.next).toBe("/job-roles?page=2&limit=10");
		});

		it("should have null next on last page", () => {
			const result = buildPaginationUrls("/job-roles", 5, 5, 10);

			expect(result.previous).toBe("/job-roles?page=4&limit=10");
			expect(result.next).toBeNull();
		});

		it("should mark current page correctly", () => {
			const result = buildPaginationUrls("/job-roles", 3, 5, 10);

			const currentPage = result.pages.find((p) => p.page === 3);
			expect(currentPage?.isCurrent).toBe(true);

			const otherPages = result.pages.filter((p) => p.page !== 3);
			otherPages.forEach((p) => {
				expect(p.isCurrent).toBe(false);
			});
		});

		it("should limit visible pages to 5 when at the beginning of large page set", () => {
			const result = buildPaginationUrls("/job-roles", 2, 20, 10);

			expect(result.pages).toHaveLength(5);
			expect(result.pages[0]?.page).toBe(1);
			expect(result.pages[4]?.page).toBe(5);
		});

		it("should limit visible pages to 5 when at the end of large page set", () => {
			const result = buildPaginationUrls("/job-roles", 19, 20, 10);

			expect(result.pages).toHaveLength(5);
			expect(result.pages[0]?.page).toBe(16);
			expect(result.pages[4]?.page).toBe(20);
		});

		it("should show middle pages when in the middle of large page set", () => {
			const result = buildPaginationUrls("/job-roles", 10, 20, 10);

			expect(result.pages).toHaveLength(5);
			expect(result.pages[0]?.page).toBe(8); // currentPage - 2
			expect(result.pages[2]?.page).toBe(10); // currentPage
			expect(result.pages[4]?.page).toBe(12); // currentPage + 2
		});

		it("should handle single page scenario", () => {
			const result = buildPaginationUrls("/job-roles", 1, 1, 10);

			expect(result.pages).toHaveLength(1);
			expect(result.previous).toBeNull();
			expect(result.next).toBeNull();
			expect(result.pages[0]?.isCurrent).toBe(true);
		});

		it("should properly encode search parameters in all URLs", () => {
			const params: Partial<JobRoleSearchParams> = {
				search: "C++",
				location: "Belfast & Dublin",
			};
			const result = buildPaginationUrls("/job-roles", 2, 3, 10, params);

			expect(result.first).toContain("search=C%2B%2B");
			expect(result.first).toContain("location=Belfast%20%26%20Dublin");
			expect(result.next).toContain("search=C%2B%2B");
			expect(result.last).toContain("location=Belfast%20%26%20Dublin");

			result.pages.forEach((page) => {
				expect(page.url).toContain("search=C%2B%2B");
				expect(page.url).toContain("location=Belfast%20%26%20Dublin");
			});
		});

		it("should work without search parameters", () => {
			const result = buildPaginationUrls("/job-roles", 2, 5, 10, null);

			expect(result.first).toBe("/job-roles?page=1&limit=10");
			expect(result.previous).toBe("/job-roles?page=1&limit=10");
			expect(result.next).toBe("/job-roles?page=3&limit=10");
			expect(result.pages).toHaveLength(5);
		});
	});
});
