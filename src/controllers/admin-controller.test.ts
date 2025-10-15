/**
 * Test suite for AdminController
 */

import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { JobRoleDetailedResponse } from "../models/job-role-detailed-response.js";
import type { JobRoleService } from "../services/job-role-service.js";
import { JobRoleValidator } from "../utils/job-role-validator.js";
import { AdminController } from "./admin-controller.js";

describe("AdminController", () => {
	let adminController: AdminController;
	let mockJobRoleService: JobRoleService;
	let mockReq: Partial<Request>;
	let mockRes: Partial<Response>;

	beforeEach(() => {
		// Create mock service with vi.fn()
		mockJobRoleService = {
			getJobRoles: vi.fn(),
			getJobRoleById: vi.fn(),
			createJobRole: vi.fn(),
			getJobRolesPaginated: vi.fn(),
			deleteJobRole: vi.fn(),
			updateJobRole: vi.fn(),
		};

		// Create real validator for testing
		const jobRoleValidator = new JobRoleValidator();

		// Create controller instance
		adminController = new AdminController(mockJobRoleService, jobRoleValidator);

		// Mock request and response
		mockReq = {
			body: {},
			params: {},
		};

		mockRes = {
			render: vi.fn(),
			redirect: vi.fn(),
			status: vi.fn().mockReturnThis(),
		};
	});

	describe("getCreateJobRole", () => {
		it("should render job-role-create.njk template", () => {
			adminController.getCreateJobRole(mockReq as Request, mockRes as Response);

			expect(mockRes.render).toHaveBeenCalledWith("job-role-create.njk");
		});

		it("should be called without errors", () => {
			expect(() => {
				adminController.getCreateJobRole(
					mockReq as Request,
					mockRes as Response
				);
			}).not.toThrow();
		});
	});

	describe("createJobRole", () => {
		// Use a future date that won't fail validation
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 60); // 60 days in future
		const futureDateString = futureDate.toISOString().split("T")[0];

		const validFormData = {
			roleName: "Senior Software Engineer",
			description: "We are looking for an experienced software engineer",
			responsibilities:
				"Design and develop scalable applications, mentor junior developers",
			jobSpecLink: "https://sharepoint.example.com/job-spec",
			location: "Belfast, Northern Ireland",
			capability: "Engineering",
			band: "Senior",
			closingDate: futureDateString as string,
			numberOfOpenPositions: "5",
		};

		it("should create a job role with valid data and status set to Open", async () => {
			mockReq.body = validFormData;

			const mockCreatedRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Senior Software Engineer",
				description: "We are looking for an experienced software engineer",
				responsibilities:
					"Design and develop scalable applications, mentor junior developers",
				jobSpecLink: "https://sharepoint.example.com/job-spec",
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: futureDateString,
				status: "Open",
				numberOfOpenPositions: 5,
			};

			vi.mocked(mockJobRoleService.createJobRole).mockResolvedValue(
				mockCreatedRole
			);

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockJobRoleService.createJobRole).toHaveBeenCalledWith({
				roleName: "Senior Software Engineer",
				description: "We are looking for an experienced software engineer",
				responsibilities:
					"Design and develop scalable applications, mentor junior developers",
				jobSpecLink: "https://sharepoint.example.com/job-spec",
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: futureDateString,
				status: "Open", // Status should always be "Open"
				numberOfOpenPositions: 5,
			});

			expect(mockRes.redirect).toHaveBeenCalledWith(
				"/job-roles/1?created=true"
			);
		});

		it("should render error for missing required fields", async () => {
			mockReq.body = {
				roleName: "",
				description: "",
			};

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.render).toHaveBeenCalledWith("job-role-create.njk", {
				error: "All fields are required. Please fill in all information.",
				formData: mockReq.body,
			});
		});

		it("should render error for invalid location", async () => {
			mockReq.body = {
				...validFormData,
				location: "InvalidLocation",
			};

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.render).toHaveBeenCalled();
			expect(mockJobRoleService.createJobRole).not.toHaveBeenCalled();
		});

		it("should render error for invalid capability", async () => {
			mockReq.body = {
				...validFormData,
				capability: "InvalidCapability",
			};

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.render).toHaveBeenCalled();
			expect(mockJobRoleService.createJobRole).not.toHaveBeenCalled();
		});

		it("should render error for invalid band", async () => {
			mockReq.body = {
				...validFormData,
				band: "InvalidBand",
			};

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.render).toHaveBeenCalled();
			expect(mockJobRoleService.createJobRole).not.toHaveBeenCalled();
		});

		it("should render error for invalid number of positions", async () => {
			mockReq.body = {
				...validFormData,
				numberOfOpenPositions: "0",
			};

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.render).toHaveBeenCalled();
			expect(mockJobRoleService.createJobRole).not.toHaveBeenCalled();
		});

		it("should render error for invalid job spec link", async () => {
			mockReq.body = {
				...validFormData,
				jobSpecLink: "not-a-valid-url",
			};

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.render).toHaveBeenCalled();
			expect(mockJobRoleService.createJobRole).not.toHaveBeenCalled();
		});

		it("should render error for short role name", async () => {
			mockReq.body = {
				...validFormData,
				roleName: "ab", // Less than 3 characters
			};

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.render).toHaveBeenCalled();
			expect(mockJobRoleService.createJobRole).not.toHaveBeenCalled();
		});

		it("should render error for short description", async () => {
			mockReq.body = {
				...validFormData,
				description: "short", // Less than 10 characters
			};

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.render).toHaveBeenCalled();
			expect(mockJobRoleService.createJobRole).not.toHaveBeenCalled();
		});

		it("should render error for past closing date", async () => {
			mockReq.body = {
				...validFormData,
				closingDate: "2020-01-01", // Past date
			};

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.render).toHaveBeenCalled();
			expect(mockJobRoleService.createJobRole).not.toHaveBeenCalled();
		});

		it("should trim whitespace from all string fields", async () => {
			mockReq.body = {
				roleName: "  Senior Software Engineer  ",
				description: "  We are looking for an experienced software engineer  ",
				responsibilities:
					"  Design and develop scalable applications, mentor junior developers  ",
				jobSpecLink: "  https://sharepoint.example.com/job-spec  ",
				location: "  Belfast, Northern Ireland  ",
				capability: "  Engineering  ",
				band: "  Senior  ",
				closingDate: `  ${futureDateString}  `,
				numberOfOpenPositions: "5",
			};

			const mockCreatedRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Senior Software Engineer",
				description: "We are looking for an experienced software engineer",
				responsibilities:
					"Design and develop scalable applications, mentor junior developers",
				jobSpecLink: "https://sharepoint.example.com/job-spec",
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: futureDateString,
				status: "Open",
				numberOfOpenPositions: 5,
			};

			vi.mocked(mockJobRoleService.createJobRole).mockResolvedValue(
				mockCreatedRole
			);

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockJobRoleService.createJobRole).toHaveBeenCalledWith({
				roleName: "Senior Software Engineer",
				description: "We are looking for an experienced software engineer",
				responsibilities:
					"Design and develop scalable applications, mentor junior developers",
				jobSpecLink: "https://sharepoint.example.com/job-spec",
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: futureDateString,
				status: "Open",
				numberOfOpenPositions: 5,
			});
		});

		it("should handle service errors gracefully", async () => {
			mockReq.body = validFormData;

			vi.mocked(mockJobRoleService.createJobRole).mockRejectedValue(
				new Error("Database connection failed")
			);

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.render).toHaveBeenCalledWith("job-role-create.njk", {
				error:
					"Sorry, we couldn't create the job role at this time. Please try again later.",
				formData: mockReq.body,
			});
		});

		it("should parse numberOfOpenPositions as integer", async () => {
			mockReq.body = {
				...validFormData,
				numberOfOpenPositions: "10",
			};

			const mockCreatedRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Senior Software Engineer",
				description: "We are looking for an experienced software engineer",
				responsibilities:
					"Design and develop scalable applications, mentor junior developers",
				jobSpecLink: "https://sharepoint.example.com/job-spec",
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: futureDateString,
				status: "Open",
				numberOfOpenPositions: 10,
			};

			vi.mocked(mockJobRoleService.createJobRole).mockResolvedValue(
				mockCreatedRole
			);

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			const createCall = vi.mocked(mockJobRoleService.createJobRole).mock
				.calls[0][0];
			expect(createCall.numberOfOpenPositions).toBe(10);
			expect(typeof createCall.numberOfOpenPositions).toBe("number");
		});

		it("should always set status to Open regardless of input", async () => {
			mockReq.body = {
				...validFormData,
				status: "Closed", // Try to set a different status
			};

			const mockCreatedRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Senior Software Engineer",
				description: "We are looking for an experienced software engineer",
				responsibilities:
					"Design and develop scalable applications, mentor junior developers",
				jobSpecLink: "https://sharepoint.example.com/job-spec",
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: futureDateString,
				status: "Open",
				numberOfOpenPositions: 5,
			};

			vi.mocked(mockJobRoleService.createJobRole).mockResolvedValue(
				mockCreatedRole
			);

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			const createCall = vi.mocked(mockJobRoleService.createJobRole).mock
				.calls[0][0];
			expect(createCall.status).toBe("Open");
		});

		it("should pass formData back to template on validation error", async () => {
			const invalidData = {
				roleName: "ab", // Too short
				description: "test",
				responsibilities: "test",
				jobSpecLink: "https://example.com",
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: futureDateString,
				numberOfOpenPositions: "5",
			};

			mockReq.body = invalidData;

			await adminController.createJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.render).toHaveBeenCalledWith(
				"job-role-create.njk",
				expect.objectContaining({
					formData: invalidData,
				})
			);
		});
	});

	describe("getEditJobRole", () => {
		it("should render job-role-edit.njk with job role data", async () => {
			const mockJobRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Senior Software Engineer",
				description: "Lead development projects",
				responsibilities: "Develop and mentor",
				jobSpecLink: "https://example.com/spec",
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: "2025-12-31",
				status: "Open",
				numberOfOpenPositions: 2,
			};

			mockReq.params = { id: "1" };
			vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(
				mockJobRole
			);

			await adminController.getEditJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockJobRoleService.getJobRoleById).toHaveBeenCalledWith(1);
			expect(mockRes.render).toHaveBeenCalledWith("job-role-edit.njk", {
				jobRole: mockJobRole,
			});
		});

		it("should return 400 for invalid job role ID", async () => {
			mockReq.params = { id: "invalid" };

			await adminController.getEditJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.render).toHaveBeenCalledWith(
				"error.njk",
				expect.objectContaining({
					message: expect.stringContaining("Invalid job role ID"),
				})
			);
		});

		it("should return 404 when job role not found", async () => {
			mockReq.params = { id: "999" };
			vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(null);

			await adminController.getEditJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.render).toHaveBeenCalledWith(
				"error.njk",
				expect.objectContaining({
					message: expect.stringContaining("Job role not found"),
				})
			);
		});

		it("should handle service errors gracefully", async () => {
			mockReq.params = { id: "1" };
			vi.mocked(mockJobRoleService.getJobRoleById).mockRejectedValue(
				new Error("Database error")
			);

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			await adminController.getEditJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.render).toHaveBeenCalledWith(
				"error.njk",
				expect.objectContaining({
					message: expect.stringContaining(
						"couldn't load the job role for editing"
					),
				})
			);

			consoleSpy.mockRestore();
		});
	});

	describe("updateJobRole", () => {
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 60);
		const futureDateString = futureDate.toISOString().split("T")[0];

		const validUpdateData = {
			roleName: "Updated Senior Software Engineer",
			description: "Updated description for the role",
			responsibilities: "Updated responsibilities and duties",
			jobSpecLink: "https://sharepoint.example.com/updated-spec",
			location: "Dublin, Ireland",
			capability: "Engineering",
			band: "Senior",
			closingDate: futureDateString as string,
			status: "Open",
			numberOfOpenPositions: "3",
		};

		it("should update a job role with valid data", async () => {
			mockReq.params = { id: "1" };
			mockReq.body = validUpdateData;

			const mockUpdatedRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Updated Senior Software Engineer",
				description: "Updated description for the role",
				responsibilities: "Updated responsibilities and duties",
				jobSpecLink: "https://sharepoint.example.com/updated-spec",
				location: "Dublin, Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: futureDateString,
				status: "Open",
				numberOfOpenPositions: 3,
			};

			vi.mocked(mockJobRoleService.updateJobRole).mockResolvedValue(
				mockUpdatedRole
			);

			await adminController.updateJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockJobRoleService.updateJobRole).toHaveBeenCalledWith(
				1,
				expect.objectContaining({
					roleName: "Updated Senior Software Engineer",
					status: "Open",
					numberOfOpenPositions: 3,
				})
			);
			expect(mockRes.redirect).toHaveBeenCalledWith(
				"/job-roles/1?updated=true"
			);
		});

		it("should return 400 for invalid job role ID", async () => {
			mockReq.params = { id: "invalid" };
			mockReq.body = validUpdateData;

			await adminController.updateJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.render).toHaveBeenCalledWith(
				"error.njk",
				expect.objectContaining({
					message: expect.stringContaining("Invalid job role ID"),
				})
			);
		});

		it("should render edit form with error for invalid data", async () => {
			const invalidData = {
				...validUpdateData,
				roleName: "ab", // Too short
			};

			mockReq.params = { id: "1" };
			mockReq.body = invalidData;

			const mockJobRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Original Name",
				description: "Original description",
				responsibilities: "Original responsibilities",
				jobSpecLink: "https://example.com/spec",
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: "2025-12-31",
				status: "Open",
				numberOfOpenPositions: 2,
			};

			vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(
				mockJobRole
			);

			await adminController.updateJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.render).toHaveBeenCalledWith(
				"job-role-edit.njk",
				expect.objectContaining({
					error: expect.stringContaining("at least 3 characters"),
					jobRole: mockJobRole,
				})
			);
		});

		it("should handle service errors gracefully", async () => {
			mockReq.params = { id: "1" };
			mockReq.body = validUpdateData;

			vi.mocked(mockJobRoleService.updateJobRole).mockRejectedValue(
				new Error("Database error")
			);
			vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(null);

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			await adminController.updateJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.render).toHaveBeenCalledWith(
				"job-role-edit.njk",
				expect.objectContaining({
					error: expect.stringContaining("couldn't update the job role"),
				})
			);

			consoleSpy.mockRestore();
		});

		it("should allow status to be changed from Open to Closed", async () => {
			const dataWithClosedStatus = {
				...validUpdateData,
				status: "Closed",
			};

			mockReq.params = { id: "1" };
			mockReq.body = dataWithClosedStatus;

			const mockUpdatedRole: JobRoleDetailedResponse = {
				jobRoleId: 1,
				roleName: "Updated Senior Software Engineer",
				description: "Updated description",
				responsibilities: "Updated responsibilities",
				jobSpecLink: "https://sharepoint.example.com/spec",
				location: "Dublin, Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: futureDateString,
				status: "Closed",
				numberOfOpenPositions: 3,
			};

			vi.mocked(mockJobRoleService.updateJobRole).mockResolvedValue(
				mockUpdatedRole
			);

			await adminController.updateJobRole(
				mockReq as Request,
				mockRes as Response
			);

			expect(mockJobRoleService.updateJobRole).toHaveBeenCalledWith(
				1,
				expect.objectContaining({
					status: "Closed",
				})
			);
			expect(mockRes.redirect).toHaveBeenCalledWith(
				"/job-roles/1?updated=true"
			);
		});
	});
});
