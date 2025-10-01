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

export interface JobRoleService {
	getJobRoles(): Promise<JobRoleResponse[]>;
}

/**
 * HTTP-based Job Role Service implementation with JSON fallback
 * Fetches job roles from REST API with graceful degradation to local JSON data
 */
export class HttpJobRoleServiceWithJsonFallback implements JobRoleService {
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
			// Fallback to JSON file data directly
			try {
				const jsonPath = path.join(__dirname, "..", "data", "job-roles.json");
				const jsonData = await fs.readFile(jsonPath, "utf-8");
				const data = JSON.parse(jsonData) as { jobRoles: JobRoleResponse[] };
				return data.jobRoles;
			} catch (jsonError) {
				console.error("Error reading job roles JSON file:", jsonError);
				console.warn(
					"No job roles data available - both API and JSON file failed"
				);
				return [];
			}
		}
	}
}
