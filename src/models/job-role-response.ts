/**
 * Job Role Response model representing the essential data structure for job roles list view
 */

export interface JobRoleResponse {
	jobRoleId: number;
	roleName: string;
	location: string;
	capability: string;
	band: string;
	closingDate: string; // ISO date string (YYYY-MM-DD)
}
