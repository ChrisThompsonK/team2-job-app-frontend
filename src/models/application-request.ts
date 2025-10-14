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
	status: string;
	submittedAt: string;
	updatedAt?: string;
}
