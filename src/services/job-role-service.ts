/**
 * Job Role Service for handling API calls to job-roles endpoints
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";
import type { JobRoleResponse } from "../models/job-role-response.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface IJobRoleService {
	getJobRoles(): Promise<JobRoleResponse[]>;
}

export class JobRoleService implements IJobRoleService {
	private baseURL: string;

	constructor(
		baseURL: string = process.env["API_BASE_URL"] ?? "http://localhost:8080"
	) {
		this.baseURL = baseURL;
	}

	/**
	 * Fetches all job roles from the API
	 * @returns Promise<JobRoleResponse[]> List of job roles
	 */
	async getJobRoles(): Promise<JobRoleResponse[]> {
		try {
			const response = await axios.get<JobRoleResponse[]>(
				`${this.baseURL}/job-roles`,
				{
					timeout: 5000,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching job roles:", error);
			// Return mock data for development/testing
			return await this.getMockJobRoles();
		}
	}

	/**
	 * Provides mock data for development when API is not available
	 * @returns JobRoleResponse[] Mock job roles data
	 */
	private async getMockJobRoles(): Promise<JobRoleResponse[]> {
		try {
			const jsonPath = path.join(__dirname, "..", "data", "job-roles.json");
			const jsonData = await fs.readFile(jsonPath, "utf-8");
			const data = JSON.parse(jsonData) as { jobRoles: JobRoleResponse[] };
			return data.jobRoles;
		} catch (error) {
			console.error("Error reading job roles JSON file:", error);
			// Return empty array if JSON file is not available
			console.warn(
				"No job roles data available - both API and JSON file failed"
			);
			return [];
		}
	}
}
