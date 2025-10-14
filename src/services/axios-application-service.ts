/**
 * Axios-based Application Service for submitting applications to backend API
 */

import axios, { type AxiosInstance } from "axios";
import FormData from "form-data";
import type { ApplicationResponse } from "../models/application-request.js";
import type { ApplicationService } from "./application-service.js";

/**
 * Backend API response wrapper
 */
interface BackendResponse<T> {
	success: boolean;
	data: T;
}

/**
 * Backend application response format
 */
interface BackendApplicationResponse {
	id: number;
	jobRoleId: number;
	applicantName: string;
	applicantEmail: string;
	coverLetter?: string;
	resumeUrl?: string;
	status: string;
	submittedAt: string;
	updatedAt?: string;
}

/**
 * Axios-based Application Service implementation
 * Submits applications to backend REST API
 */
export class AxiosApplicationService implements ApplicationService {
	private axiosInstance: AxiosInstance;

	constructor(
		baseURL = process.env["API_BASE_URL"] || "http://localhost:8080"
	) {
		this.axiosInstance = axios.create({
			baseURL,
			timeout: Number.parseInt(process.env["API_TIMEOUT"] || "10000", 10),
		});
	}

	/**
	 * Submits a job application with applicant details and CV file
	 */
	async submitApplication(
		jobRoleId: number,
		applicantName: string,
		applicantEmail: string,
		coverLetter: string | undefined,
		cvFile: Express.Multer.File | undefined
	): Promise<ApplicationResponse> {
		if (!cvFile) {
			throw new Error("CV file is required");
		}
		try {
			const formData = new FormData();
			formData.append("jobRoleId", jobRoleId.toString());
			formData.append("applicantName", applicantName);
			formData.append("applicantEmail", applicantEmail);
			if (coverLetter) {
				formData.append("coverLetter", coverLetter);
			}
			formData.append("cv", cvFile.buffer, {
				filename: cvFile.originalname,
				contentType: cvFile.mimetype,
			});

			const response = await this.axiosInstance.post<
				BackendResponse<BackendApplicationResponse>
			>("/api/applications", formData, {
				headers: {
					...formData.getHeaders(),
				},
			});

			if (!response.data.success) {
				throw new Error("Application submission failed");
			}

			// Map backend response to frontend format
			return this.mapBackendToFrontend(response.data.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(
					"Failed to submit application:",
					error.response?.data || error.message
				);

				// Provide specific error messages based on error type
				if (error.code === "ECONNREFUSED") {
					throw new Error(
						"Unable to connect to the backend API. Please ensure the API server is running on " +
							this.axiosInstance.defaults.baseURL
					);
				}

				if (error.code === "ETIMEDOUT" || error.message.includes("timeout")) {
					throw new Error(
						"Request timed out. The backend API may be slow or unresponsive."
					);
				}

				if (error.response) {
					// Server responded with an error status
					const statusCode = error.response.status;
					const errorMessage =
						error.response.data?.message ||
						error.response.data?.error ||
						"Unknown error occurred";

					throw new Error(`Backend API error (${statusCode}): ${errorMessage}`);
				}

				if (error.request) {
					// Request was made but no response received
					throw new Error(
						"No response from backend API. Please check if the API server is running."
					);
				}

				throw new Error(
					error.message || "Failed to submit application. Please try again."
				);
			}
			throw error;
		}
	}

	/**
	 * Maps backend application response to frontend format
	 */
	private mapBackendToFrontend(
		backend: BackendApplicationResponse
	): ApplicationResponse {
		const response: ApplicationResponse = {
			applicationId: backend.id,
			jobRoleId: backend.jobRoleId,
			applicantName: backend.applicantName,
			applicantEmail: backend.applicantEmail,
			status: backend.status,
			submittedAt: backend.submittedAt,
		};

		if (backend.coverLetter !== undefined) {
			response.coverLetter = backend.coverLetter;
		}
		if (backend.resumeUrl !== undefined) {
			response.resumeUrl = backend.resumeUrl;
		}
		if (backend.updatedAt !== undefined) {
			response.updatedAt = backend.updatedAt;
		}

		return response;
	}
}
