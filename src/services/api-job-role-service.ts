/**
 * Backend API Job Role Service
 * Handles job role data from the backend API server
 */

import type { AxiosResponse } from "axios";
import type { JobRoleDetailedResponse } from "../models/job-role-detailed-response.js";
import type { JobRoleResponse } from "../models/job-role-response.js";
import { jobRolesAPI } from "./api.js";
import type { JobRoleService } from "./job-role-service.js";

/**
 * Backend API Response wrapper
 */
interface ApiResponse<T> {
	success: boolean;
	data: T;
}

/**
 * Backend Job Role format (from API)
 */
interface BackendJobRole {
	id: number;
	jobRoleName: string;
	location: string;
	capability: string;
	band: string;
	closingDate: string;
	status: string;
	numberOfOpenPositions: number;
	description?: string;
	responsibilities?: string;
	jobSpecLink?: string;
}

/**
 * API-based Job Role Service implementation
 * Fetches job roles from the backend API server
 */
export class ApiJobRoleService implements JobRoleService {
	/**
	 * Map backend job role format to frontend format
	 */
	private mapToJobRoleResponse(backendRole: BackendJobRole): JobRoleResponse {
		return {
			jobRoleId: backendRole.id,
			roleName: backendRole.jobRoleName,
			location: backendRole.location,
			capability: backendRole.capability,
			band: backendRole.band,
			closingDate: backendRole.closingDate,
		};
	}

	/**
	 * Map backend job role format to detailed frontend format
	 */
	private mapToJobRoleDetailedResponse(
		backendRole: BackendJobRole
	): JobRoleDetailedResponse {
		return {
			jobRoleId: backendRole.id,
			roleName: backendRole.jobRoleName,
			description: backendRole.description || "",
			responsibilities: backendRole.responsibilities || "",
			jobSpecLink: backendRole.jobSpecLink || "",
			location: backendRole.location,
			capability: backendRole.capability,
			band: backendRole.band,
			closingDate: backendRole.closingDate,
			status: backendRole.status,
			numberOfOpenPositions: backendRole.numberOfOpenPositions,
		};
	}
	/**
	 * Get all job roles from the backend API
	 * @returns Promise<JobRoleResponse[]> List of job roles
	 */
	async getJobRoles(): Promise<JobRoleResponse[]> {
		try {
			const response: AxiosResponse<ApiResponse<BackendJobRole[]>> =
				await jobRolesAPI.getAll();
			return response.data.data.map((role) => this.mapToJobRoleResponse(role));
		} catch (error) {
			console.error("Error fetching job roles from API:", error);
			// Return empty array on error instead of throwing
			// This allows the app to continue functioning
			return [];
		}
	}

	/**
	 * Get a specific job role by ID from the backend API
	 * @param id - Job role ID
	 * @returns Promise<JobRoleDetailedResponse | null> Job role details or null if not found
	 */
	async getJobRoleById(id: number): Promise<JobRoleDetailedResponse | null> {
		try {
			const response: AxiosResponse<ApiResponse<BackendJobRole>> =
				await jobRolesAPI.getById(id);
			return this.mapToJobRoleDetailedResponse(response.data.data);
		} catch (error) {
			console.error(`Error fetching job role ${id} from API:`, error);
			return null;
		}
	}

	/**
	 * Get only active job roles from the backend API
	 * @returns Promise<JobRoleResponse[]> List of active job roles
	 */
	async getActiveJobRoles(): Promise<JobRoleResponse[]> {
		try {
			const response: AxiosResponse<ApiResponse<BackendJobRole[]>> =
				await jobRolesAPI.getActive();
			return response.data.data.map((role) => this.mapToJobRoleResponse(role));
		} catch (error) {
			console.error("Error fetching active job roles from API:", error);
			return [];
		}
	}
}
