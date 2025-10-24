/**
 * Application Controller Tests
 */

import type { Request, Response } from "express";
import type { Session } from "express-session";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ApplicationResponse } from "../models/application-request.js";
import type { JobRoleDetailedResponse } from "../models/job-role-detailed-response.js";
import type { ApplicationService } from "../services/application-service.js";
import type { JobRoleService } from "../services/job-role-service.js";
import { ApplicationController } from "./application-controller.js";

// Mock services
const mockApplicationService: ApplicationService = {
	submitApplication: vi.fn(),
	getApplicantsByJobRole: vi.fn(),
	downloadApplicationCv: vi.fn(),
};

const mockJobRoleService: JobRoleService = {
	getJobRoles: vi.fn(),
	getJobRoleById: vi.fn(),
	getJobRolesPaginated: vi.fn(),
	createJobRole: vi.fn(),
	deleteJobRole: vi.fn(),
	updateJobRole: vi.fn(),
	searchJobRoles: vi.fn(),
	getFilterOptions: vi.fn(),
	getAllJobRolesForExport: vi.fn(),
};

// Mock Express Request and Response
const createMockRequest = (
	params = {},
	body = {},
	file?: Express.Multer.File,
	query = {},
	session = {}
): Partial<Request> => ({
	params,
	body,
	file,
	query,
	session: session as Session,
});

const createMockResponse = (): Partial<Response> => {
	const res: Partial<Response> = {};
	res.status = vi.fn().mockReturnValue(res);
	res.render = vi.fn().mockReturnValue(res);
	return res;
};

