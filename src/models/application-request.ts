/**
 * Application Request model for submitting job applications
 */

export interface ApplicationRequest {
	jobRoleId: number;
	cvFile: File | null;
}

/**
 * Application Response from backend
 */
export interface ApplicationResponse {
	applicationId: number;
	jobRoleId: number;
	status: string;
	submittedAt: string;
}
