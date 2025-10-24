/**
 * Axios-based Job Role Service for fetching and managing data from backend API
 */

import axios, { type AxiosInstance } from "axios";
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
import type { JobRoleService } from "./job-role-service.js";

/**
 * Backend API response wrapper
 */
interface BackendResponse<T> {
	success: boolean;
	data: T;
}

/**
 * Backend paginated response format
 */
interface BackendPaginatedResponse {
	jobRoles: BackendJobRole[];
	pagination: {
		currentPage: number;
		totalPages: number;
		totalCount: number;
		limit: number;
		hasNext: boolean;
		hasPrevious: boolean;
	};
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
				numberOfOpenPositions: role.numberOfOpenPositions,
				status:
					typeof role.status === "string" &&
					role.status.toLowerCase() === "open"
						? "Open"
						: "Closed",
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

	/**
	 * Fetches paginated job roles from /api/job-roles endpoint with pagination parameters
	 * @param pagination The pagination parameters (page and limit)
	 * @returns Promise<PaginatedResponse<JobRoleResponse>> Paginated job roles with metadata
	 */
	async getJobRolesPaginated(
		pagination: PaginationRequest
	): Promise<PaginatedResponse<JobRoleResponse>> {
		try {
			const response = await this.axiosInstance.get<
				BackendResponse<BackendPaginatedResponse>
			>("/api/job-roles", {
				params: {
					page: pagination.page,
					limit: pagination.limit,
				},
			});

			const backendData = response.data.data;

			// Map backend format to frontend format
			const mappedJobRoles = backendData.jobRoles.map((role) => ({
				jobRoleId: role.id,
				roleName: role.jobRoleName,
				location: role.location,
				capability: role.capability,
				band: role.band,
				closingDate: role.closingDate,
				numberOfOpenPositions: role.numberOfOpenPositions,
				status:
					typeof role.status === "string" &&
					role.status.toLowerCase() === "open"
						? "Open"
						: "Closed",
			}));

			return {
				data: mappedJobRoles,
				pagination: backendData.pagination,
			};
		} catch (error) {
			console.error("Error fetching paginated job roles:", error);
			// Return empty result with basic pagination metadata on error
			return {
				data: [],
				pagination: {
					currentPage: pagination.page,
					totalPages: 0,
					totalCount: 0,
					limit: pagination.limit,
					hasNext: false,
					hasPrevious: false,
				},
			};
		}
	}

