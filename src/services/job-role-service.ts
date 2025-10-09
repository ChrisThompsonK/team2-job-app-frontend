/**
 * Job Role Service Interface
 * Defines the contract for job role data retrieval and creation
 */

import type { JobRoleCreate } from "../models/job-role-create.js";
import type { JobRoleDetailedResponse } from "../models/job-role-detailed-response.js";
import type { JobRoleResponse } from "../models/job-role-response.js";

/**
 * Service interface for fetching and managing job role data
 * Implementations can use different data sources (API, database, etc.)
 */
export interface JobRoleService {
	/**
	 * Fetches all job roles
	 * @returns Promise<JobRoleResponse[]> List of job roles with essential fields
	 */
	getJobRoles(): Promise<JobRoleResponse[]>;

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
}
