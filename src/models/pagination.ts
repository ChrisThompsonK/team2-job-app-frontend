/**
 * Pagination-related interfaces and types
 */

/**
 * Request parameters for pagination
 */
export interface PaginationRequest {
	page: number;
	limit: number;
}

/**
 * Pagination metadata in API responses
 */
export interface PaginationMeta {
	currentPage: number;
	totalPages: number;
	totalCount: number;
	limit: number;
	hasNext: boolean;
	hasPrevious: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
	data: T[];
	pagination: PaginationMeta;
}

/**
 * Default pagination values
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 12;
export const MAX_LIMIT = 100;
