/**
 * Job Role Service Interface
 * Defines the contract for job role data retrieval
 */

import type { JobRoleDetailedResponse } from "../models/job-role-detailed-response.js";
import type { JobRoleResponse } from "../models/job-role-response.js";

/**
 * Service interface for fetching job role data
 * Implementations can use different data sources (API, database, etc.)
 */
export interface JobRoleService {
	/**
	 * Fetches all job roles
	 * @returns Promise<JobRoleResponse[]> List of job roles with essential fields
	 */
	getJobRoles(): Promise<JobRoleResponse[]>;

	/**
	 * Fetches all job roles with optional sorting
	 * @param sortBy The column to sort by (e.g., 'location', 'band')
	 * @param order The sort order ('asc', 'desc', or 'none')
	 * @returns Promise<JobRoleResponse[]> List of job roles sorted as requested
	 */
	getJobRoles(sortBy?: string, order?: string): Promise<JobRoleResponse[]>;

	/**
	 * Fetches a specific job role by ID
	 * @param id The job role ID to fetch
	 * @returns Promise<JobRoleDetailedResponse | null> The job role details or null if not found
	 */
	getJobRoleById(id: number): Promise<JobRoleDetailedResponse | null>;
}
