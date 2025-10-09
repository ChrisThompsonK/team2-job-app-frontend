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
	status: string;
	submittedAt: string;
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
	 * Submits a job application with CV file
	 */
	async submitApplication(
		jobRoleId: number,
		cvFile: Express.Multer.File | undefined
	): Promise<ApplicationResponse> {
		if (!cvFile) {
			throw new Error("CV file is required");
		}
		try {
			const formData = new FormData();
			formData.append("jobRoleId", jobRoleId.toString());
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
				throw new Error(
					error.response?.data?.message ||
						"Failed to submit application. Please try again."
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
		return {
			applicationId: backend.id,
			jobRoleId: backend.jobRoleId,
			status: backend.status,
			submittedAt: backend.submittedAt,
		};
	}
}
