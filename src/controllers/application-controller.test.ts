/**
 * Application Controller Tests
 */

import { describe, expect, it, beforeEach, vi } from "vitest";
import type { Request, Response } from "express";
import { ApplicationController } from "./application-controller.js";
import type { ApplicationService } from "../services/application-service.js";
import type { JobRoleService } from "../services/job-role-service.js";
import type { ApplicationResponse } from "../models/application-request.js";
import type { JobRoleDetailedResponse } from "../models/job-role-detailed-response.js";

// Mock services
const mockApplicationService: ApplicationService = {
	submitApplication: vi.fn(),
};

const mockJobRoleService: JobRoleService = {
	getJobRoles: vi.fn(),
	getJobRoleById: vi.fn(),
};

// Mock Express Request and Response
const createMockRequest = (
	params = {},
	file?: Express.Multer.File
): Partial<Request> => ({
	params,
	file,
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
				status: "Active",
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
				status: "Active",
				numberOfOpenPositions: 3,
			};

			const mockApplication: ApplicationResponse = {
				applicationId: 123,
				jobRoleId: 1,
				status: "In Progress",
				submittedAt: "2025-10-09T10:00:00Z",
			};

			vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(
				mockJobRole
			);
			vi.mocked(mockApplicationService.submitApplication).mockResolvedValue(
				mockApplication
			);

			const req = createMockRequest({ id: "1" }, mockFile) as Request;
			const res = createMockResponse() as Response;

			await controller.submitApplication(req, res);

			expect(mockApplicationService.submitApplication).toHaveBeenCalledWith(
				1,
				mockFile
			);
			expect(res.render).toHaveBeenCalledWith("application-success.njk", {
				application: mockApplication,
				jobRole: mockJobRole,
			});
		});

		it("should return 400 if no file uploaded", async () => {
			const req = createMockRequest({ id: "1" }) as Request;
			const res = createMockResponse() as Response;

			await controller.submitApplication(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message: expect.stringContaining("upload your CV"),
			});
		});

		it("should return 500 on service error", async () => {
			vi.mocked(mockJobRoleService.getJobRoleById).mockRejectedValue(
				new Error("Service error")
			);

			const req = createMockRequest({ id: "1" }, mockFile) as Request;
			const res = createMockResponse() as Response;

			await controller.submitApplication(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message: expect.stringContaining("couldn't submit your application"),
			});
		});
	});
});
