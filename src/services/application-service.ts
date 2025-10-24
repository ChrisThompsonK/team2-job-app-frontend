/**
 * Application Service Interface
 * Defines the contract for job application submission and retrieval
 */

import type { ApplicantActionResponse } from "../models/applicant-action.js";
import type { ApplicantsPageResponse } from "../models/applicant-display.js";
import type { ApplicationResponse } from "../models/application-request.js";

/**
 * Service interface for managing job applications
 */
export interface ApplicationService {
	/**
	 * Submits a job application with applicant details and CV
	 * @param jobRoleId The ID of the job role to apply for
	 * @param applicantName The full name of the applicant
	 * @param applicantEmail The email address of the applicant
	 * @param coverLetter Optional cover letter text
	 * @param cvFile The CV file to upload
	 * @returns Promise<ApplicationResponse> The application response with status
	 */
	submitApplication(
		jobRoleId: number,
		applicantName: string,
		applicantEmail: string,
		coverLetter: string | undefined,
		cvFile: Express.Multer.File | undefined
	): Promise<ApplicationResponse>;

	/**
	 * Retrieves paginated list of applicants for a specific job role
	 * @param jobRoleId The ID of the job role to get applicants for
	 * @param page The page number (1-based, defaults to 1)
	 * @param limit The number of applicants per page (defaults to 10)
	 * @returns Promise<ApplicantsPageResponse> The paginated applicants response
	 */
	getApplicantsByJobRole(
		jobRoleId: number,
		page?: number,
		limit?: number
	): Promise<ApplicantsPageResponse>;

	/**
	 * Downloads a CV file for a specific application
	 * @param applicationId The ID of the application
	 * @returns Promise<{ buffer: Buffer; fileName: string; mimeType: string }> The CV file data
	 */
	downloadApplicationCv(applicationId: number): Promise<{
		buffer: Buffer;
		fileName: string;
		mimeType: string;
	}>;

	/**
	 * Accepts an applicant for a job role
	 * @param applicationId The ID of the application to accept
	 * @param jobRoleId The ID of the job role
	 * @param reason Optional reason for acceptance
	 * @returns Promise<ApplicantActionResponse> The action response
	 */
	acceptApplicant(
		applicationId: number,
		jobRoleId: number,
		reason?: string
	): Promise<ApplicantActionResponse>;

	/**
	 * Rejects an applicant for a job role
	 * @param applicationId The ID of the application to reject
	 * @param jobRoleId The ID of the job role
	 * @param reason Optional reason for rejection
	 * @returns Promise<ApplicantActionResponse> The action response
	 */
	rejectApplicant(
		applicationId: number,
		jobRoleId: number,
		reason?: string
	): Promise<ApplicantActionResponse>;
}
