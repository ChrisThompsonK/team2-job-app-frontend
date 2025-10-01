/**
 * Tests for Job Role Service
 */

import { promises as fs } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { JobRoleResponse } from "../models/job-role-response";
import { JsonJobRoleService } from "../services/job-role-service";

// Mock the fs module
vi.mock("node:fs", () => ({
	promises: {
		readFile: vi.fn(),
	},
}));

const mockFs = vi.mocked(fs);

describe("JsonJobRoleService", () => {
	let service: JsonJobRoleService;

	beforeEach(() => {
		service = new JsonJobRoleService();
		vi.clearAllMocks();
	});

	describe("getJobRoles", () => {
		it("should return job roles from JSON file successfully", async () => {
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
					roleName: "Data Analyst",
					location: "London",
					capability: "Data",
					band: "Junior",
					closingDate: "2024-11-30",
				},
			];

			const mockJsonData = JSON.stringify({ jobRoles: mockJobRoles });
			mockFs.readFile.mockResolvedValue(mockJsonData);

			const result = await service.getJobRoles();

			expect(result).toEqual(mockJobRoles);
			expect(mockFs.readFile).toHaveBeenCalledTimes(1);
			expect(mockFs.readFile).toHaveBeenCalledWith(
				expect.stringContaining("job-roles.json"),
				"utf-8"
			);
		});

		it("should return empty array when JSON file is not found", async () => {
			const mockError = new Error("ENOENT: no such file or directory");
			mockFs.readFile.mockRejectedValue(mockError);

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const result = await service.getJobRoles();

			expect(result).toEqual([]);
			expect(consoleSpy).toHaveBeenCalledWith(
				"Error reading job roles JSON file:",
				mockError
			);

			consoleSpy.mockRestore();
		});

		it("should return empty array when JSON is malformed", async () => {
			const malformedJson = "{ invalid json }";
			mockFs.readFile.mockResolvedValue(malformedJson);

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const result = await service.getJobRoles();

			expect(result).toEqual([]);
			expect(consoleSpy).toHaveBeenCalledWith(
				"Error reading job roles JSON file:",
				expect.any(SyntaxError)
			);

			consoleSpy.mockRestore();
		});

		it("should handle empty job roles array", async () => {
			const mockJsonData = JSON.stringify({ jobRoles: [] });
			mockFs.readFile.mockResolvedValue(mockJsonData);

			const result = await service.getJobRoles();

			expect(result).toEqual([]);
		});

		it("should handle missing jobRoles property in JSON", async () => {
			const mockJsonData = JSON.stringify({ someOtherProperty: "value" });
			mockFs.readFile.mockResolvedValue(mockJsonData);

			const result = await service.getJobRoles();

			// The service should return empty array when jobRoles property is missing
			// The service handles this gracefully with || []
			expect(result).toEqual([]);
		});
	});
});
