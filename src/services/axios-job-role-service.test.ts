/**
 * Tests for Axios Job Role Service
 */

import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AxiosJobRoleService } from "./axios-job-role-service";

// Mock axios
vi.mock("axios");

describe("AxiosJobRoleService", () => {
	let service: AxiosJobRoleService;
	let mockAxiosInstance: {
		get: ReturnType<typeof vi.fn>;
		delete: ReturnType<typeof vi.fn>;
		put: ReturnType<typeof vi.fn>;
	};

	beforeEach(() => {
		mockAxiosInstance = {
			get: vi.fn(),
			delete: vi.fn(),
			put: vi.fn(),
		};

		vi.mocked(axios.create).mockReturnValue(
			mockAxiosInstance as unknown as ReturnType<typeof axios.create>
		);

		service = new AxiosJobRoleService("http://localhost:8080");
		vi.clearAllMocks();
	});

	describe("deleteJobRole", () => {
		it("should successfully delete a job role with valid ID", async () => {
			mockAxiosInstance.delete.mockResolvedValue({
				status: 200,
				data: { success: true },
			});

			const result = await service.deleteJobRole(123);

			expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
				"/api/job-roles/123"
			);
			expect(result).toBe(true);
		});

		it("should return false for invalid ID (negative)", async () => {
			const result = await service.deleteJobRole(-1);

			expect(mockAxiosInstance.delete).not.toHaveBeenCalled();
			expect(result).toBe(false);
		});

		it("should return false for invalid ID (zero)", async () => {
			const result = await service.deleteJobRole(0);

			expect(mockAxiosInstance.delete).not.toHaveBeenCalled();
			expect(result).toBe(false);
		});

		it("should return false for invalid ID (non-integer)", async () => {
			const result = await service.deleteJobRole(123.45);

			expect(mockAxiosInstance.delete).not.toHaveBeenCalled();
			expect(result).toBe(false);
		});

		it("should handle 404 errors gracefully", async () => {
			mockAxiosInstance.delete.mockRejectedValue({
				response: { status: 404 },
			});

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const result = await service.deleteJobRole(999);

			expect(result).toBe(false);
			expect(consoleSpy).toHaveBeenCalled();

			consoleSpy.mockRestore();
		});

		it("should handle network errors gracefully", async () => {
			const networkError = new Error("Network Error");
			mockAxiosInstance.delete.mockRejectedValue(networkError);

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const result = await service.deleteJobRole(123);

			expect(result).toBe(false);
			expect(consoleSpy).toHaveBeenCalledWith(
				"Error deleting job role 123:",
				networkError
			);

			consoleSpy.mockRestore();
		});

		it("should handle server errors (500) gracefully", async () => {
			mockAxiosInstance.delete.mockRejectedValue({
				response: { status: 500, data: { message: "Internal Server Error" } },
			});

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const result = await service.deleteJobRole(123);

			expect(result).toBe(false);
			expect(consoleSpy).toHaveBeenCalled();

			consoleSpy.mockRestore();
		});

		it("should handle timeout errors gracefully", async () => {
			const timeoutError = new Error("ETIMEDOUT");
			mockAxiosInstance.delete.mockRejectedValue(timeoutError);

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const result = await service.deleteJobRole(123);

			expect(result).toBe(false);
			expect(consoleSpy).toHaveBeenCalled();

			consoleSpy.mockRestore();
		});
	});

	describe("updateJobRole", () => {
		const mockJobRoleData = {
			roleName: "Senior Software Engineer",
			description: "Lead software development projects",
			responsibilities: "Develop and maintain applications",
			jobSpecLink: "https://example.com/job-spec",
			location: "Belfast, Northern Ireland",
			capability: "Engineering",
			band: "Senior",
			closingDate: "2025-12-31",
			status: "Open",
			numberOfOpenPositions: 2,
		};

		const mockBackendResponse = {
			success: true,
			data: {
				id: 123,
				jobRoleName: "Senior Software Engineer",
				description: "Lead software development projects",
				responsibilities: "Develop and maintain applications",
				jobSpecLink: "https://example.com/job-spec",
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: "2025-12-31",
				status: "Open",
				numberOfOpenPositions: 2,
			},
		};

		it("should successfully update a job role with valid ID", async () => {
			mockAxiosInstance.put.mockResolvedValue({
				status: 200,
				data: mockBackendResponse,
			});

			const result = await service.updateJobRole(123, mockJobRoleData);

			expect(mockAxiosInstance.put).toHaveBeenCalledWith("/api/job-roles/123", {
				jobRoleName: "Senior Software Engineer",
				description: "Lead software development projects",
				responsibilities: "Develop and maintain applications",
				jobSpecLink: "https://example.com/job-spec",
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: "2025-12-31",
				status: "Open",
				numberOfOpenPositions: 2,
			});

			expect(result).toEqual({
				jobRoleId: 123,
				roleName: "Senior Software Engineer",
				description: "Lead software development projects",
				responsibilities: "Develop and maintain applications",
				jobSpecLink: "https://example.com/job-spec",
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: "2025-12-31",
				status: "Open",
				numberOfOpenPositions: 2,
			});
		});

		it("should throw error for invalid ID (negative)", async () => {
			await expect(service.updateJobRole(-1, mockJobRoleData)).rejects.toThrow(
				"Invalid job role ID"
			);

			expect(mockAxiosInstance.put).not.toHaveBeenCalled();
		});

		it("should throw error for invalid ID (zero)", async () => {
			await expect(service.updateJobRole(0, mockJobRoleData)).rejects.toThrow(
				"Invalid job role ID"
			);

			expect(mockAxiosInstance.put).not.toHaveBeenCalled();
		});

		it("should throw error for invalid ID (non-integer)", async () => {
			await expect(
				service.updateJobRole(123.45, mockJobRoleData)
			).rejects.toThrow("Invalid job role ID");

			expect(mockAxiosInstance.put).not.toHaveBeenCalled();
		});

		it("should throw error when job role not found (404)", async () => {
			mockAxiosInstance.put.mockRejectedValue({
				isAxiosError: true,
				response: { status: 404 },
			});

			vi.mocked(axios.isAxiosError).mockReturnValue(true);

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			await expect(service.updateJobRole(999, mockJobRoleData)).rejects.toThrow(
				"Job role not found"
			);

			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
		});

		it("should throw error with backend message on validation error", async () => {
			mockAxiosInstance.put.mockRejectedValue({
				isAxiosError: true,
				response: {
					status: 400,
					data: { message: "Invalid data provided" },
				},
			});

			vi.mocked(axios.isAxiosError).mockReturnValue(true);

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			await expect(service.updateJobRole(123, mockJobRoleData)).rejects.toThrow(
				"Invalid data provided"
			);

			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
		});

		it("should handle network errors gracefully", async () => {
			const networkError = new Error("Network Error");
			mockAxiosInstance.put.mockRejectedValue(networkError);

			vi.mocked(axios.isAxiosError).mockReturnValue(false);

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			await expect(service.updateJobRole(123, mockJobRoleData)).rejects.toThrow(
				"Failed to update job role"
			);

			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
		});

		it("should handle server errors (500) gracefully", async () => {
			mockAxiosInstance.put.mockRejectedValue({
				isAxiosError: true,
				response: {
					status: 500,
					data: { message: "Internal Server Error" },
				},
			});

			vi.mocked(axios.isAxiosError).mockReturnValue(true);

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			await expect(service.updateJobRole(123, mockJobRoleData)).rejects.toThrow(
				"Internal Server Error"
			);

			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
		});
	});

	describe("constructor", () => {
		it("should create instance with default baseURL", () => {
			new AxiosJobRoleService();

			expect(axios.create).toHaveBeenCalledWith({
				baseURL: "http://localhost:8080",
				timeout: 10000,
				headers: {
					"Content-Type": "application/json",
				},
			});
		});

		it("should create instance with custom baseURL", () => {
			new AxiosJobRoleService("http://example.com:3000");

			expect(axios.create).toHaveBeenCalledWith({
				baseURL: "http://example.com:3000",
				timeout: 10000,
				headers: {
					"Content-Type": "application/json",
				},
			});
		});
	});
});
