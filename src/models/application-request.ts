/**
 * Application Request model for submitting job applications
 * Matches the job_applications table schema
 */

export interface ApplicationRequest {
	jobRoleId: number;
	applicantName: string;
	applicantEmail: string;
	coverLetter?: string;
	cvFile: File | null;
}

/**
 * Application Response from backend
 */
export interface ApplicationResponse {
	applicationId: number;
	jobRoleId: number;
	applicantName: string;
	applicantEmail: string;
	coverLetter?: string;
	resumeUrl?: string;
	cvFileName?: string;
	cvMimeType?: string;
	hasCv?: boolean;
	status: string;
	submittedAt: string;
	updatedAt?: string;
	jobRole?: {
		id: number;
		jobRoleName: string;
		description?: string;
		location?: string;
		capability?: string;
		band?: string;
		closingDate?: string;
		status?: string;
	};
}
