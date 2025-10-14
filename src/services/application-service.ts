/**
 * Application Service Interface
 * Defines the contract for job application submission
 */

import type { ApplicationResponse } from "../models/application-request.js";

/**
 * Service interface for submitting job applications
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
}
