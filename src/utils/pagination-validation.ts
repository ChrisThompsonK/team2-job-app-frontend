/**
 * Pagination validation utilities
 */

import {
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
	MAX_LIMIT,
} from "../models/pagination.js";

/**
 * Validation result for pagination parameters
 */
export interface PaginationValidationResult {
	isValid: boolean;
	page: number;
	limit: number;
	error?: string;
}

/**
 * Validates and sanitizes pagination parameters from query strings
 * @param pageStr Raw page parameter from query
 * @param limitStr Raw limit parameter from query
 * @returns PaginationValidationResult with validated values or error
 */
export function validatePaginationParams(
	pageStr?: string,
	limitStr?: string
): PaginationValidationResult {
	// Parse and validate page
	let page = DEFAULT_PAGE;
	if (pageStr) {
		// Sanitize input: remove whitespace and special characters
		const sanitized = pageStr.trim();

		// Check for empty string after trim
		if (sanitized === "") {
			page = DEFAULT_PAGE;
		} else {
			// Check for decimal points, scientific notation, or other invalid characters
			if (
				sanitized.includes(".") ||
				sanitized.includes("e") ||
				sanitized.includes("E") ||
				/[^0-9-]/.test(sanitized)
			) {
				return {
					isValid: false,
					page: DEFAULT_PAGE,
					limit: DEFAULT_LIMIT,
					error: "Page must be a positive integer",
				};
			}

			const parsedPage = Number.parseInt(sanitized, 10);

			// Check for NaN, negative numbers, zero, or values that are too large
			if (
				Number.isNaN(parsedPage) ||
				parsedPage < 1 ||
				parsedPage > Number.MAX_SAFE_INTEGER
			) {
				return {
					isValid: false,
					page: DEFAULT_PAGE,
					limit: DEFAULT_LIMIT,
					error: "Page must be a positive integer",
				};
			}

			page = parsedPage;
		}
	}

	// Parse and validate limit
	let limit = DEFAULT_LIMIT;
	if (limitStr) {
		// Sanitize input: remove whitespace
		const sanitized = limitStr.trim();

		// Check for empty string after trim
		if (sanitized === "") {
			limit = DEFAULT_LIMIT;
		} else {
			// Check for decimal points, scientific notation, or other invalid characters
			if (
				sanitized.includes(".") ||
				sanitized.includes("e") ||
				sanitized.includes("E") ||
				/[^0-9-]/.test(sanitized)
			) {
				return {
					isValid: false,
					page,
					limit: DEFAULT_LIMIT,
					error: "Limit must be a positive integer",
				};
			}

			const parsedLimit = Number.parseInt(sanitized, 10);

			// Check for NaN, negative numbers, zero, or values that are too large
			if (
				Number.isNaN(parsedLimit) ||
				parsedLimit < 1 ||
				parsedLimit > Number.MAX_SAFE_INTEGER
			) {
				return {
					isValid: false,
					page,
					limit: DEFAULT_LIMIT,
					error: "Limit must be a positive integer",
				};
			}

			if (parsedLimit > MAX_LIMIT) {
				return {
					isValid: false,
					page,
					limit: DEFAULT_LIMIT,
					error: `Limit cannot exceed ${MAX_LIMIT}`,
				};
			}

			limit = parsedLimit;
		}
	}

	return {
		isValid: true,
		page,
		limit,
	};
}
