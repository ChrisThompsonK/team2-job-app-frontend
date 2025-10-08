/**
 * Axios-based Job Role Service for fetching data from backend API
 */

import axios, { type AxiosInstance } from "axios";
import type { JobRoleDetailedResponse } from "../models/job-role-detailed-response.js";
import type { JobRoleResponse } from "../models/job-role-response.js";
import type { JobRoleService } from "./job-role-service.js";

/**
 * Backend API response wrapper
 */
interface BackendResponse<T> {
	success: boolean;
	data: T;
}

/**
 * Backend job role format (different field names than frontend)
 */
interface BackendJobRole {
	id: number;
	jobRoleName: string;
	description: string;
	responsibilities: string;
	jobSpecLink: string;
	location: string;
	capability: string;
	band: string;
	closingDate: string;
	status: string;
	numberOfOpenPositions: number;
}

/**
 * Axios-based Job Role Service implementation
 * Fetches job roles from backend REST API endpoints
 */
export class AxiosJobRoleService implements JobRoleService {
	private axiosInstance: AxiosInstance;

	constructor(baseURL = "http://localhost:8080") {
		this.axiosInstance = axios.create({
			baseURL,
			timeout: 5000,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	/**
	 * Fetches all job roles from /api/job-roles endpoint
	 * @returns Promise<JobRoleResponse[]> List of job roles with essential fields
	 */
	async getJobRoles(): Promise<JobRoleResponse[]> {
		try {
			const response =
				await this.axiosInstance.get<BackendResponse<BackendJobRole[]>>(
					"/api/job-roles"
				);

			// Map backend format to frontend format
			return response.data.data.map((role) => ({
				jobRoleId: role.id,
				roleName: role.jobRoleName,
				location: role.location,
				capability: role.capability,
				band: role.band,
				closingDate: role.closingDate,
			}));
		} catch (error) {
			console.error("Error fetching job roles:", error);
			return [];
		}
	}

	/**
	 * Fetches a specific job role by ID from /api/job-roles/:id endpoint
	 * @param id The job role ID to fetch
	 * @returns Promise<JobRoleDetailedResponse | null> The job role details or null if not found
	 */
	async getJobRoleById(id: number): Promise<JobRoleDetailedResponse | null> {
		// Validate input
		if (!Number.isInteger(id) || id <= 0) {
			return null;
		}

		try {
			const response = await this.axiosInstance.get<
				BackendResponse<BackendJobRole>
			>(`/api/job-roles/${id}`);

			const role = response.data.data;

			// Map backend format to frontend format
			return {
				jobRoleId: role.id,
				roleName: role.jobRoleName,
				description: role.description,
				responsibilities: role.responsibilities,
				jobSpecLink: role.jobSpecLink,
				location: role.location,
				capability: role.capability,
				band: role.band,
				closingDate: role.closingDate,
				status: role.status,
				numberOfOpenPositions: role.numberOfOpenPositions,
			};
		} catch (error) {
			// Handle 404 or other errors
			if (axios.isAxiosError(error) && error.response?.status === 404) {
				return null;
			}
			console.error(`Error fetching job role ${id}:`, error);
			return null;
		}
	}
}
