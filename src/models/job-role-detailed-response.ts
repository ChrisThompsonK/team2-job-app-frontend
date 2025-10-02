/**
 * Detailed Job Role Response model representing the complete data structure for job role specifications
 */

export interface JobRoleDetailedResponse {
	jobRoleId: number;
	roleName: string;
	description: string;
	responsibilities: string;
	jobSpecLink: string; // Link to Job Spec in SharePoint
	location: string;
	capability: string;
	band: string;
	closingDate: string; // ISO date string (YYYY-MM-DD)
	status: string;
	numberOfOpenPositions: number;
}
