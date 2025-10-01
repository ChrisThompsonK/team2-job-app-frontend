/**
 * Job Role Service for handling job role data from local JSON file
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { JobRoleResponse } from "../models/job-role-response.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface JobRoleService {
	getJobRoles(): Promise<JobRoleResponse[]>;
}

/**
 * JSON-based Job Role Service implementation
 * Reads job roles directly from local JSON data file
 */
export class JsonJobRoleService implements JobRoleService {
	/**
	 * Fetches all job roles from the local JSON file
	 * @returns Promise<JobRoleResponse[]> List of job roles
	 */
	async getJobRoles(): Promise<JobRoleResponse[]> {
		try {
			const jsonPath = path.join(__dirname, "..", "data", "job-roles.json");
			const jsonData = await fs.readFile(jsonPath, "utf-8");
			const data = JSON.parse(jsonData) as { jobRoles: JobRoleResponse[] };
			return data.jobRoles || [];
		} catch (error) {
			console.error("Error reading job roles JSON file:", error);
			return [];
		}
	}
}
