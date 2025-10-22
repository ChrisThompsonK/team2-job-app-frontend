/**
 * Models for displaying applicants for a job role
 */

/**
 * Applicant display model for listing applicants for a job role
 */
export interface ApplicantDisplay {
	applicationId: number;
	applicantName: string;
	applicantEmail: string;
	coverLetter?: string;
	resumeUrl?: string;
	hasCv?: boolean;
	cvFileName?: string;
	status: string;
	submittedAt: string;
	updatedAt?: string;
}

/**
 * Paginated list of applicants for a job role
 */
export interface ApplicantsPageResponse {
	applicants: ApplicantDisplay[];
	pagination: {
		currentPage: number;
		totalPages: number;
		totalApplicants: number;
		applicantsPerPage: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
	jobRole: {
		id: number;
		roleName: string;
		status: string;
	};
}

/**
 * Request parameters for fetching applicants
 */
export interface ApplicantsRequest {
	jobRoleId: number;
	page?: number;
	limit?: number;
}
