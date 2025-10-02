/**
 * Job Role Service for handling job role data from local JSON file
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { JobRoleDetailedResponse } from "../models/job-role-detailed-response.js";
import type { JobRoleResponse } from "../models/job-role-response.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface JobRoleService {
	getJobRoles(): Promise<JobRoleResponse[]>;
	getJobRoleById(id: number): Promise<JobRoleDetailedResponse | null>;
}

/**
 * JSON-based Job Role Service implementation
 * Reads job roles directly from local JSON data file with caching for performance
 */
export class JsonJobRoleService implements JobRoleService {
	private cachedData: JobRoleDetailedResponse[] | null = null;
	private readonly jsonPath: string;

	constructor() {
		this.jsonPath = path.join(__dirname, "..", "data", "job-roles.json");
	}

	/**
	 * Loads and caches job roles data from JSON file
	 * @returns Promise<JobRoleDetailedResponse[]> Full job roles data
	 */
	private async loadJobRolesData(): Promise<JobRoleDetailedResponse[]> {
		if (this.cachedData !== null) {
			return this.cachedData;
		}

		try {
			const jsonData = await fs.readFile(this.jsonPath, "utf-8");
			const data = JSON.parse(jsonData) as {
				jobRoles: JobRoleDetailedResponse[];
			};

			// Validate data structure
			if (!data.jobRoles || !Array.isArray(data.jobRoles)) {
				throw new Error("Invalid JSON structure: jobRoles array not found");
			}

			this.cachedData = data.jobRoles;
			return this.cachedData;
		} catch (error) {
			console.error("Error loading job roles data:", error);
			throw new Error(
				`Failed to load job roles: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	}

	/**
	 * Clears the cache (useful for testing or dynamic updates)
	 */
	public clearCache(): void {
		this.cachedData = null;
	}

	/**
	 * Fetches all job roles, returning only essential fields for list view
	 * @returns Promise<JobRoleResponse[]> List of job roles with essential fields
	 */
	async getJobRoles(): Promise<JobRoleResponse[]> {
		try {
			const fullData = await this.loadJobRolesData();

			// Map to lighter JobRoleResponse format for list view
			return fullData.map((role) => ({
				jobRoleId: role.jobRoleId,
				roleName: role.roleName,
				location: role.location,
				capability: role.capability,
				band: role.band,
				closingDate: role.closingDate,
			}));
		} catch (error) {
			console.error("Error in getJobRoles:", error);
			return [];
		}
	}

	/**
	 * Fetches a specific job role by ID with full details
	 * @param id The job role ID to fetch
	 * @returns Promise<JobRoleDetailedResponse | null> The job role details or null if not found
	 */
	async getJobRoleById(id: number): Promise<JobRoleDetailedResponse | null> {
		// Validate input
		if (!Number.isInteger(id) || id <= 0) {
			return null;
		}

		try {
			const allRoles = await this.loadJobRolesData();
			return allRoles.find((role) => role.jobRoleId === id) || null;
		} catch (error) {
			console.error("Error in getJobRoleById:", error);
			return null;
		}
	}
}