describe("ApplicationController", () => {
	let controller: ApplicationController;

	beforeEach(() => {
		vi.clearAllMocks();
		controller = new ApplicationController(
			mockApplicationService,
			mockJobRoleService
		);
	});

	describe("getApplicationForm", () => {
		it("should render the application form for a valid active job role", async () => {
			const mockJobRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Software Engineer",
				description: "Test description",
				responsibilities: "Test responsibilities",
				jobSpecLink: "http://example.com",
				location: "Belfast",
				capability: "Engineering",
				band: "Band 1",
				closingDate: "2025-12-31",
				status: "Open",
				numberOfOpenPositions: 3,
			};

			vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(
				mockJobRole
			);

			const req = createMockRequest({ id: "1" }) as Request;
			const res = createMockResponse() as Response;

			await controller.getApplicationForm(req, res);

			expect(mockJobRoleService.getJobRoleById).toHaveBeenCalledWith(1);
			expect(res.render).toHaveBeenCalledWith("job-application-form.njk", {
				jobRole: mockJobRole,
				user: null,
				existingApplication: null,
				isEditMode: false,
			});
		});

		it("should return 400 for invalid job role ID", async () => {
			const req = createMockRequest({ id: "invalid" }) as Request;
			const res = createMockResponse() as Response;

			await controller.getApplicationForm(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message: expect.stringContaining("Invalid job role ID"),
			});
		});

		it("should return 404 if job role not found", async () => {
			vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(null);

			const req = createMockRequest({ id: "999" }) as Request;
			const res = createMockResponse() as Response;

			await controller.getApplicationForm(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message: expect.stringContaining("Job role not found"),
			});
		});

		it("should return 400 if job role is closed", async () => {
			const mockJobRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Software Engineer",
				description: "Test description",
				responsibilities: "Test responsibilities",
				jobSpecLink: "http://example.com",
				location: "Belfast",
				capability: "Engineering",
				band: "Band 1",
				closingDate: "2025-12-31",
				status: "Closed",
				numberOfOpenPositions: 0,
			};

			vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(
				mockJobRole
			);

			const req = createMockRequest({ id: "1" }) as Request;
			const res = createMockResponse() as Response;

			await controller.getApplicationForm(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message: expect.stringContaining(
					"not currently accepting applications"
				),
			});
		});

		it("should auto-fill user data for authenticated users with AuthUser format", async () => {
			const mockJobRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Software Engineer",
				description: "Test description",
				responsibilities: "Test responsibilities",
				jobSpecLink: "http://example.com",
				location: "Belfast",
				capability: "Engineering",
				band: "Band 1",
				closingDate: "2025-12-31",
				status: "Open",
				numberOfOpenPositions: 3,
			};

			vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(
				mockJobRole
			);

			const req = createMockRequest(
				{ id: "1" },
				{},
				undefined,
				{},
				{
					user: {
						userId: "123",
						email: "john.doe@example.com",
						forename: "John",
						surname: "Doe",
						role: "User",
					},
				}
			) as Request;

			const res = createMockResponse() as Response;

			await controller.getApplicationForm(req, res);

			expect(res.render).toHaveBeenCalledWith("job-application-form.njk", {
				jobRole: mockJobRole,
				user: {
					name: "John Doe",
					email: "john.doe@example.com",
				},
			});
		});

		it("should auto-fill user data for authenticated users with User format", async () => {
			const mockJobRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Software Engineer",
				description: "Test description",
				responsibilities: "Test responsibilities",
				jobSpecLink: "http://example.com",
				location: "Belfast",
				capability: "Engineering",
				band: "Band 1",
				closingDate: "2025-12-31",
				status: "Open",
				numberOfOpenPositions: 3,
			};

			vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(
				mockJobRole
			);

			const req = createMockRequest(
				{ id: "1" },
				{},
				undefined,
				{},
				{
					user: {
						id: "123",
						username: "johndoe",
						user_type: "User",
						email: "john.doe@example.com",
					},
				}
			) as Request;

			const res = createMockResponse() as Response;

			await controller.getApplicationForm(req, res);

			expect(res.render).toHaveBeenCalledWith("job-application-form.njk", {
				jobRole: mockJobRole,
				user: {
					name: "johndoe",
					email: "john.doe@example.com",
				},
			});
		});

		it("should handle users with missing or falsy name properties gracefully", async () => {
			const mockJobRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Software Engineer",
				description: "Test description",
				responsibilities: "Test responsibilities",
				jobSpecLink: "http://example.com",
				location: "Belfast",
				capability: "Engineering",
				band: "Band 1",
				closingDate: "2025-12-31",
				status: "Open",
				numberOfOpenPositions: 3,
			};

			vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(
				mockJobRole
			);

			// Test AuthUser with empty forename
			const reqWithEmptyForename = createMockRequest(
				{ id: "1" },
				{},
				undefined,
				{},
				{
					user: {
						userId: "123",
						email: "john.doe@example.com",
						forename: "", // Empty string
						surname: "Doe",
						role: "User",
					},
				}
			) as Request;

			const res1 = createMockResponse() as Response;
			await controller.getApplicationForm(reqWithEmptyForename, res1);

			expect(res1.render).toHaveBeenCalledWith("job-application-form.njk", {
				jobRole: mockJobRole,
				user: {
					name: "", // Should fall back to empty string, not "undefined Doe"
					email: "john.doe@example.com",
				},
			});

			// Test User with null username
			const reqWithNullUsername = createMockRequest(
				{ id: "1" },
				{},
				undefined,
				{},
				{
					user: {
						id: "123",
						username: null, // Null value
						user_type: "User",
						email: "john.doe@example.com",
					},
				}
			) as Request;

			const res2 = createMockResponse() as Response;
			await controller.getApplicationForm(reqWithNullUsername, res2);

			expect(res2.render).toHaveBeenCalledWith("job-application-form.njk", {
				jobRole: mockJobRole,
				user: {
					name: "", // Should fall back to empty string, not "null"
					email: "john.doe@example.com",
				},
			});
		});
	});

	describe("submitApplication", () => {
		const mockFile: Express.Multer.File = {
			fieldname: "cv",
			originalname: "resume.pdf",
			encoding: "7bit",
			mimetype: "application/pdf",
			buffer: Buffer.from("test"),
			size: 1024,
			stream: null as never,
			destination: "",
			filename: "",
			path: "",
		};

		it("should submit application successfully", async () => {
			const mockJobRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Software Engineer",
				description: "Test description",
				responsibilities: "Test responsibilities",
				jobSpecLink: "http://example.com",
				location: "Belfast",
				capability: "Engineering",
				band: "Band 1",
				closingDate: "2025-12-31",
				status: "Open",
				numberOfOpenPositions: 3,
			};

			const mockApplication: ApplicationResponse = {
				applicationId: 123,
				jobRoleId: 1,
				applicantName: "John Doe",
				applicantEmail: "john.doe@example.com",
				coverLetter: "I am very interested in this position...",
				status: "pending",
				submittedAt: "2025-10-09T10:00:00Z",
			};

			vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(
				mockJobRole
			);
			vi.mocked(mockApplicationService.submitApplication).mockResolvedValue(
				mockApplication
			);

			const mockBody = {
				applicantName: "John Doe",
				applicantEmail: "john.doe@example.com",
				coverLetter: "I am very interested in this position...",
			};

			const req = createMockRequest({ id: "1" }, mockBody, mockFile) as Request;
			const res = createMockResponse() as Response;

			await controller.submitApplication(req, res);

			expect(mockApplicationService.submitApplication).toHaveBeenCalledWith(
				1,
				"John Doe",
				"john.doe@example.com",
				"I am very interested in this position...",
				mockFile
			);
			expect(res.render).toHaveBeenCalledWith("application-success.njk", {
				application: mockApplication,
				jobRole: mockJobRole,
				isEdit: false,
			});
		});

		it("should return 400 if no file uploaded", async () => {
			const mockBody = {
				applicantName: "John Doe",
				applicantEmail: "john.doe@example.com",
				coverLetter: "I am very interested in this position...",
			};

			const req = createMockRequest({ id: "1" }, mockBody) as Request; // No file provided
			const res = createMockResponse() as Response;

			await controller.submitApplication(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message: expect.stringContaining("CV file is required"),
				errors: expect.any(Object),
			});
		});
		it("should return 500 on service error", async () => {
			const mockBody = {
				applicantName: "John Doe",
				applicantEmail: "john.doe@example.com",
				coverLetter: "I am very interested in this position...",
			};

			vi.mocked(mockJobRoleService.getJobRoleById).mockRejectedValue(
				new Error("Service error")
			);

			const req = createMockRequest({ id: "1" }, mockBody, mockFile) as Request;
			const res = createMockResponse() as Response;

			await controller.submitApplication(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message: expect.stringContaining("Service error"),
			});
		});

		it("should return 400 for missing applicant name", async () => {
			const mockBody = {
				applicantEmail: "john.doe@example.com",
				coverLetter: "I am very interested in this position...",
			}; // Missing applicantName

			const req = createMockRequest({ id: "1" }, mockBody, mockFile) as Request;
			const res = createMockResponse() as Response;

			await controller.submitApplication(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message: expect.stringContaining("Applicant name is required"),
				errors: expect.any(Object),
			});
		});

		it("should return 400 for invalid email", async () => {
			const mockBody = {
				applicantName: "John Doe",
				applicantEmail: "invalid-email", // Invalid email
				coverLetter: "I am very interested in this position...",
			};

			const req = createMockRequest({ id: "1" }, mockBody, mockFile) as Request;
			const res = createMockResponse() as Response;

			await controller.submitApplication(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message: expect.stringContaining("valid email address"),
				errors: expect.any(Object),
			});
		});

		it("should handle missing cover letter gracefully", async () => {
			const mockJobRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Software Engineer",
				description: "Test description",
				responsibilities: "Test responsibilities",
				jobSpecLink: "http://example.com",
				location: "Belfast",
				capability: "Engineering",
				band: "Band 1",
				closingDate: "2025-12-31",
				status: "Open",
				numberOfOpenPositions: 3,
			};

			const mockApplication: ApplicationResponse = {
				applicationId: 123,
				jobRoleId: 1,
				applicantName: "John Doe",
				applicantEmail: "john.doe@example.com",
				status: "pending",
				submittedAt: "2025-10-09T10:00:00Z",
			};

			const mockBody = {
				applicantName: "John Doe",
				applicantEmail: "john.doe@example.com",
				// No coverLetter provided
			};

			vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(
				mockJobRole
			);
			vi.mocked(mockApplicationService.submitApplication).mockResolvedValue(
				mockApplication
			);

			const req = createMockRequest({ id: "1" }, mockBody, mockFile) as Request;
			const res = createMockResponse() as Response;

			await controller.submitApplication(req, res);

			expect(mockApplicationService.submitApplication).toHaveBeenCalledWith(
				1,
				"John Doe",
				"john.doe@example.com",
				undefined, // coverLetter should be undefined
				mockFile
			);
			expect(res.render).toHaveBeenCalledWith("application-success.njk", {
				application: mockApplication,
				isEdit: false,
				jobRole: mockJobRole,
			});
		});
	});

	describe("getApplicants", () => {
		const mockJobRole: JobRoleDetailedResponse = {
			jobRoleId: 1,
			roleName: "Software Engineer",
			description: "Test description",
			responsibilities: "Test responsibilities",
			jobSpecLink: "http://example.com",
			location: "Belfast",
			capability: "Engineering",
			band: "Associate",
			status: "Open",
			numberOfOpenPositions: 5,
			closingDate: "2025-12-31",
		};

		const mockApplicantsResponse = {
			applicants: [
				{
					applicationId: 1,
					applicantName: "John Doe",
					applicantEmail: "john@example.com",
					coverLetter: "I am interested in this position...",
					resumeUrl: "https://example.com/resume1.pdf",
					status: "submitted",
					submittedAt: "2024-01-15T10:00:00Z",
					updatedAt: "2024-01-15T10:00:00Z",
				},
				{
					applicationId: 2,
					applicantName: "Jane Smith",
					applicantEmail: "jane@example.com",
					status: "reviewed",
					submittedAt: "2024-01-16T14:30:00Z",
				},
			],
			pagination: {
				currentPage: 1,
				totalPages: 1,
				totalApplicants: 2,
				applicantsPerPage: 10,
				hasNextPage: false,
				hasPreviousPage: false,
			},
			jobRole: {
				id: 1,
				roleName: "Software Engineer",
				status: "Open",
			},
		};

		it("should render applicants list successfully", async () => {
			const req = createMockRequest({ id: "1" }, {}, undefined, {});
			const res = createMockResponse();

			(
				mockJobRoleService.getJobRoleById as ReturnType<typeof vi.fn>
			).mockResolvedValue(mockJobRole);
			(
				mockApplicationService.getApplicantsByJobRole as ReturnType<
					typeof vi.fn
				>
			).mockResolvedValue(mockApplicantsResponse);

			await controller.getApplicants(req as Request, res as Response);

			expect(mockJobRoleService.getJobRoleById).toHaveBeenCalledWith(1);
			expect(
				mockApplicationService.getApplicantsByJobRole
			).toHaveBeenCalledWith(1, 1, 10);
			expect(res.render).toHaveBeenCalledWith("job-applicants-list.njk", {
				applicants: mockApplicantsResponse.applicants,
				pagination: mockApplicantsResponse.pagination,
				jobRole: mockApplicantsResponse.jobRole,
				currentPage: 1,
			});
		});

		it("should handle custom pagination parameters", async () => {
			const req = createMockRequest({ id: "1" }, {}, undefined, {
				page: "2",
				limit: "5",
			});
			const res = createMockResponse();

			(
				mockJobRoleService.getJobRoleById as ReturnType<typeof vi.fn>
			).mockResolvedValue(mockJobRole);
			(
				mockApplicationService.getApplicantsByJobRole as ReturnType<
					typeof vi.fn
				>
			).mockResolvedValue(mockApplicantsResponse);

			await controller.getApplicants(req as Request, res as Response);

			expect(
				mockApplicationService.getApplicantsByJobRole
			).toHaveBeenCalledWith(1, 2, 5);
		});

		it("should return 400 for invalid job role ID", async () => {
			const req = createMockRequest({ id: "invalid" }, {}, undefined, {});
			const res = createMockResponse();

			await controller.getApplicants(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message:
					"Invalid job role ID provided. Please provide a valid numeric ID.",
			});
		});

		it("should return 400 for invalid pagination parameters", async () => {
			const req = createMockRequest({ id: "1" }, {}, undefined, {
				page: "0",
				limit: "100",
			});
			const res = createMockResponse();

			await controller.getApplicants(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message: "Invalid pagination parameters.",
			});
		});

		it("should return 404 if job role not found", async () => {
			const req = createMockRequest({ id: "999" }, {}, undefined, {});
			const res = createMockResponse();

			(
				mockJobRoleService.getJobRoleById as ReturnType<typeof vi.fn>
			).mockResolvedValue(null);

			await controller.getApplicants(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message: "Job role not found.",
			});
		});

		it("should handle service errors gracefully", async () => {
			const req = createMockRequest({ id: "1" }, {}, undefined, {});
			const res = createMockResponse();

			(
				mockJobRoleService.getJobRoleById as ReturnType<typeof vi.fn>
			).mockResolvedValue(mockJobRole);
			(
				mockApplicationService.getApplicantsByJobRole as ReturnType<
					typeof vi.fn
				>
			).mockRejectedValue(new Error("Database connection failed"));

			await controller.getApplicants(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message: "Database connection failed",
			});
		});

		it("should handle backend connection errors", async () => {
			const req = createMockRequest({ id: "1" }, {}, undefined, {});
			const res = createMockResponse();

			(
				mockJobRoleService.getJobRoleById as ReturnType<typeof vi.fn>
			).mockResolvedValue(mockJobRole);
			(
				mockApplicationService.getApplicantsByJobRole as ReturnType<
					typeof vi.fn
				>
			).mockRejectedValue(new Error("Unable to connect to the backend API"));

			await controller.getApplicants(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message:
					"Backend service is currently unavailable. Please try again later.",
			});
		});

		it("should handle timeout errors", async () => {
			const req = createMockRequest({ id: "1" }, {}, undefined, {});
			const res = createMockResponse();

			(
				mockJobRoleService.getJobRoleById as ReturnType<typeof vi.fn>
			).mockResolvedValue(mockJobRole);
			(
				mockApplicationService.getApplicantsByJobRole as ReturnType<
					typeof vi.fn
				>
			).mockRejectedValue(new Error("Request timeout occurred"));

			await controller.getApplicants(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message: "Request timeout occurred. Please try again.",
			});
		});
	});
});
