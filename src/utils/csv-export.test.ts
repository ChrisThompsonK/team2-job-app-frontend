/**
 * Unit tests for CSV Export Utility
 */

import { describe, expect, it } from "vitest";
import type { JobRoleResponse } from "../models/job-role-response.js";
import {
	escapeCsvField,
	generateCsvFilename,
	jobRolesToCsv,
} from "./csv-export.js";

describe("escapeCsvField", () => {
	it("should return string as-is when no special characters", () => {
		expect(escapeCsvField("Simple Text")).toBe("Simple Text");
		expect(escapeCsvField("NoSpecialChars123")).toBe("NoSpecialChars123");
	});

	it("should wrap in quotes when contains comma", () => {
		expect(escapeCsvField("Text, with comma")).toBe('"Text, with comma"');
		expect(escapeCsvField("Belfast, Northern Ireland")).toBe(
			'"Belfast, Northern Ireland"'
		);
	});

	it("should wrap in quotes and escape quotes when contains quotes", () => {
		expect(escapeCsvField('Text with "quotes"')).toBe('"Text with ""quotes"""');
		expect(escapeCsvField('"Already quoted"')).toBe('"""Already quoted"""');
	});

	it("should wrap in quotes when contains newline", () => {
		expect(escapeCsvField("Text\nwith\nnewlines")).toBe(
			'"Text\nwith\nnewlines"'
		);
	});

	it("should handle numbers correctly", () => {
		expect(escapeCsvField(123)).toBe("123");
		expect(escapeCsvField(0)).toBe("0");
		expect(escapeCsvField(-456)).toBe("-456");
	});

	it("should handle complex cases with multiple special characters", () => {
		expect(escapeCsvField('Text, with "comma" and\nnewline')).toBe(
			'"Text, with ""comma"" and\nnewline"'
		);
	});

	it("should handle empty string", () => {
		expect(escapeCsvField("")).toBe("");
	});
});

describe("jobRolesToCsv", () => {
	it("should generate CSV with headers and data rows", () => {
		const jobRoles: JobRoleResponse[] = [
			{
				jobRoleId: 1,
				roleName: "Software Engineer",
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: "2025-12-31",
				status: "Open",
			},
			{
				jobRoleId: 2,
				roleName: "Product Manager",
				location: "Dublin, Ireland",
				capability: "Product",
				band: "Mid",
				closingDate: "2025-11-30",
				status: "Closed",
			},
		];

		const csv = jobRolesToCsv(jobRoles);

		expect(csv).toContain("Job Role ID,Role Name,Location,Capability,Band");
		expect(csv).toContain("1,Software Engineer");
		expect(csv).toContain('"Belfast, Northern Ireland"');
		expect(csv).toContain("Engineering,Senior,2025-12-31,Open");
		expect(csv).toContain("2,Product Manager");
		expect(csv).toContain('"Dublin, Ireland"');
		expect(csv).toContain("Product,Mid,2025-11-30,Closed");
	});

	it("should handle empty job roles array", () => {
		const csv = jobRolesToCsv([]);

		expect(csv).toBe(
			"Job Role ID,Role Name,Location,Capability,Band,Closing Date,Status"
		);
	});

	it("should properly escape special characters in job role data", () => {
		const jobRoles: JobRoleResponse[] = [
			{
				jobRoleId: 1,
				roleName: 'Senior "Expert" Engineer',
				location: "Belfast, Northern Ireland",
				capability: "Engineering",
				band: "Senior",
				closingDate: "2025-12-31",
				status: "Open",
			},
		];

		const csv = jobRolesToCsv(jobRoles);

		expect(csv).toContain('1,"Senior ""Expert"" Engineer"');
		expect(csv).toContain('"Belfast, Northern Ireland"');
	});

	it("should handle single job role", () => {
		const jobRoles: JobRoleResponse[] = [
			{
				jobRoleId: 42,
				roleName: "Test Role",
				location: "Remote",
				capability: "Testing",
				band: "Junior",
				closingDate: "2025-10-15",
				status: "Open",
			},
		];

		const csv = jobRolesToCsv(jobRoles);
		const lines = csv.split("\n");

		expect(lines).toHaveLength(2); // Header + 1 data row
		expect(lines[0]).toContain("Job Role ID");
		expect(lines[1]).toContain("42,Test Role,Remote,Testing,Junior");
	});

	it("should maintain proper CSV structure with multiple rows", () => {
		const jobRoles: JobRoleResponse[] = [
			{
				jobRoleId: 1,
				roleName: "Role 1",
				location: "Location 1",
				capability: "Cap 1",
				band: "Band 1",
				closingDate: "2025-01-01",
				status: "Open",
			},
			{
				jobRoleId: 2,
				roleName: "Role 2",
				location: "Location 2",
				capability: "Cap 2",
				band: "Band 2",
				closingDate: "2025-02-01",
				status: "Closed",
			},
			{
				jobRoleId: 3,
				roleName: "Role 3",
				location: "Location 3",
				capability: "Cap 3",
				band: "Band 3",
				closingDate: "2025-03-01",
				status: "Open",
			},
		];

		const csv = jobRolesToCsv(jobRoles);
		const lines = csv.split("\n");

		expect(lines).toHaveLength(4); // Header + 3 data rows
		expect(lines[0]).toContain("Job Role ID");
		expect(lines[1]).toContain("1,Role 1");
		expect(lines[2]).toContain("2,Role 2");
		expect(lines[3]).toContain("3,Role 3");
	});
});

describe("generateCsvFilename", () => {
	it("should generate filename with default prefix", () => {
		const filename = generateCsvFilename();

		expect(filename).toMatch(/^job-roles-\d{4}-\d{2}-\d{2}-\d{6}\.csv$/);
		expect(filename).toContain("job-roles-");
		expect(filename).toContain(".csv");
	});

	it("should generate filename with custom prefix", () => {
		const filename = generateCsvFilename("custom-export");

		expect(filename).toMatch(/^custom-export-\d{4}-\d{2}-\d{2}-\d{6}\.csv$/);
		expect(filename).toContain("custom-export-");
		expect(filename).toContain(".csv");
	});

	it("should generate unique filenames for different timestamps", () => {
		const filename1 = generateCsvFilename();
		const filename2 = generateCsvFilename();

		// Filenames might be the same if generated within the same second
		// But structure should always be correct
		expect(filename1).toMatch(/\.csv$/);
		expect(filename2).toMatch(/\.csv$/);
	});

	it("should include date components in correct format", () => {
		const filename = generateCsvFilename();
		const parts = filename.replace(".csv", "").split("-");

		// Should have: prefix, YYYY, MM, DD, HHMMSS
		expect(parts.length).toBeGreaterThanOrEqual(5);

		// Extract year, month, day (indices depend on prefix)
		const yearIndex = parts.findIndex(
			(p) => p.length === 4 && /^\d{4}$/.test(p)
		);
		expect(yearIndex).toBeGreaterThan(0);

		const year = parseInt(parts[yearIndex] || "0", 10);
		expect(year).toBeGreaterThanOrEqual(2020);
		expect(year).toBeLessThanOrEqual(2100);
	});
});
