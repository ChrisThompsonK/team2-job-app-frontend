/**
 * Job Role Response model representing the data structure for job roles
 */
export interface JobRoleResponse {
	jobRoleId: number;
	roleName: string;
	location: string;
	capability: string;
	band: string;
	closingDate: string;
}
