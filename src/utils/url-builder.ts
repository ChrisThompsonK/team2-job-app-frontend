/**
 * URL Builder Utility
 * Provides functions for building URLs with proper query parameter encoding
 */

import type { JobRoleSearchParams } from "../models/job-role-search-params.js";

/**
 * Builds a query string from search parameters with proper URL encoding
 * @param searchParams - The search parameters object
 * @returns Properly encoded query string (starting with & if parameters exist, empty string otherwise)
 */
export function buildSearchQueryString(
	searchParams: Partial<JobRoleSearchParams> | null
): string {
	if (!searchParams) {
		return "";
	}

	const params: string[] = [];

	// Add each parameter if it exists and is not empty
	if (searchParams.search?.trim()) {
		params.push(`search=${encodeURIComponent(searchParams.search.trim())}`);
	}

	if (searchParams.capability?.trim()) {
		params.push(
			`capability=${encodeURIComponent(searchParams.capability.trim())}`
		);
	}

	if (searchParams.location?.trim()) {
		params.push(`location=${encodeURIComponent(searchParams.location.trim())}`);
	}

	if (searchParams.band?.trim()) {
		params.push(`band=${encodeURIComponent(searchParams.band.trim())}`);
	}

	if (searchParams.status?.trim()) {
		params.push(`status=${encodeURIComponent(searchParams.status.trim())}`);
	}

	// Return with leading & if there are parameters, empty string otherwise
	return params.length > 0 ? `&${params.join("&")}` : "";
}

/**
 * Builds a complete pagination URL with search parameters
 * @param baseUrl - The base URL (e.g., "/jobs/search" or "/job-roles")
 * @param page - The page number
 * @param limit - The number of items per page
 * @param searchParams - Optional search parameters
 * @returns Complete URL with encoded query parameters
 */
export function buildPaginationUrl(
	baseUrl: string,
	page: number,
	limit: number,
	searchParams?: Partial<JobRoleSearchParams> | null
): string {
	const searchQuery = buildSearchQueryString(searchParams || null);
	return `${baseUrl}?page=${page}&limit=${limit}${searchQuery}`;
}

/**
 * Builds pagination URLs for all pages in a pagination set
 * @param baseUrl - The base URL
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @param limit - Items per page
 * @param searchParams - Optional search parameters
 * @returns Object containing URLs for all pagination controls
 */
export interface PaginationUrls {
	first: string;
	previous: string | null;
	next: string | null;
	last: string;
	pages: Array<{ page: number; url: string; isCurrent: boolean }>;
}

export function buildPaginationUrls(
	baseUrl: string,
	currentPage: number,
	totalPages: number,
	limit: number,
	searchParams?: Partial<JobRoleSearchParams> | null
): PaginationUrls {
	const urls: PaginationUrls = {
		first: buildPaginationUrl(baseUrl, 1, limit, searchParams),
		previous:
			currentPage > 1
				? buildPaginationUrl(baseUrl, currentPage - 1, limit, searchParams)
				: null,
		next:
			currentPage < totalPages
				? buildPaginationUrl(baseUrl, currentPage + 1, limit, searchParams)
				: null,
		last: buildPaginationUrl(baseUrl, totalPages, limit, searchParams),
		pages: [],
	};

	// Calculate visible page range (max 7 pages)
	let startPage = 1;
	let endPage = totalPages;

	if (totalPages > 7) {
		if (currentPage <= 4) {
			endPage = 5;
		} else if (currentPage >= totalPages - 3) {
			startPage = totalPages - 4;
		} else {
			startPage = currentPage - 2;
			endPage = currentPage + 2;
		}
	}

	// Build page URLs
	for (let page = startPage; page <= endPage; page++) {
		urls.pages.push({
			page,
			url: buildPaginationUrl(baseUrl, page, limit, searchParams),
			isCurrent: page === currentPage,
		});
	}

	return urls;
}
