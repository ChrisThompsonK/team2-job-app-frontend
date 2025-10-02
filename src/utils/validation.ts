/**
 * Utility functions for input validation and data sanitization
 */

/**
 * Validates and parses a job role ID from a string
 * @param idString - The ID string to validate
 * @returns Parsed ID number or null if invalid
 */
export function validateJobRoleId(idString: string | undefined): number | null {
	if (!idString || typeof idString !== 'string') {
		return null;
	}

	const trimmed = idString.trim();
	if (trimmed === '') {
		return null;
	}

	const parsed = parseInt(trimmed, 10);
	
	// Check if it's a valid positive integer
	if (isNaN(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
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

	const date = new Date(dateString);
	return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Sanitizes a string for safe display in HTML
 * @param input - Input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.trim();
}