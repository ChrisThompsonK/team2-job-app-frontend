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
		const parsedPage = Number.parseInt(pageStr, 10);
		if (Number.isNaN(parsedPage) || parsedPage < 1 || pageStr.includes(".")) {
			return {
				isValid: false,
				page: DEFAULT_PAGE,
				limit: DEFAULT_LIMIT,
				error: "Page must be a positive integer",
			};
		}
		page = parsedPage;
	}

	// Parse and validate limit
	let limit = DEFAULT_LIMIT;
	if (limitStr) {
		const parsedLimit = Number.parseInt(limitStr, 10);
		if (
			Number.isNaN(parsedLimit) ||
			parsedLimit < 1 ||
			limitStr.includes(".")
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

	return {
		isValid: true,
		page,
		limit,
	};
}
