/**
 * Tests for Job Role Controller
 */

import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobRoleController } from "../controllers/job-role-controller";
import type { JobRoleResponse } from "../models/job-role-response";
import type { JobRoleService } from "../services/job-role-service";
import { JobRoleValidator } from "../utils/job-role-validator";

// Mock JobRoleService
const mockJobRoleService: JobRoleService = {
	getJobRoles: vi.fn(),
	getJobRoleById: vi.fn(),
	createJobRole: vi.fn(),
	deleteJobRole: vi.fn(),
};

// Mock JobRoleValidator
const mockJobRoleValidator = new JobRoleValidator();

// Mock Express Response
const mockResponse = () => {
	const res = {} as Response;
	res.render = vi.fn().mockReturnValue(res);
	res.status = vi.fn().mockReturnValue(res);
	return res;
};

// Mock Express Request
const mockRequest = () => ({}) as Request;

describe("JobRoleController", () => {
	let controller: JobRoleController;
	let req: Request;
	let res: Response;

	beforeEach(() => {
		controller = new JobRoleController(
			mockJobRoleService,
			mockJobRoleValidator
		);
		req = mockRequest();
		res = mockResponse();
		vi.clearAllMocks();
	});

	describe("getJobRoles", () => {
		it("should render job-role-list view with job roles data", async () => {
			const mockJobRoles: JobRoleResponse[] = [
				{
					jobRoleId: 1,
					roleName: "Software Engineer",
					location: "Belfast",
					capability: "Engineering",
					band: "Senior",
					closingDate: "2024-12-31",
				},
				{
					jobRoleId: 2,
					roleName: "UX Designer",
					location: "London",
					capability: "Design",
					band: "Mid-Level",
					closingDate: "2024-11-30",
				},
			];

			vi.mocked(mockJobRoleService.getJobRoles).mockResolvedValue(mockJobRoles);

			await controller.getJobRoles(req, res);

			expect(mockJobRoleService.getJobRoles).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith("job-role-list.njk", {
				jobRoles: mockJobRoles,
				totalRoles: 2,
			});
		});

		it("should render job-role-list view with empty array when no job roles", async () => {
			const mockJobRoles: JobRoleResponse[] = [];

			vi.mocked(mockJobRoleService.getJobRoles).mockResolvedValue(mockJobRoles);

			await controller.getJobRoles(req, res);

			expect(mockJobRoleService.getJobRoles).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith("job-role-list.njk", {
				jobRoles: [],
				totalRoles: 0,
			});
		});

		it("should render error view when service throws an error", async () => {
			const mockError = new Error("Service unavailable");
			vi.mocked(mockJobRoleService.getJobRoles).mockRejectedValue(mockError);

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			await controller.getJobRoles(req, res);

			expect(mockJobRoleService.getJobRoles).toHaveBeenCalledTimes(1);
			expect(consoleSpy).toHaveBeenCalledWith(
				"Error in JobRoleController.getJobRoles:",
				mockError
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message:
					"Sorry, we couldn't load the job roles at this time. Please try again later.",
			});

			consoleSpy.mockRestore();
		});

		it("should handle service returning large number of job roles", async () => {
			// Create a large array of job roles
			const mockJobRoles: JobRoleResponse[] = Array.from(
				{ length: 100 },
				(_, i) => ({
					jobRoleId: i + 1,
					roleName: `Role ${i + 1}`,
					location: i % 2 === 0 ? "Belfast" : "London",
					capability: "Engineering",
					band: "Senior",
					closingDate: "2024-12-31",
				})
			);

			vi.mocked(mockJobRoleService.getJobRoles).mockResolvedValue(mockJobRoles);

			await controller.getJobRoles(req, res);

			expect(mockJobRoleService.getJobRoles).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith("job-role-list.njk", {
				jobRoles: mockJobRoles,
				totalRoles: 100,
			});
		});

		it("should handle service timeout/network errors gracefully", async () => {
			const timeoutError = new Error("ETIMEDOUT");
			vi.mocked(mockJobRoleService.getJobRoles).mockRejectedValue(timeoutError);

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			await controller.getJobRoles(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.render).toHaveBeenCalledWith("error.njk", {
				message:
					"Sorry, we couldn't load the job roles at this time. Please try again later.",
			});

			consoleSpy.mockRestore();
		});
	});

	describe("constructor", () => {
		it("should create controller with provided service and validator", () => {
			const testService = {
				getJobRoles: vi.fn(),
				getJobRoleById: vi.fn(),
				createJobRole: vi.fn(),
				deleteJobRole: vi.fn(),
			} as JobRoleService;
			const testValidator = new JobRoleValidator();
			const testController = new JobRoleController(testService, testValidator);

			expect(testController).toBeInstanceOf(JobRoleController);
		});
	});

	describe("deleteJobRole", () => {
		beforeEach(() => {
			res.json = vi.fn().mockReturnValue(res);
		});

		it("should delete job role successfully with valid ID", async () => {
			const mockReq = {
				params: { id: "123" },
			} as unknown as Request;

			vi.mocked(mockJobRoleService.deleteJobRole).mockResolvedValue(true);

			await controller.deleteJobRole(mockReq, res);

			expect(mockJobRoleService.deleteJobRole).toHaveBeenCalledWith(123);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: "Job role deleted successfully.",
			});
		});

		it("should return 400 error for invalid job role ID", async () => {
			const mockReq = {
				params: { id: "invalid" },
			} as unknown as Request;

			await controller.deleteJobRole(mockReq, res);

			expect(mockJobRoleService.deleteJobRole).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message:
					"Invalid job role ID provided. Please provide a valid numeric ID.",
			});
		});

		it("should return 400 error for negative job role ID", async () => {
			const mockReq = {
				params: { id: "-1" },
			} as unknown as Request;

			await controller.deleteJobRole(mockReq, res);

			expect(mockJobRoleService.deleteJobRole).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message:
					"Invalid job role ID provided. Please provide a valid numeric ID.",
			});
		});

		it("should return 404 error when job role not found", async () => {
			const mockReq = {
				params: { id: "999" },
			} as unknown as Request;

			vi.mocked(mockJobRoleService.deleteJobRole).mockResolvedValue(false);

			await controller.deleteJobRole(mockReq, res);

			expect(mockJobRoleService.deleteJobRole).toHaveBeenCalledWith(999);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message: "Job role not found or could not be deleted.",
			});
		});

		it("should handle service errors gracefully", async () => {
			const mockReq = {
				params: { id: "123" },
			} as unknown as Request;

			const mockError = new Error("Database connection failed");
			vi.mocked(mockJobRoleService.deleteJobRole).mockRejectedValue(mockError);

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			await controller.deleteJobRole(mockReq, res);

			expect(consoleSpy).toHaveBeenCalledWith(
				"Error in JobRoleController.deleteJobRole:",
				mockError
			);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message:
					"Sorry, we couldn't delete the job role at this time. Please try again later.",
			});

			consoleSpy.mockRestore();
		});

		it("should handle missing params object", async () => {
			const mockReq = {
				params: {},
			} as unknown as Request;

			await controller.deleteJobRole(mockReq, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				success: false,
				message:
					"Invalid job role ID provided. Please provide a valid numeric ID.",
			});
		});
	});
});
