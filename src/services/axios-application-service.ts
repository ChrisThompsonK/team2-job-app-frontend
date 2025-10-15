/**
 * Axios-based Application Service for submitting applications to backend API
 */

import axios, { type AxiosInstance } from "axios";
import FormData from "form-data";
import type {
	ApplicantDisplay,
	ApplicantsPageResponse,
} from "../models/applicant-display.js";
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
	jobRole?: {
		id: number;
		jobRoleName: string;
		description: string;
		responsibilities: string;
		jobSpecLink: string;
		location: string;
		capability: string;
		band: string;
		closingDate: string;
		status: string;
		numberOfOpenPositions: number;
		createdAt: string;
		updatedAt: string;
	};
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

	/**
	 * Retrieves paginated list of applicants for a specific job role
	 */
	async getApplicantsByJobRole(
		jobRoleId: number,
		page = 1,
		limit = 10
	): Promise<ApplicantsPageResponse> {
		try {
			const response = await this.axiosInstance.get<
				BackendResponse<BackendApplicationResponse[]>
			>(`/api/applications/job-role/${jobRoleId}`);

			if (!response.data.success) {
				throw new Error("Failed to fetch applicants");
			}

			// Since backend doesn't support pagination, we'll do client-side pagination
			const allApplications = response.data.data;
			const totalApplicants = allApplications.length;
			const totalPages = Math.ceil(totalApplicants / limit);
			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedApplications = allApplications.slice(startIndex, endIndex);

			// Map applications to applicant display format
			const applicants: ApplicantDisplay[] = paginatedApplications.map(
				(app) => {
					const applicant: ApplicantDisplay = {
						applicationId: app.id,
						applicantName: app.applicantName,
						applicantEmail: app.applicantEmail,
						status: app.status,
						submittedAt: app.submittedAt,
					};

					if (app.coverLetter) {
						applicant.coverLetter = app.coverLetter;
					}
					if (app.resumeUrl) {
						applicant.resumeUrl = app.resumeUrl;
					}
					if (app.updatedAt) {
						applicant.updatedAt = app.updatedAt;
					}

					return applicant;
				}
			);

			// Get job role info from first application (they all have the same job role)
			const jobRole =
				allApplications.length > 0 ? allApplications[0]?.jobRole : null;

			return {
				applicants,
				pagination: {
					currentPage: page,
					totalPages,
					totalApplicants,
					applicantsPerPage: limit,
					hasNextPage: page < totalPages,
					hasPreviousPage: page > 1,
				},
				jobRole: jobRole
					? {
							id: jobRole.id,
							roleName: jobRole.jobRoleName,
							status: jobRole.status,
						}
					: {
							id: jobRoleId,
							roleName: "Unknown Job Role",
							status: "unknown",
						},
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(
					"Failed to fetch applicants:",
					error.response?.data || error.message
				);

				// Provide specific error messages based on error type
				if (error.code === "ECONNREFUSED") {
					throw new Error(
						"Unable to connect to the backend API. Please ensure the API server is running on " +
							this.axiosInstance.defaults.baseURL
					);
				}

				if (error.code === "ECONNABORTED") {
					throw new Error(
						"Request timeout. The backend API may be slow to respond."
					);
				}

				// Handle specific HTTP status codes
				if (error.response?.status === 404) {
					throw new Error("Job role not found");
				}

				if (error.response?.status === 400) {
					throw new Error("Invalid parameters provided");
				}

				if (error.response?.status && error.response.status >= 500) {
					throw new Error("Backend server error. Please try again later.");
				}

				throw new Error(
					error.response?.data?.message ||
						"An error occurred while fetching applicants"
				);
			}

			throw new Error("An unexpected error occurred while fetching applicants");
		}
	}
}