	/**
	 * Updates an existing job role via PUT /api/job-roles/:id endpoint
	 * @param id The job role ID to update
	 * @param jobRole The updated job role data
	 * @returns Promise<JobRoleDetailedResponse> The updated job role details
	 * @throws Error if update fails
	 */
	async updateJobRole(
		id: number,
		jobRole: JobRoleCreate
	): Promise<JobRoleDetailedResponse> {
		// Validate input
		if (!Number.isInteger(id) || id <= 0) {
			throw new Error("Invalid job role ID");
		}

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

			const response = await this.axiosInstance.put<
				BackendResponse<BackendJobRole>
			>(`/api/job-roles/${id}`, backendPayload);

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
			console.error(`Error updating job role ${id}:`, error);
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 404) {
					throw new Error("Job role not found");
				}
				const message =
					error.response?.data?.message || "Failed to update job role";
				throw new Error(message);
			}
			throw new Error("Failed to update job role");
		}
	}

	/**
	 * Search and filter job roles with pagination
	 * @param searchParams The search and filter parameters
	 * @returns Promise<PaginatedResponse<JobRoleResponse>> Paginated search results
	 */
	async searchJobRoles(
		searchParams: JobRoleSearchParams
	): Promise<PaginatedResponse<JobRoleResponse>> {
		try {
			// Build query parameters, only including defined values
			const params: Record<string, string | number> = {
				page: searchParams.page ?? 1,
				limit: searchParams.limit ?? 12,
			};

			// Add optional search/filter parameters if provided
			if (searchParams.search?.trim()) {
				params["search"] = searchParams.search.trim();
			}
			if (searchParams.capability?.trim()) {
				params["capability"] = searchParams.capability.trim();
			}
			if (searchParams.location?.trim()) {
				params["location"] = searchParams.location.trim();
			}
			if (searchParams.band?.trim()) {
				params["band"] = searchParams.band.trim();
			}
			if (searchParams.status?.trim()) {
				params["status"] = searchParams.status.trim();
			}

			const response = await this.axiosInstance.get<
				BackendResponse<BackendPaginatedResponse>
			>("/api/job-roles/search", { params });

			const backendData = response.data.data;

			// Map backend format to frontend format
			const mappedJobRoles = backendData.jobRoles.map((role) => ({
				jobRoleId: role.id,
				roleName: role.jobRoleName,
				location: role.location,
				capability: role.capability,
				band: role.band,
				closingDate: role.closingDate,
				numberOfOpenPositions: role.numberOfOpenPositions,
				status:
					typeof role.status === "string" &&
					role.status.toLowerCase() === "open"
						? "Open"
						: "Closed",
			}));

			return {
				data: mappedJobRoles,
				pagination: backendData.pagination,
			};
		} catch (error) {
			console.error("Error searching job roles:", error);
			// Return empty result with basic pagination metadata on error
			return {
				data: [],
				pagination: {
					currentPage: searchParams.page ?? 1,
					totalPages: 0,
					totalCount: 0,
					limit: searchParams.limit ?? 12,
					hasNext: false,
					hasPrevious: false,
				},
			};
		}
	}

	/**
	 * Get available filter options (capabilities, locations, bands)
	 * Fetches from backend API endpoints
	 * @returns Promise<JobRoleFilterOptions> Available filter options for dropdowns
	 */
	async getFilterOptions(): Promise<JobRoleFilterOptions> {
		try {
			// Fetch all filter options in parallel
			const [capabilitiesRes, locationsRes, bandsRes] = await Promise.all([
				this.axiosInstance.get<BackendResponse<string[]>>(
					"/api/job-roles/capabilities"
				),
				this.axiosInstance.get<BackendResponse<string[]>>(
					"/api/job-roles/locations"
				),
				this.axiosInstance.get<BackendResponse<string[]>>(
					"/api/job-roles/bands"
				),
			]);

			return {
				capabilities: capabilitiesRes.data.data,
				locations: locationsRes.data.data,
				bands: bandsRes.data.data,
			};
		} catch (error) {
			console.error("Error fetching filter options:", error);
			// Return hardcoded defaults as fallback
			return {
				capabilities: [
					"Engineering",
					"Analytics",
					"Product",
					"Design",
					"Quality Assurance",
					"Documentation",
					"Testing",
				],
				locations: [
					"Belfast, Northern Ireland",
					"Birmingham, England",
					"Derry~Londonderry, Northern Ireland",
					"Dublin, Ireland",
					"London, England",
					"Gdansk, Poland",
					"Helsinki, Finland",
					"Paris, France",
					"Antwerp, Belgium",
					"Buenos Aires, Argentina",
					"Indianapolis, United States",
					"Nova Scotia, Canada",
					"Toronto, Canada",
					"Remote",
				],
				bands: ["Junior", "Mid", "Senior"],
			};
		}
	}

	/**
	 * Fetches all job roles for export (no pagination limit)
	 * Uses a high limit to retrieve all records
	 * @returns Promise<JobRoleResponse[]> Complete list of all job roles
	 */
	/**
	 * Fetches all job roles for export (no pagination limit)
	 * Uses multiple paginated requests to retrieve all records
	 * Note: Backend limits max to 100 per request, so we paginate
	 * @returns Promise<JobRoleResponse[]> Complete list of all job roles
	 */
	async getAllJobRolesForExport(): Promise<JobRoleResponse[]> {
		try {
			const allJobRoles: JobRoleResponse[] = [];
			let currentPage = 1;
			let hasMorePages = true;
			const limit = 100; // Backend maximum

			// Keep fetching pages until we get all data
			while (hasMorePages) {
				const response = await this.axiosInstance.get<{
					success: boolean;
					data: BackendPaginatedResponse;
				}>(`/api/job-roles?page=${currentPage}&limit=${limit}`);

				// Map backend format to frontend format and add to array
				const jobRoles = response.data.data.jobRoles.map((role) => ({
					jobRoleId: role.id,
					roleName: role.jobRoleName,
					location: role.location,
					capability: role.capability,
					band: role.band,
					closingDate: role.closingDate,
					numberOfOpenPositions: role.numberOfOpenPositions,
					status:
						typeof role.status === "string" &&
						role.status.toLowerCase() === "open"
							? "Open"
							: "Closed",
				}));

				allJobRoles.push(...jobRoles);

				// Check if there are more pages
				hasMorePages = response.data.data.pagination.hasNext;
				currentPage++;

				// Safety check to prevent infinite loops
				if (currentPage > 1000) {
					console.warn(
						"Reached maximum page limit (1000) while fetching job roles for export"
					);
					break;
				}
			}

			return allJobRoles;
		} catch (error) {
			console.error(
				"Error fetching all job roles for export, trying standard limit:",
				error
			);
			// If high limit fails, try with standard limit as fallback
			try {
				return await this.getJobRoles();
			} catch (fallbackError) {
				console.error(
					"Fallback also failed, returning empty array:",
					fallbackError
				);
				// Return empty array instead of throwing to match getJobRoles behavior
				return [];
			}
		}
	}
}
