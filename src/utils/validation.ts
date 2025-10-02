/**
 * Utility functions for input validation and data sanitization
 */

/**
 * Validates and parses a job role ID from a string
 * @param idString - The ID string to validate
 * @returns Parsed ID number or null if invalid
 */
export function validateJobRoleId(idString: string | undefined): number | null {
	if (!idString || typeof idString !== "string") {
		return null;
	}

	const trimmed = idString.trim();
	if (trimmed === "") {
		return null;
	}

	// Check if the trimmed string contains only digits (and optional leading zeros)
	if (!/^\d+$/.test(trimmed)) {
		return null;
	}

	const parsed = parseInt(trimmed, 10);

	// Check if it's a valid positive integer
	if (Number.isNaN(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
		return null;
	}

	return parsed;
}

/**
 * Validates a date string is in YYYY-MM-DD format
 * @param dateString - The date string to validate
 * @returns True if valid, false otherwise
 */
export function validateDateString(dateString: string): boolean {
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(dateString)) {
		return false;
	}

	// Parse the date components manually to avoid timezone issues
	const parts = dateString.split("-");
	if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
		return false;
	}

	const year = parseInt(parts[0], 10);
	const month = parseInt(parts[1], 10);
	const day = parseInt(parts[2], 10);

	// Validate that all parts are valid numbers
	if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
		return false;
	}

	// Create date in UTC to avoid timezone offset issues
	const date = new Date(Date.UTC(year, month - 1, day));

	// Check if date is valid and the components match the input
	if (date instanceof Date && !Number.isNaN(date.getTime())) {
		// Verify that the date components match the input (catches invalid dates)
		return (
			date.getUTCFullYear() === year &&
			date.getUTCMonth() === month - 1 &&
			date.getUTCDate() === day
		);
	}

	return false;
}

/**
 * Sanitizes a string for safe display in HTML
 * @param input - Input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
	return input
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#x27;")
		.trim();
}
