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
	hasCv?: boolean;
	cvFileName?: string;
	cvMimeType?: string;
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
		baseURL = process.env["API_BASE_URL"] || "http://localhost:8000"
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
		if (backend.jobRole !== undefined) {
			response.jobRole = backend.jobRole;
		}
		if (backend.cvFileName !== undefined) {
			response.cvFileName = backend.cvFileName;
		}
		if (backend.cvMimeType !== undefined) {
			response.cvMimeType = backend.cvMimeType;
		}
		if (backend.hasCv !== undefined) {
			response.hasCv = backend.hasCv;
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
					if (app.hasCv !== undefined) {
						applicant.hasCv = app.hasCv;
					}
					if (app.cvFileName) {
						applicant.cvFileName = app.cvFileName;
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

	/**
	 * Downloads a CV file for a specific application
	 */
	async downloadApplicationCv(applicationId: number): Promise<{
		buffer: Buffer;
		fileName: string;
		mimeType: string;
	}> {
		try {
			const response = await this.axiosInstance.get(
				`/api/applications/${applicationId}/cv`,
				{
					responseType: "arraybuffer",
				}
			);

			// Get file name from Content-Disposition header or use default
			const contentDisposition = response.headers["content-disposition"];
			let fileName = `cv-application-${applicationId}.pdf`;

			if (contentDisposition) {
				const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
				if (fileNameMatch?.[1]) {
					fileName = fileNameMatch[1];
				}
			}

			const mimeType =
				response.headers["content-type"] || "application/octet-stream";

			return {
				buffer: Buffer.from(response.data),
				fileName,
				mimeType,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(
					"Failed to download CV:",
					error.response?.status,
					error.response?.data || error.message,
					error.code
				);

				if (error.response?.status === 404) {
					throw new Error("CV not found for this application");
				}

				if (error.response?.status === 500) {
					throw new Error("Backend server error while downloading CV");
				}

				if (error.code === "ECONNREFUSED") {
					throw new Error(
						"Unable to connect to the backend API for CV download"
					);
				}

				throw new Error(
					`Failed to download CV: ${error.response?.status || error.code || "Unknown error"}`
				);
			}
			throw error;
		}
	}

	/**
	 * Retrieves all applications submitted by a specific user
	 */
	async getUserApplications(
		applicantEmail: string
	): Promise<ApplicationResponse[]> {
		try {
			console.log(
				"Requesting applications for:",
				applicantEmail,
				"URL:",
				`/api/applications/user/${encodeURIComponent(applicantEmail)}`
			);

			const response = await this.axiosInstance.get<
				BackendResponse<BackendApplicationResponse[]>
			>(`/api/applications/user/${encodeURIComponent(applicantEmail)}`);

			console.log("Backend response:", response.data);

			if (!response.data.success) {
				throw new Error("Failed to fetch user applications");
			}

			// Map backend responses to frontend format
			return response.data.data.map((app) => this.mapBackendToFrontend(app));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(
					"Failed to fetch user applications:",
					"Status:",
					error.response?.status,
					"Data:",
					error.response?.data,
					"Message:",
					error.message
				);

				if (error.code === "ECONNREFUSED") {
					throw new Error(
						"Unable to connect to the backend API. Please ensure the API server is running."
					);
				}

				if (error.response?.status === 404) {
					// Return empty array if no applications found
					return [];
				}

				if (error.response?.status && error.response.status >= 500) {
					const errorDetails = error.response?.data
						? JSON.stringify(error.response.data)
						: "No error details";
					console.error("Backend 500 error details:", errorDetails);
					throw new Error(
						`Backend server error (500). Details: ${errorDetails}. Please try again later.`
					);
				}

				throw new Error(
					error.response?.data?.message ||
						"An error occurred while fetching applications"
				);
			}

			throw new Error(
				"An unexpected error occurred while fetching applications"
			);
		}
	}

	async getApplicationById(
		applicationId: number
	): Promise<ApplicationResponse> {
		try {
			const response = await this.axiosInstance.get<
				BackendResponse<BackendApplicationResponse>
			>(`/api/applications/${applicationId}`);

			if (!response.data.success) {
				throw new Error("Failed to fetch application");
			}

			return this.mapBackendToFrontend(response.data.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(
					"Failed to fetch application:",
					error.response?.data || error.message
				);

				if (error.code === "ECONNREFUSED") {
					throw new Error(
						"Unable to connect to the backend API. Please ensure the API server is running."
					);
				}

				if (error.response?.status === 404) {
					throw new Error("Application not found");
				}

				throw new Error(
					error.response?.data?.message ||
						"An error occurred while fetching application"
				);
			}

			throw new Error(
				"An unexpected error occurred while fetching application"
			);
		}
	}

	async updateApplication(
		applicationId: number,
		coverLetter: string | undefined,
		cvFile: Express.Multer.File | undefined
	): Promise<ApplicationResponse> {
		try {
			console.log("=== UPDATE APPLICATION ===");
			console.log("Application ID:", applicationId);
			console.log("Cover Letter provided:", !!coverLetter);
			console.log("CV File provided:", !!cvFile);

			const FormData = (await import("form-data")).default;
			const formData = new FormData();

			if (coverLetter !== undefined) {
				formData.append("coverLetter", coverLetter);
			}

			if (cvFile) {
				formData.append("cv", cvFile.buffer, {
					filename: cvFile.originalname,
					contentType: cvFile.mimetype,
				});
				console.log("CV file details:", {
					name: cvFile.originalname,
					type: cvFile.mimetype,
					size: cvFile.size,
				});
			}

			console.log(
				"Making PUT request to:",
				`/api/applications/${applicationId}`
			);

			const response = await this.axiosInstance.put<
				BackendResponse<BackendApplicationResponse>
			>(`/api/applications/${applicationId}`, formData, {
				headers: {
					...formData.getHeaders(),
				},
			});

			console.log("Update response:", response.data);

			if (!response.data.success) {
				throw new Error("Failed to update application");
			}

			return this.mapBackendToFrontend(response.data.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(
					"Failed to update application:",
					"Status:",
					error.response?.status,
					"Data:",
					error.response?.data,
					"Message:",
					error.message
				);

				if (error.code === "ECONNREFUSED") {
					throw new Error(
						"Unable to connect to the backend API. Please ensure the API server is running."
					);
				}

				throw new Error(
					error.response?.data?.message ||
						"An error occurred while updating application"
				);
			}

			throw new Error(
				"An unexpected error occurred while updating application"
			);
		}
	}

	/**
	 * Withdraws an application by changing its status to 'withdrawn'
	 */
	async withdrawApplication(
		applicationId: number,
		applicantEmail: string
	): Promise<ApplicationResponse> {
		try {
			const response = await this.axiosInstance.delete<
				BackendResponse<BackendApplicationResponse>
			>(`/api/applications/${applicationId}`, {
				headers: {
					"X-User-Email": applicantEmail,
				},
			});

			if (!response.data.success) {
				throw new Error("Failed to withdraw application");
			}

			// Map backend response to frontend format
			return this.mapBackendToFrontend(response.data.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(
					"Failed to withdraw application:",
					"Status:",
					error.response?.status,
					"Data:",
					error.response?.data,
					"Message:",
					error.message
				);

				if (error.code === "ECONNREFUSED") {
					throw new Error(
						"Unable to connect to the backend API. Please ensure the API server is running."
					);
				}

				if (error.code === "ETIMEDOUT" || error.message.includes("timeout")) {
					throw new Error(
						"Request timed out. The backend API may be slow or unresponsive."
					);
				}

				if (error.response) {
					const statusCode = error.response.status;
					const errorMessage =
						error.response.data?.message ||
						error.response.data?.error ||
						"Unknown error occurred";

					// Handle specific error cases
					if (statusCode === 404) {
						throw new Error("Application not found");
					}

					if (statusCode === 403) {
						throw new Error(
							"You do not have permission to withdraw this application"
						);
					}

					if (statusCode === 400) {
						throw new Error(
							errorMessage || "This application cannot be withdrawn"
						);
					}

					throw new Error(`Backend API error (${statusCode}): ${errorMessage}`);
				}

				if (error.request) {
					throw new Error(
						"No response from backend API. Please check if the API server is running."
					);
				}

				throw new Error(
					error.message || "An error occurred while withdrawing application"
				);
			}

			throw new Error(
				"An unexpected error occurred while withdrawing application"
			);
		}
	}
}
