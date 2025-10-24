/**
 * Application Service Interface
 * Defines the contract for job application submission and retrieval
 */

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
	 * Retrieves all applications submitted by a specific user
	 * @param applicantEmail The email address of the applicant
	 * @returns Promise<ApplicationResponse[]> List of applications by the user
	 */
	getUserApplications(applicantEmail: string): Promise<ApplicationResponse[]>;

	/**
	 * Retrieves a single application by ID
	 * @param applicationId The ID of the application
	 * @returns Promise<ApplicationResponse> The application details
	 */
	getApplicationById(applicationId: number): Promise<ApplicationResponse>;

	/**
	 * Updates an existing application
	 * @param applicationId The ID of the application to update
	 * @param coverLetter Optional updated cover letter text
	 * @param cvFile Optional new CV file to upload
	 * @returns Promise<ApplicationResponse> The updated application response
	 */
	updateApplication(
		applicationId: number,
		coverLetter: string | undefined,
		cvFile: Express.Multer.File | undefined
	): Promise<ApplicationResponse>;

	/**
	 * Withdraws an application by changing its status to 'withdrawn'
	 * @param applicationId The ID of the application to withdraw
	 * @param applicantEmail The email of the user withdrawing the application (for authentication)
	 * @returns Promise<ApplicationResponse> The updated application with 'withdrawn' status
	 */
	withdrawApplication(
		applicationId: number,
		applicantEmail: string
	): Promise<ApplicationResponse>;
}
