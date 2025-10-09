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
	 * Submits a job application with CV
	 * @param jobRoleId The ID of the job role to apply for
	 * @param cvFile The CV file to upload
	 * @returns Promise<ApplicationResponse> The application response with status
	 */
	submitApplication(
		jobRoleId: number,
		cvFile: Express.Multer.File | undefined
	): Promise<ApplicationResponse>;
}
