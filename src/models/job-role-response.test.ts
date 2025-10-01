/**
 * Tests for Job Role Response model
 */

import { describe, expect, it } from "vitest";
import type { JobRoleResponse } from "../models/job-role-response";

describe("JobRoleResponse", () => {
	it("should accept valid job role data", () => {
		const validJobRole: JobRoleResponse = {
			jobRoleId: 1,
			roleName: "Software Engineer",
			location: "Belfast",
			capability: "Engineering",
			band: "Senior",
			closingDate: "2024-12-31",
		};

		expect(validJobRole.jobRoleId).toBe(1);
		expect(validJobRole.roleName).toBe("Software Engineer");
		expect(validJobRole.location).toBe("Belfast");
		expect(validJobRole.capability).toBe("Engineering");
		expect(validJobRole.band).toBe("Senior");
		expect(validJobRole.closingDate).toBe("2024-12-31");
	});

	it("should handle different band levels", () => {
		const bands = [
			"Trainee",
			"Associate",
			"Senior Associate",
			"Consultant",
			"Senior Consultant",
			"Principal",
			"Partner",
		];

		bands.forEach((band, index) => {
			const jobRole: JobRoleResponse = {
				jobRoleId: index + 1,
				roleName: `Test Role ${index + 1}`,
				location: "Test Location",
				capability: "Test Capability",
				band,
				closingDate: "2024-12-31",
			};

			expect(jobRole.band).toBe(band);
		});
	});

	it("should handle different locations", () => {
		const locations = [
			"Belfast",
			"London",
			"Birmingham",
			"Edinburgh",
			"Remote",
		];

		locations.forEach((location, index) => {
			const jobRole: JobRoleResponse = {
				jobRoleId: index + 1,
				roleName: `Test Role ${index + 1}`,
				location,
				capability: "Test Capability",
				band: "Senior",
				closingDate: "2024-12-31",
			};

			expect(jobRole.location).toBe(location);
		});
	});

	it("should handle different capabilities", () => {
		const capabilities = [
			"Engineering",
			"Data",
			"Cyber Security",
			"Digital Services",
			"Platforms",
			"Artificial Intelligence",
			"Testing",
			"Business Analysis",
			"Architecture",
		];

		capabilities.forEach((capability, index) => {
			const jobRole: JobRoleResponse = {
				jobRoleId: index + 1,
				roleName: `Test Role ${index + 1}`,
				location: "Belfast",
				capability,
				band: "Senior",
				closingDate: "2024-12-31",
			};

			expect(jobRole.capability).toBe(capability);
		});
	});

	it("should handle various date formats for closing date", () => {
		const dateFormats = [
			"2024-12-31",
			"31/12/2024",
			"December 31, 2024",
			"2024-12-31T23:59:59Z",
		];

		dateFormats.forEach((closingDate, index) => {
			const jobRole: JobRoleResponse = {
				jobRoleId: index + 1,
				roleName: `Test Role ${index + 1}`,
				location: "Belfast",
				capability: "Engineering",
				band: "Senior",
				closingDate,
			};

			expect(jobRole.closingDate).toBe(closingDate);
		});
	});

	it("should create array of job roles", () => {
		const jobRoles: JobRoleResponse[] = [
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
				band: "Associate",
				closingDate: "2024-11-30",
			},
		];

		expect(jobRoles).toHaveLength(2);
		expect(jobRoles[0].roleName).toBe("Software Engineer");
		expect(jobRoles[1].roleName).toBe("Data Analyst");
	});
});
