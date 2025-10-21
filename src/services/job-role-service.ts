/**
 * Job Role Service Interface
 * Defines the contract for job role data retrieval and creation
 */

import type { JobRoleCreate } from "../models/job-role-create.js";
import type { JobRoleDetailedResponse } from "../models/job-role-detailed-response.js";
import type { JobRoleResponse } from "../models/job-role-response.js";
import type {
	JobRoleFilterOptions,
	JobRoleSearchParams,
} from "../models/job-role-search-params.js";
import type {
	PaginatedResponse,
	PaginationRequest,
} from "../models/pagination.js";

/**
 * Service interface for fetching and managing job role data
 * Implementations can use different data sources (API, database, etc.)
 */
export interface JobRoleService {
	/**
	 * Fetches all job roles (legacy method for backward compatibility)
	 * @returns Promise<JobRoleResponse[]> List of job roles with essential fields
	 */
	getJobRoles(): Promise<JobRoleResponse[]>;

	/**
	 * Fetches paginated job roles
	 * @param pagination The pagination parameters
	 * @returns Promise<PaginatedResponse<JobRoleResponse>> Paginated job roles with metadata
	 */
	getJobRolesPaginated(
		pagination: PaginationRequest
	): Promise<PaginatedResponse<JobRoleResponse>>;

	/**
	 * Fetches a specific job role by ID
	 * @param id The job role ID to fetch
	 * @returns Promise<JobRoleDetailedResponse | null> The job role details or null if not found
	 */
	getJobRoleById(id: number): Promise<JobRoleDetailedResponse | null>;

	/**
	 * Creates a new job role
	 * @param jobRole The job role data to create
	 * @returns Promise<JobRoleDetailedResponse> The created job role with auto-generated ID
	 */
	createJobRole(jobRole: JobRoleCreate): Promise<JobRoleDetailedResponse>;

	/**
	 * Deletes a job role by ID
	 * @param id The job role ID to delete
	 * @returns Promise<boolean> True if deletion was successful, false otherwise
	 */
	deleteJobRole(id: number): Promise<boolean>;

	/**
	 * Updates an existing job role
	 * @param id The job role ID to update
	 * @param jobRole The updated job role data
	 * @returns Promise<JobRoleDetailedResponse> The updated job role details
	 */
	updateJobRole(
		id: number,
		jobRole: JobRoleCreate
	): Promise<JobRoleDetailedResponse>;

	/**
	 * Search and filter job roles with pagination
	 * @param searchParams The search and filter parameters
	 * @returns Promise<PaginatedResponse<JobRoleResponse>> Paginated search results
	 */
	searchJobRoles(
		searchParams: JobRoleSearchParams
	): Promise<PaginatedResponse<JobRoleResponse>>;

	/**
	 * Get available filter options (capabilities, locations, bands)
	 * @returns Promise<JobRoleFilterOptions> Available filter options for dropdowns
	 */
	getFilterOptions(): Promise<JobRoleFilterOptions>;

	/**
	 * Fetches all job roles for export (no pagination limit)
	 * @returns Promise<JobRoleResponse[]> Complete list of all job roles
	 */
	getAllJobRolesForExport(): Promise<JobRoleResponse[]>;
}
