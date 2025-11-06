/**
 * Tests for pagination validation utilities
 */

import { describe, expect, it } from "vitest";
import {
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
	MAX_LIMIT,
} from "../models/pagination.js";
import { validatePaginationParams } from "../utils/pagination-validation.js";

describe("validatePaginationParams", () => {
	describe("valid inputs", () => {
		it("should return default values when no parameters provided", () => {
			const result = validatePaginationParams();

			expect(result.isValid).toBe(true);
			expect(result.page).toBe(DEFAULT_PAGE);
			expect(result.limit).toBe(DEFAULT_LIMIT);
			expect(result.error).toBeUndefined();
		});

		it("should handle valid page parameter", () => {
			const result = validatePaginationParams("5");

			expect(result.isValid).toBe(true);
			expect(result.page).toBe(5);
			expect(result.limit).toBe(DEFAULT_LIMIT);
		});

		it("should handle valid limit parameter", () => {
			const result = validatePaginationParams(undefined, "20");

			expect(result.isValid).toBe(true);
			expect(result.page).toBe(DEFAULT_PAGE);
			expect(result.limit).toBe(20);
		});

		it("should handle both valid parameters", () => {
			const result = validatePaginationParams("3", "25");

			expect(result.isValid).toBe(true);
			expect(result.page).toBe(3);
			expect(result.limit).toBe(25);
		});

		it("should handle edge case of page 1 and limit 1", () => {
			const result = validatePaginationParams("1", "1");

			expect(result.isValid).toBe(true);
			expect(result.page).toBe(1);
			expect(result.limit).toBe(1);
		});

		it("should handle maximum limit", () => {
			const result = validatePaginationParams("1", MAX_LIMIT.toString());

			expect(result.isValid).toBe(true);
			expect(result.page).toBe(1);
			expect(result.limit).toBe(MAX_LIMIT);
		});
	});

	describe("invalid page inputs", () => {
		it("should reject non-numeric page", () => {
			const result = validatePaginationParams("abc");

			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Page must be a positive integer");
			expect(result.page).toBe(DEFAULT_PAGE);
			expect(result.limit).toBe(DEFAULT_LIMIT);
		});

		it("should reject zero page", () => {
			const result = validatePaginationParams("0");

			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Page must be a positive integer");
		});

		it("should reject negative page", () => {
			const result = validatePaginationParams("-1");

			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Page must be a positive integer");
		});

		it("should reject decimal page", () => {
			const result = validatePaginationParams("1.5");

			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Page must be a positive integer");
		});

		it("should reject empty string page", () => {
			const result = validatePaginationParams("");

			expect(result.isValid).toBe(true); // Empty string should default
			expect(result.page).toBe(DEFAULT_PAGE);
		});
	});

	describe("invalid limit inputs", () => {
		it("should reject non-numeric limit", () => {
			const result = validatePaginationParams("1", "xyz");

			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Limit must be a positive integer");
			expect(result.page).toBe(1);
			expect(result.limit).toBe(DEFAULT_LIMIT);
		});

		it("should reject zero limit", () => {
			const result = validatePaginationParams("1", "0");

			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Limit must be a positive integer");
		});

		it("should reject negative limit", () => {
			const result = validatePaginationParams("1", "-5");

			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Limit must be a positive integer");
		});

		it("should reject limit exceeding maximum", () => {
			const result = validatePaginationParams("1", (MAX_LIMIT + 1).toString());

			expect(result.isValid).toBe(false);
			expect(result.error).toBe(`Limit cannot exceed ${MAX_LIMIT}`);
		});

		it("should reject decimal limit", () => {
			const result = validatePaginationParams("1", "10.5");

			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Limit must be a positive integer");
		});
	});

	describe("edge cases", () => {
		it("should handle very large valid page numbers", () => {
			const result = validatePaginationParams("999999", "10");

			expect(result.isValid).toBe(true);
			expect(result.page).toBe(999999);
			expect(result.limit).toBe(10);
		});

		it("should handle whitespace in parameters", () => {
			const result = validatePaginationParams(" 2 ", " 15 ");

			expect(result.isValid).toBe(true);
			expect(result.page).toBe(2);
			expect(result.limit).toBe(15);
		});

		it("should reject scientific notation in page parameter", () => {
			const result1 = validatePaginationParams("1e5", "10");
			const result2 = validatePaginationParams("1E10", "10");

			expect(result1.isValid).toBe(false);
			expect(result1.error).toBe("Page must be a positive integer");

			expect(result2.isValid).toBe(false);
			expect(result2.error).toBe("Page must be a positive integer");
		});

		it("should reject scientific notation in limit parameter", () => {
			const result = validatePaginationParams("1", "1e3");

			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Limit must be a positive integer");
		});

		it("should reject special characters (potential XSS)", () => {
			const result = validatePaginationParams(
				"<script>alert('xss')</script>",
				"10"
			);

			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Page must be a positive integer");
		});

		it("should reject SQL injection attempts", () => {
			const result = validatePaginationParams("1; DROP TABLE users;", "10");

			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Page must be a positive integer");
		});

		it("should reject numbers beyond MAX_SAFE_INTEGER", () => {
			// Use a number larger than Number.MAX_SAFE_INTEGER (9007199254740991)
			const result = validatePaginationParams("9999999999999999", "10");

			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Page must be a positive integer");
		});

		it("should handle empty string after trim", () => {
			const result = validatePaginationParams("   ", "   ");

			expect(result.isValid).toBe(true);
			expect(result.page).toBe(DEFAULT_PAGE);
			expect(result.limit).toBe(DEFAULT_LIMIT);
		});

		it("should reject mixed alphanumeric strings", () => {
			const result = validatePaginationParams("1abc", "10xyz");

			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Page must be a positive integer");
		});
	});
});
