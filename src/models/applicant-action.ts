/**
 * Models for applicant acceptance/rejection actions
 */

export type ApplicationStatus = "pending" | "accepted" | "rejected";

/**
 * Request model for accepting or rejecting an applicant
 */
export interface ApplicantActionRequest {
	applicationId: number;
	jobRoleId: number;
	status: "accepted" | "rejected";
	reason?: string;
}

/**
 * Response model for applicant action
 */
export interface ApplicantActionResponse {
	applicationId: number;
	status: ApplicationStatus;
	message: string;
	updatedAt: string;
}
