/**
 * Axios-based Job Role Service for fetching and managing data from backend API
 */

import axios, { type AxiosInstance } from "axios";
import type { JobRoleCreate } from "../models/job-role-create.js";
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

	constructor(
		baseURL = process.env["API_BASE_URL"] || "http://localhost:8000"
	) {
		this.axiosInstance = axios.create({
			baseURL,
			timeout: Number.parseInt(process.env["API_TIMEOUT"] || "10000", 10),
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
			const response = await this.axiosInstance.get<{
				success: boolean;
				data: { jobRoles: BackendJobRole[] };
			}>("/api/job-roles?limit=100");

			// Map backend format to frontend format
			return response.data.data.jobRoles.map((role) => ({
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

	/**
	 * Creates a new job role via POST /api/job-roles endpoint
	 * @param jobRole The job role data to create
	 * @returns Promise<JobRoleDetailedResponse> The created job role with auto-generated ID
	 * @throws Error if creation fails
	 */
	async createJobRole(
		jobRole: JobRoleCreate
	): Promise<JobRoleDetailedResponse> {
		try {
			// Map frontend format to backend format
			const backendPayload = {
				jobRoleName: jobRole.roleName,
				description: jobRole.description,
				responsibilities: jobRole.responsibilities,
				jobSpecLink: jobRole.jobSpecLink,
				location: jobRole.location,
				capability: jobRole.capability,
				band: jobRole.band,
				closingDate: jobRole.closingDate,
				status: jobRole.status,
				numberOfOpenPositions: jobRole.numberOfOpenPositions,
			};

			const response = await this.axiosInstance.post<
				BackendResponse<BackendJobRole>
			>("/api/job-roles", backendPayload);

			const role = response.data.data;

			// Map backend format back to frontend format
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
			console.error("Error creating job role:", error);
			if (axios.isAxiosError(error)) {
				const message =
					error.response?.data?.message || "Failed to create job role";
				throw new Error(message);
			}
			throw new Error("Failed to create job role");
		}
	}

	/**
	 * Deletes a job role by ID from /api/job-roles/:id endpoint
	 * @param id The job role ID to delete
	 * @returns Promise<boolean> True if deletion was successful, false otherwise
	 */
	async deleteJobRole(id: number): Promise<boolean> {
		// Validate input
		if (!Number.isInteger(id) || id <= 0) {
			return false;
		}

		try {
			await this.axiosInstance.delete(`/api/job-roles/${id}`);
			return true;
		} catch (error) {
			console.error(`Error deleting job role ${id}:`, error);
			return false;
		}
	}
}
