/**
 * Job Role Search Parameters Interface
 * Defines the structure for search and filter query parameters
 */

/**
 * Search and filter parameters for job role queries
 * All fields are optional - missing/undefined fields are ignored in search
 */
export interface JobRoleSearchParams {
	/**
	 * Text search query - performs case-insensitive partial match on job role name
	 * @example "engineer" matches "Senior Software Engineer", "Engineering Manager", etc.
	 */
	search?: string;

	/**
	 * Filter by job capability (exact match)
	 * @example "Engineering", "Analytics", "Product"
	 */
	capability?: string;

	/**
	 * Filter by job location (exact match)
	 * @example "Belfast, Northern Ireland", "London, England"
	 */
	location?: string;

	/**
	 * Filter by band level (exact match)
	 * @example "Junior", "Mid", "Senior"
	 */
	band?: string;

	/**
	 * Filter by job status (exact match)
	 * @example "Open", "Closed"
	 */
	status?: string;

	/**
	 * Page number for pagination (starts at 1)
	 * @default 1
	 */
	page?: number;

	/**
	 * Number of results per page
	 * @default 12
	 */
	limit?: number;
}

/**
 * Filter options available for dropdowns
 * Used to populate the search form select elements
 */
export interface JobRoleFilterOptions {
	capabilities: string[];
	locations: string[];
	bands: string[];
}
