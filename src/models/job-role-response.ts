/**
 * Job Role Response model representing the essential data structure for job roles list view
 */
import type {
	JobRoleBand,
	JobRoleCapability,
} from "./job-role-detailed-response.js";

export interface JobRoleResponse {
	jobRoleId: number;
	roleName: string;
	location: string;
	capability: JobRoleCapability;
	band: JobRoleBand;
	closingDate: string; // ISO date string (YYYY-MM-DD)
}
