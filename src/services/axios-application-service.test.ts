/**
 * AxiosApplicationService Tests
 */

import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AxiosApplicationService } from "./axios-application-service.js";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios);

describe("AxiosApplicationService", () => {
	let service: AxiosApplicationService;
	let mockAxiosInstance: {
		post: ReturnType<typeof vi.fn>;
		get: ReturnType<typeof vi.fn>;
		put: ReturnType<typeof vi.fn>;
	};

	beforeEach(() => {
		// Reset all mocks
		vi.clearAllMocks();

		// Create mock axios instance
		mockAxiosInstance = {
			post: vi.fn(),
			get: vi.fn(),
			put: vi.fn(),
		};

		// Mock axios.create to return our mock instance
		mockedAxios.create = vi.fn(() => mockAxiosInstance as never);

		// Create service instance
		service = new AxiosApplicationService();
	});

	describe("constructor", () => {
		it("should create axios instance with default baseURL", () => {
			new AxiosApplicationService();

			expect(mockedAxios.create).toHaveBeenCalledWith({
				baseURL: "http://localhost:8000",
				timeout: 10000,
			});
		});

		it("should create axios instance with custom baseURL", () => {
			new AxiosApplicationService("http://custom-api.com");

			expect(mockedAxios.create).toHaveBeenCalledWith({
				baseURL: "http://custom-api.com",
				timeout: 10000,
			});
		});

		it("should use environment variables when available", () => {
			const originalEnv = process.env;
			process.env = {
				...originalEnv,
				API_BASE_URL: "http://env-api.com",
				API_TIMEOUT: "5000",
			};

			new AxiosApplicationService();

			expect(mockedAxios.create).toHaveBeenCalledWith({
				baseURL: "http://env-api.com",
				timeout: 5000,
			});

			process.env = originalEnv;
		});
	});

	describe("submitApplication", () => {
		const mockCvFile: Express.Multer.File = {
			fieldname: "cv",
			originalname: "test-cv.pdf",
			encoding: "7bit",
			mimetype: "application/pdf",
			size: 1024,
			buffer: Buffer.from("test file content"),
			destination: "",
			filename: "",
			path: "",
			stream: {} as NodeJS.ReadableStream,
		};

		const mockBackendResponse = {
			success: true,
			data: {
				id: 1,
				jobRoleId: 123,
				applicantName: "John Doe",
				applicantEmail: "john@example.com",
				coverLetter: "Test cover letter",
				cvFileName: "test-cv.pdf",
				cvMimeType: "application/pdf",
				hasCv: true,
				status: "pending",
				submittedAt: "2025-01-01T00:00:00Z",
				updatedAt: "2025-01-01T00:00:00Z",
			},
		};

		it("should submit application successfully with all fields", async () => {
			mockAxiosInstance.post.mockResolvedValue({ data: mockBackendResponse });

			const result = await service.submitApplication(
				123,
				"John Doe",
				"john@example.com",
				"Test cover letter",
				mockCvFile
			);

			expect(mockAxiosInstance.post).toHaveBeenCalledWith(
				"/api/applications",
				expect.any(Object), // FormData object
				{
					headers: {
						...expect.any(Object), // FormData headers
					},
				}
			);

			expect(result).toEqual({
				id: 1,
				jobRoleId: 123,
				applicantName: "John Doe",
				applicantEmail: "john@example.com",
				coverLetter: "Test cover letter",
				cvFileName: "test-cv.pdf",
				cvMimeType: "application/pdf",
				hasCv: true,
				status: "pending",
				submittedAt: "2025-01-01T00:00:00Z",
				updatedAt: "2025-01-01T00:00:00Z",
			});
		});

		it("should submit application successfully without cover letter", async () => {
			mockAxiosInstance.post.mockResolvedValue({ data: mockBackendResponse });

			const result = await service.submitApplication(
				123,
				"John Doe",
				"john@example.com",
				undefined,
				mockCvFile
			);

			expect(result).toBeDefined();
			expect(mockAxiosInstance.post).toHaveBeenCalled();
		});

		it("should throw error when CV file is missing", async () => {
			await expect(
				service.submitApplication(
					123,
					"John Doe",
					"john@example.com",
					"Test cover letter",
					undefined
				)
			).rejects.toThrow("CV file is required");

			expect(mockAxiosInstance.post).not.toHaveBeenCalled();
		});

		it("should handle backend response without success flag", async () => {
			mockAxiosInstance.post.mockResolvedValue({
				data: { success: false, data: null },
			});

			await expect(
				service.submitApplication(
					123,
					"John Doe",
					"john@example.com",
					"Test cover letter",
					mockCvFile
				)
			).rejects.toThrow("Failed to submit application");
		});

		it("should handle network errors", async () => {
			const networkError = new Error("Network Error");
			networkError.name = "AxiosError";
			(networkError as any).code = "ECONNREFUSED";
			mockAxiosInstance.post.mockRejectedValue(networkError);

			await expect(
				service.submitApplication(
					123,
					"John Doe",
					"john@example.com",
					"Test cover letter",
					mockCvFile
				)
			).rejects.toThrow("Unable to connect to the backend API");
		});

		it("should handle 400 bad request errors", async () => {
			const axiosError = {
				isAxiosError: true,
				response: {
					status: 400,
					data: { message: "Invalid application data" },
				},
			};
			mockAxiosInstance.post.mockRejectedValue(axiosError);

			await expect(
				service.submitApplication(
					123,
					"John Doe",
					"john@example.com",
					"Test cover letter",
					mockCvFile
				)
			).rejects.toThrow("Invalid application data");
		});

		it("should handle 500 server errors", async () => {
			const axiosError = {
				isAxiosError: true,
				response: {
					status: 500,
					data: null,
				},
			};
			mockAxiosInstance.post.mockRejectedValue(axiosError);

			await expect(
				service.submitApplication(
					123,
					"John Doe",
					"john@example.com",
					"Test cover letter",
					mockCvFile
				)
			).rejects.toThrow("Backend server error");
		});
	});

	describe("getApplicantsByJobRole", () => {
		const mockApplicantsResponse = {
			success: true,
			data: {
				applicants: [
					{
						id: 1,
						jobRoleId: 123,
						applicantName: "John Doe",
						applicantEmail: "john@example.com",
						status: "pending",
						submittedAt: "2025-01-01T00:00:00Z",
						hasCv: true,
						jobRole: {
							id: 123,
							jobRoleName: "Software Engineer",
						},
					},
				],
				pagination: {
					currentPage: 1,
					totalPages: 1,
					totalCount: 1,
					limit: 10,
					hasNext: false,
					hasPrevious: false,
				},
			},
		};

		it("should fetch applicants with default pagination", async () => {
			mockAxiosInstance.get.mockResolvedValue({ data: mockApplicantsResponse });

			const result = await service.getApplicantsByJobRole(123);

			expect(mockAxiosInstance.get).toHaveBeenCalledWith(
				"/api/job-roles/123/applicants?page=1&limit=10"
			);
			expect(result).toEqual(mockApplicantsResponse.data);
		});

		it("should fetch applicants with custom pagination", async () => {
			mockAxiosInstance.get.mockResolvedValue({ data: mockApplicantsResponse });

			const result = await service.getApplicantsByJobRole(123, 2, 5);

			expect(mockAxiosInstance.get).toHaveBeenCalledWith(
				"/api/job-roles/123/applicants?page=2&limit=5"
			);
			expect(result).toEqual(mockApplicantsResponse.data);
		});

		it("should throw error for invalid job role ID", async () => {
			await expect(service.getApplicantsByJobRole(-1)).rejects.toThrow(
				"Invalid job role ID"
			);
		});

		it("should handle 404 job role not found", async () => {
			const axiosError = {
				isAxiosError: true,
				response: {
					status: 404,
					data: null,
				},
			};
			mockAxiosInstance.get.mockRejectedValue(axiosError);

			await expect(service.getApplicantsByJobRole(123)).rejects.toThrow(
				"Job role not found"
			);
		});

		it("should handle network connection errors", async () => {
			const networkError = new Error("Network Error");
			(networkError as any).code = "ECONNREFUSED";
			mockAxiosInstance.get.mockRejectedValue(networkError);

			await expect(service.getApplicantsByJobRole(123)).rejects.toThrow(
				"Unable to connect to the backend API"
			);
		});
	});

	describe("getUserApplications", () => {
		const mockUserApplicationsResponse = {
			success: true,
			data: [
				{
					id: 1,
					jobRoleId: 123,
					applicantName: "John Doe",
					applicantEmail: "john@example.com",
					status: "pending",
					submittedAt: "2025-01-01T00:00:00Z",
					jobRole: {
						id: 123,
						jobRoleName: "Software Engineer",
					},
				},
			],
		};

		it("should fetch user applications successfully", async () => {
			mockAxiosInstance.get.mockResolvedValue({
				data: mockUserApplicationsResponse,
			});

			const result = await service.getUserApplications("john@example.com");

			expect(mockAxiosInstance.get).toHaveBeenCalledWith(
				"/api/applications?applicantEmail=john@example.com"
			);
			expect(result).toEqual(mockUserApplicationsResponse.data);
		});

		it("should throw error for invalid email", async () => {
			await expect(service.getUserApplications("")).rejects.toThrow(
				"Applicant email is required"
			);
		});

		it("should handle empty applications list", async () => {
			mockAxiosInstance.get.mockResolvedValue({
				data: { success: true, data: [] },
			});

			const result = await service.getUserApplications("john@example.com");

			expect(result).toEqual([]);
		});
	});

	describe("acceptApplicant", () => {
		const mockAcceptResponse = {
			success: true,
			data: {
				id: 1,
				status: "accepted",
				updatedAt: "2025-01-01T00:00:00Z",
			},
			message: "Application accepted successfully",
		};

		it("should accept applicant successfully", async () => {
			mockAxiosInstance.put.mockResolvedValue({ data: mockAcceptResponse });

			const result = await service.acceptApplicant(1, 123, "Great candidate");

			expect(mockAxiosInstance.put).toHaveBeenCalledWith(
				"/api/applications/1",
				{ status: "accepted", reason: "Great candidate" },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			expect(result).toEqual({
				applicationId: 1,
				status: "accepted",
				message: "Application accepted successfully",
				updatedAt: "2025-01-01T00:00:00Z",
			});
		});

		it("should accept applicant without reason", async () => {
			mockAxiosInstance.put.mockResolvedValue({ data: mockAcceptResponse });

			const result = await service.acceptApplicant(1, 123);

			expect(mockAxiosInstance.put).toHaveBeenCalledWith(
				"/api/applications/1",
				{ status: "accepted", reason: undefined },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			expect(result).toBeDefined();
		});

		it("should handle 404 application not found", async () => {
			const axiosError = {
				isAxiosError: true,
				response: {
					status: 404,
					data: null,
				},
			};
			mockAxiosInstance.put.mockRejectedValue(axiosError);

			await expect(service.acceptApplicant(999, 123)).rejects.toThrow(
				"Application not found"
			);
		});

		it("should handle 403 forbidden (application cannot be updated)", async () => {
			const axiosError = {
				isAxiosError: true,
				response: {
					status: 403,
					data: {
						message: "Application cannot be updated in its current status",
					},
				},
			};
			mockAxiosInstance.put.mockRejectedValue(axiosError);

			await expect(service.acceptApplicant(1, 123)).rejects.toThrow(
				"Application cannot be updated in its current status"
			);
		});
	});

	describe("rejectApplicant", () => {
		const mockRejectResponse = {
			success: true,
			data: {
				id: 1,
				status: "rejected",
				updatedAt: "2025-01-01T00:00:00Z",
			},
			message: "Application rejected successfully",
		};

		it("should reject applicant successfully", async () => {
			mockAxiosInstance.put.mockResolvedValue({ data: mockRejectResponse });

			const result = await service.rejectApplicant(1, 123, "Not suitable");

			expect(mockAxiosInstance.put).toHaveBeenCalledWith(
				"/api/applications/1",
				{ status: "rejected", reason: "Not suitable" },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			expect(result).toEqual({
				applicationId: 1,
				status: "rejected",
				message: "Application rejected successfully",
				updatedAt: "2025-01-01T00:00:00Z",
			});
		});

		it("should handle backend response without success flag", async () => {
			mockAxiosInstance.put.mockResolvedValue({
				data: { success: false, data: null },
			});

			await expect(service.rejectApplicant(1, 123)).rejects.toThrow(
				"Failed to reject applicant"
			);
		});
	});

	describe("getApplicationById", () => {
		const mockApplicationResponse = {
			success: true,
			data: {
				id: 1,
				jobRoleId: 123,
				applicantName: "John Doe",
				applicantEmail: "john@example.com",
				status: "pending",
				submittedAt: "2025-01-01T00:00:00Z",
			},
		};

		it("should fetch application by ID successfully", async () => {
			mockAxiosInstance.get.mockResolvedValue({
				data: mockApplicationResponse,
			});

			const result = await service.getApplicationById(1);

			expect(mockAxiosInstance.get).toHaveBeenCalledWith("/api/applications/1");
			expect(result).toEqual({
				id: 1,
				jobRoleId: 123,
				applicantName: "John Doe",
				applicantEmail: "john@example.com",
				status: "pending",
				submittedAt: "2025-01-01T00:00:00Z",
				hasCv: false,
			});
		});

		it("should throw error for invalid application ID", async () => {
			await expect(service.getApplicationById(-1)).rejects.toThrow(
				"Invalid application ID"
			);
		});

		it("should handle 404 application not found", async () => {
			const axiosError = {
				isAxiosError: true,
				response: {
					status: 404,
					data: null,
				},
			};
			mockAxiosInstance.get.mockRejectedValue(axiosError);

			await expect(service.getApplicationById(999)).rejects.toThrow(
				"Application not found"
			);
		});
	});

	describe("updateApplication", () => {
		const mockUpdateResponse = {
			success: true,
			data: {
				id: 1,
				jobRoleId: 123,
				applicantName: "John Doe",
				applicantEmail: "john@example.com",
				coverLetter: "Updated cover letter",
				status: "pending",
				submittedAt: "2025-01-01T00:00:00Z",
				updatedAt: "2025-01-01T01:00:00Z",
			},
		};

		it("should update application with cover letter only", async () => {
			mockAxiosInstance.put.mockResolvedValue({ data: mockUpdateResponse });

			const result = await service.updateApplication(
				1,
				"Updated cover letter",
				undefined
			);

			expect(mockAxiosInstance.put).toHaveBeenCalledWith(
				"/api/applications/1",
				expect.any(Object), // FormData
				{
					headers: expect.any(Object),
				}
			);

			expect(result).toEqual({
				id: 1,
				jobRoleId: 123,
				applicantName: "John Doe",
				applicantEmail: "john@example.com",
				coverLetter: "Updated cover letter",
				status: "pending",
				submittedAt: "2025-01-01T00:00:00Z",
				updatedAt: "2025-01-01T01:00:00Z",
				hasCv: false,
			});
		});

		it("should throw error for invalid application ID", async () => {
			await expect(
				service.updateApplication(-1, "Updated cover letter", undefined)
			).rejects.toThrow("Invalid application ID");
		});
	});

	describe("downloadApplicationCv", () => {
		it("should download CV successfully", async () => {
			const mockCvData = Buffer.from("CV content");
			mockAxiosInstance.get.mockResolvedValue({
				data: mockCvData,
				headers: {
					"content-disposition": 'attachment; filename="john-doe-cv.pdf"',
					"content-type": "application/pdf",
				},
			});

			const result = await service.downloadApplicationCv(1);

			expect(mockAxiosInstance.get).toHaveBeenCalledWith(
				"/api/applications/1/cv",
				{ responseType: "arraybuffer" }
			);

			expect(result).toEqual({
				buffer: mockCvData,
				fileName: "john-doe-cv.pdf",
				mimeType: "application/pdf",
			});
		});

		it("should throw error for invalid application ID", async () => {
			await expect(service.downloadApplicationCv(-1)).rejects.toThrow(
				"Invalid application ID"
			);
		});

		it("should handle 404 CV not found", async () => {
			const axiosError = {
				isAxiosError: true,
				response: {
					status: 404,
					data: null,
				},
			};
			mockAxiosInstance.get.mockRejectedValue(axiosError);

			await expect(service.downloadApplicationCv(1)).rejects.toThrow(
				"CV file not found"
			);
		});
	});
});
