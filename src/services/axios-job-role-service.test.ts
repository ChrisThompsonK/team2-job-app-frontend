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
	};

	beforeEach(() => {
		mockAxiosInstance = {
			get: vi.fn(),
			delete: vi.fn(),
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

	describe("constructor", () => {
		it("should create instance with default baseURL", () => {
			new AxiosJobRoleService();

			expect(axios.create).toHaveBeenCalledWith({
				baseURL: "http://localhost:8080",
				timeout: 5000,
				headers: {
					"Content-Type": "application/json",
				},
			});
		});

		it("should create instance with custom baseURL", () => {
			new AxiosJobRoleService("http://example.com:3000");

			expect(axios.create).toHaveBeenCalledWith({
				baseURL: "http://example.com:3000",
				timeout: 5000,
				headers: {
					"Content-Type": "application/json",
				},
			});
		});
	});
});
