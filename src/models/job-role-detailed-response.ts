/**
 * Detailed Job Role Response model representing the complete data structure for job role specifications
 */

export type JobRoleStatus = "Open" | "Closing Soon" | "Closed";

export type JobRoleBand =
	| "Trainee"
	| "Associate"
	| "Senior Associate"
	| "Consultant"
	| "Principal"
	| "Manager";

export type JobRoleCapability =
	| "Engineering"
	| "Experience Design"
	| "Cyber Security"
	| "Data & Analytics"
	| "Product Management"
	| "Business Analysis"
	| "Delivery Management"
	| "Architecture"
	| "Platform Engineering";

export interface JobRoleDetailedResponse {
	jobRoleId: number;
	roleName: string;
	description: string;
	responsibilities: string[];
	jobSpecLink: string; // Link to Job Spec in SharePoint
	location: string;
	capability: JobRoleCapability;
	band: JobRoleBand;
	closingDate: string; // ISO date string (YYYY-MM-DD)
	status: JobRoleStatus;
	numberOfOpenPositions: number;
}
