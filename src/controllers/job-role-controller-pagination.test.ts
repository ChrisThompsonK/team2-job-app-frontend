/**
 * Tests for JobRoleController pagination functionality
 */

import type { Request, Response } from "express";
import {
	beforeEach,
	describe,
	expect,
	it,
	type MockedFunction,
	vi,
} from "vitest";
import { JobRoleController } from "../controllers/job-role-controller.js";
import type { JobRoleResponse } from "../models/job-role-response.js";
import type { PaginatedResponse } from "../models/pagination.js";
import type { JobRoleService } from "../services/job-role-service.js";

// Mock the validation utility
vi.mock("../utils/pagination-validation.js", () => ({
	validatePaginationParams: vi.fn(),
}));

// Import the mocked function with proper typing
import { validatePaginationParams } from "../utils/pagination-validation.js";

const mockedValidatePaginationParams =
	validatePaginationParams as MockedFunction<typeof validatePaginationParams>;

describe("JobRoleController - Pagination", () => {
	let controller: JobRoleController;
	let mockJobRoleService: JobRoleService;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;

	const mockPaginatedResponse: PaginatedResponse<JobRoleResponse> = {
		data: [
			{
				jobRoleId: 1,
				roleName: "Software Engineer",
				location: "Belfast",
				capability: "Technology",
				band: "Consultant",
				closingDate: "2024-12-31",
			},
			{
				jobRoleId: 2,
				roleName: "Data Analyst",
				location: "London",
				capability: "Data",
				band: "Associate",
				closingDate: "2024-11-30",
			},
		],
		pagination: {
			currentPage: 1,
			totalPages: 5,
			totalCount: 50,
			limit: 12,
			hasNext: true,
			hasPrevious: false,
		},
	};

	beforeEach(() => {
		// Mock the job role service
		mockJobRoleService = {
			getJobRoles: vi.fn(),
			getJobRolesPaginated: vi.fn().mockResolvedValue(mockPaginatedResponse),
			getJobRoleById: vi.fn(),
			createJobRole: vi.fn(),
			deleteJobRole: vi.fn(),
			updateJobRole: vi.fn(),
			searchJobRoles: vi.fn(),
			getFilterOptions: vi.fn().mockResolvedValue({
				capabilities: ["Engineering", "Analytics"],
				locations: ["Belfast, Northern Ireland", "London, England"],
				bands: ["Junior", "Mid", "Senior"],
			}),
		};

		// Create controller instance
		controller = new JobRoleController(mockJobRoleService);

		// Mock Express request and response
		mockRequest = {
			query: {},
			path: "/job-roles",
		};

		mockResponse = {
			render: vi.fn(),
			status: vi.fn().mockReturnThis(),
		};

		// Reset all mocks
		vi.clearAllMocks();
	});

	describe("successful pagination", () => {
		it("should handle valid pagination parameters", async () => {
			// Setup
			mockRequest.query = { page: "1", limit: "12" };
			mockedValidatePaginationParams.mockReturnValue({
				isValid: true,
				page: 1,
				limit: 12,
			});
			(
				mockJobRoleService.getJobRolesPaginated as ReturnType<typeof vi.fn>
			).mockResolvedValue(mockPaginatedResponse);

			// Execute
			await controller.getJobRoles(
				mockRequest as Request,
				mockResponse as Response
			);

			// Verify
			expect(validatePaginationParams).toHaveBeenCalledWith("1", "12");
			expect(mockJobRoleService.getFilterOptions).toHaveBeenCalled();
			expect(mockJobRoleService.getJobRolesPaginated).toHaveBeenCalledWith({
				page: 1,
				limit: 12,
			});
			expect(mockResponse.render).toHaveBeenCalledWith("job-role-list.njk", {
				jobRoles: mockPaginatedResponse.data,
				pagination: mockPaginatedResponse.pagination,
				totalRoles: 50,
				currentUrl: "/job-roles",
				isSearchPage: false,
				filterOptions: {
					capabilities: ["Engineering", "Analytics"],
					locations: ["Belfast, Northern Ireland", "London, England"],
					bands: ["Junior", "Mid", "Senior"],
				},
			});
		});

		it("should handle default pagination when no parameters provided", async () => {
			// Setup
			mockedValidatePaginationParams.mockReturnValue({
				isValid: true,
				page: 1,
				limit: 12,
			});
			(
				mockJobRoleService.getJobRolesPaginated as ReturnType<typeof vi.fn>
			).mockResolvedValue(mockPaginatedResponse);

			// Execute
			await controller.getJobRoles(
				mockRequest as Request,
				mockResponse as Response
			);

			// Verify
			expect(validatePaginationParams).toHaveBeenCalledWith(
				undefined,
				undefined
			);
			expect(mockJobRoleService.getJobRolesPaginated).toHaveBeenCalledWith({
				page: 1,
				limit: 12,
			});
		});
	});

	describe("error handling", () => {
		it("should return 400 for invalid pagination parameters", async () => {
			// Setup
			mockedValidatePaginationParams.mockReturnValue({
				isValid: false,
				page: 1,
				limit: 12,
				error: "Page must be a positive integer",
			});

			// Execute
			await controller.getJobRoles(
				mockRequest as Request,
				mockResponse as Response
			);

			// Verify
			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.render).toHaveBeenCalledWith("pagination-error.njk", {
				message: "Page must be a positive integer",
			});
			expect(mockJobRoleService.getJobRolesPaginated).not.toHaveBeenCalled();
		});

		it("should return 404 for page beyond available data", async () => {
			// Setup
			mockRequest.query = { page: "10" };
			mockedValidatePaginationParams.mockReturnValue({
				isValid: true,
				page: 10,
				limit: 12,
			});

			const mockResponseBeyondRange = {
				...mockPaginatedResponse,
				data: [],
				pagination: {
					...mockPaginatedResponse.pagination,
					currentPage: 10,
					totalPages: 5, // User requested page 10 but only 5 pages exist
				},
			};

			(
				mockJobRoleService.getJobRolesPaginated as ReturnType<typeof vi.fn>
			).mockResolvedValue(mockResponseBeyondRange);

			// Execute
			await controller.getJobRoles(
				mockRequest as Request,
				mockResponse as Response
			);

			// Verify
			expect(mockResponse.status).toHaveBeenCalledWith(404);
			expect(mockResponse.render).toHaveBeenCalledWith("pagination-error.njk", {
				message: "Page 10 does not exist. There are only 5 pages available.",
			});
		});

		it("should handle empty results gracefully", async () => {
			// Setup
			mockedValidatePaginationParams.mockReturnValue({
				isValid: true,
				page: 1,
				limit: 12,
			});

			const emptyResponse: PaginatedResponse<JobRoleResponse> = {
				data: [],
				pagination: {
					currentPage: 1,
					totalPages: 0,
					totalCount: 0,
					limit: 12,
					hasNext: false,
					hasPrevious: false,
				},
			};

			(
				mockJobRoleService.getJobRolesPaginated as ReturnType<typeof vi.fn>
			).mockResolvedValue(emptyResponse);

			// Execute
			await controller.getJobRoles(
				mockRequest as Request,
				mockResponse as Response
			);

			// Verify
			expect(mockResponse.render).toHaveBeenCalledWith("job-role-list.njk", {
				jobRoles: [],
				pagination: null,
				totalRoles: 0,
				currentUrl: "/job-roles",
				isSearchPage: false,
				filterOptions: {
					capabilities: ["Engineering", "Analytics"],
					locations: ["Belfast, Northern Ireland", "London, England"],
					bands: ["Junior", "Mid", "Senior"],
				},
			});
		});

		it("should handle service errors gracefully", async () => {
			// Setup
			mockedValidatePaginationParams.mockReturnValue({
				isValid: true,
				page: 1,
				limit: 12,
			});
			(
				mockJobRoleService.getJobRolesPaginated as ReturnType<typeof vi.fn>
			).mockRejectedValue(new Error("Database connection failed"));

			// Execute
			await controller.getJobRoles(
				mockRequest as Request,
				mockResponse as Response
			);

			// Verify
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.render).toHaveBeenCalledWith("error.njk", {
				message:
					"Sorry, we couldn't load the job roles at this time. Please try again later.",
			});
		});
	});
});
