/**
 * Tests for getUserApplications endpoint in ApplicationController
 */

import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ApplicationResponse } from "../models/application-request.js";
import type { ApplicationService } from "../services/application-service.js";
import type { JobRoleService } from "../services/job-role-service.js";
import { ApplicationController } from "./application-controller.js";

describe("ApplicationController - getUserApplications", () => {
	let applicationController: ApplicationController;
	let mockApplicationService: ApplicationService;
	let mockJobRoleService: JobRoleService;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;

	const mockApplications: ApplicationResponse[] = [
		{
			applicationId: 1,
			jobRoleId: 101,
			applicantName: "John Doe",
			applicantEmail: "john@example.com",
			status: "pending",
			submittedAt: "2025-10-20T10:00:00Z",
			coverLetter: "I am interested in this role",
			resumeUrl: "http://backend/cv/1",
		},
		{
			applicationId: 2,
			jobRoleId: 102,
			applicantName: "John Doe",
			applicantEmail: "john@example.com",
			status: "accepted",
			submittedAt: "2025-10-15T14:30:00Z",
		},
	];

	beforeEach(() => {
		// Mock ApplicationService
		mockApplicationService = {
			submitApplication: vi.fn(),
			getApplicantsByJobRole: vi.fn(),
			downloadApplicationCv: vi.fn(),
			getUserApplications: vi.fn(),
		};

		// Mock JobRoleService
		mockJobRoleService = {
			getJobRoles: vi.fn(),
			getJobRoleById: vi.fn(),
			createJobRole: vi.fn(),
			updateJobRole: vi.fn(),
			deleteJobRole: vi.fn(),
			searchJobRoles: vi.fn(),
		};

		applicationController = new ApplicationController(
			mockApplicationService,
			mockJobRoleService
		);

		// Mock Request
		mockRequest = {
			session: {
				isAuthenticated: true,
				user: {
					email: "john@example.com",
					username: "johndoe",
				},
			},
			query: {},
		};

		// Mock Response
		mockResponse = {
			render: vi.fn(),
			redirect: vi.fn(),
			status: vi.fn().mockReturnThis(),
		};
	});

	describe("Authentication checks", () => {
		it("should redirect to login if user is not authenticated", async () => {
			mockRequest.session = { isAuthenticated: false };

			await applicationController.getUserApplications(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockResponse.redirect).toHaveBeenCalledWith("/login");
		});

		it("should redirect to login if user object is missing", async () => {
			mockRequest.session = { isAuthenticated: true };

			await applicationController.getUserApplications(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockResponse.redirect).toHaveBeenCalledWith("/login");
		});

		it("should render error if user email is missing", async () => {
			mockRequest.session = {
				isAuthenticated: true,
				user: { username: "johndoe" },
			};

			await applicationController.getUserApplications(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.render).toHaveBeenCalledWith("error.njk", {
				message: "User email not found in session. Please log in again.",
			});
		});
	});

	describe("Fetching applications", () => {
		it("should successfully fetch and render user applications", async () => {
			vi.mocked(mockApplicationService.getUserApplications).mockResolvedValue(
				mockApplications
			);

			await applicationController.getUserApplications(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockApplicationService.getUserApplications).toHaveBeenCalledWith(
				"john@example.com"
			);
			expect(mockResponse.render).toHaveBeenCalledWith("my-applications.njk", {
				applications: mockApplications,
				statusFilter: "",
				searchQuery: "",
				sortBy: "date-desc",
			});
		});

		it("should handle empty applications list", async () => {
			vi.mocked(mockApplicationService.getUserApplications).mockResolvedValue(
				[]
			);

			await applicationController.getUserApplications(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockResponse.render).toHaveBeenCalledWith("my-applications.njk", {
				applications: [],
				statusFilter: "",
				searchQuery: "",
				sortBy: "date-desc",
			});
		});

		it("should handle service errors gracefully", async () => {
			vi.mocked(mockApplicationService.getUserApplications).mockRejectedValue(
				new Error("Backend connection failed")
			);

			await applicationController.getUserApplications(
				mockRequest as Request,
				mockResponse as Response
			);

			// Should render with empty applications on error
			expect(mockResponse.render).toHaveBeenCalledWith("my-applications.njk", {
				applications: [],
				statusFilter: "",
				searchQuery: "",
				sortBy: "date-desc",
			});
		});
	});

	describe("Filtering and sorting", () => {
		beforeEach(() => {
			vi.mocked(mockApplicationService.getUserApplications).mockResolvedValue(
				mockApplications
			);
		});

		it("should filter applications by status", async () => {
			mockRequest.query = { status: "pending" };

			await applicationController.getUserApplications(
				mockRequest as Request,
				mockResponse as Response
			);

			const renderCall = vi.mocked(mockResponse.render).mock.calls[0];
			const renderedData = renderCall?.[1] as {
				applications: ApplicationResponse[];
			};

			expect(renderedData.applications).toHaveLength(1);
			expect(renderedData.applications[0]?.status).toBe("pending");
		});

		it("should filter applications by search query", async () => {
			mockRequest.query = { search: "1" };

			await applicationController.getUserApplications(
				mockRequest as Request,
				mockResponse as Response
			);

			const renderCall = vi.mocked(mockResponse.render).mock.calls[0];
			const renderedData = renderCall?.[1] as {
				applications: ApplicationResponse[];
			};

			expect(renderedData.applications).toHaveLength(1);
			expect(renderedData.applications[0]?.applicationId).toBe(1);
		});

		it("should sort applications by date descending (newest first)", async () => {
			mockRequest.query = { sort: "date-desc" };

			await applicationController.getUserApplications(
				mockRequest as Request,
				mockResponse as Response
			);

			const renderCall = vi.mocked(mockResponse.render).mock.calls[0];
			const renderedData = renderCall?.[1] as {
				applications: ApplicationResponse[];
			};

			expect(renderedData.applications[0]?.applicationId).toBe(1); // Oct 20
			expect(renderedData.applications[1]?.applicationId).toBe(2); // Oct 15
		});

		it("should sort applications by date ascending (oldest first)", async () => {
			mockRequest.query = { sort: "date-asc" };

			await applicationController.getUserApplications(
				mockRequest as Request,
				mockResponse as Response
			);

			const renderCall = vi.mocked(mockResponse.render).mock.calls[0];
			const renderedData = renderCall?.[1] as {
				applications: ApplicationResponse[];
			};

			expect(renderedData.applications[0]?.applicationId).toBe(2); // Oct 15
			expect(renderedData.applications[1]?.applicationId).toBe(1); // Oct 20
		});

		it("should sort applications by status", async () => {
			mockRequest.query = { sort: "status" };

			await applicationController.getUserApplications(
				mockRequest as Request,
				mockResponse as Response
			);

			const renderCall = vi.mocked(mockResponse.render).mock.calls[0];
			const renderedData = renderCall?.[1] as {
				applications: ApplicationResponse[];
			};

			// "accepted" comes before "pending" alphabetically
			expect(renderedData.applications[0]?.status).toBe("accepted");
			expect(renderedData.applications[1]?.status).toBe("pending");
		});
	});

	describe("Query parameters", () => {
		beforeEach(() => {
			vi.mocked(mockApplicationService.getUserApplications).mockResolvedValue(
				mockApplications
			);
		});

		it("should handle all query parameters together", async () => {
			mockRequest.query = {
				status: "pending",
				search: "1",
				sort: "date-desc",
			};

			await applicationController.getUserApplications(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockResponse.render).toHaveBeenCalledWith(
				"my-applications.njk",
				expect.objectContaining({
					statusFilter: "pending",
					searchQuery: "1",
					sortBy: "date-desc",
				})
			);
		});

		it("should use default values when query parameters are missing", async () => {
			mockRequest.query = {};

			await applicationController.getUserApplications(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockResponse.render).toHaveBeenCalledWith(
				"my-applications.njk",
				expect.objectContaining({
					statusFilter: "",
					searchQuery: "",
					sortBy: "date-desc",
				})
			);
		});
	});
});
