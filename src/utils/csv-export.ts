/**
 * CSV Export Utility
 * Provides functions for converting data to CSV format with proper escaping
 */

import type { JobRoleResponse } from "../models/job-role-response.js";

/**
 * Escapes a CSV field value
 * - Wraps in quotes if contains comma, quote, or newline
 * - Doubles any existing quotes
 * @param value The value to escape
 * @returns Escaped CSV field value
 */
export function escapeCsvField(value: string | number): string {
	const stringValue = String(value);

	// If field contains comma, quote, or newline, wrap in quotes and double any quotes
	if (
		stringValue.includes(",") ||
		stringValue.includes('"') ||
		stringValue.includes("\n")
	) {
		return `"${stringValue.replace(/"/g, '""')}"`;
	}

	return stringValue;
}

/**
 * Converts an array of job roles to CSV format
 * @param jobRoles Array of job roles to convert
 * @returns CSV string with headers and data rows
 */
export function jobRolesToCsv(jobRoles: JobRoleResponse[]): string {
	// Define CSV headers
	const headers = [
		"Job Role ID",
		"Role Name",
		"Location",
		"Capability",
		"Band",
		"Closing Date",
		"Status",
	];

	// Create header row
	const headerRow = headers.map(escapeCsvField).join(",");

	// Create data rows
	const dataRows = jobRoles.map((role) => {
		const fields = [
			role.jobRoleId,
			role.roleName,
			role.location,
			role.capability,
			role.band,
			role.closingDate,
			role.status,
		];

		return fields.map(escapeCsvField).join(",");
	});

	// Combine header and data rows
	return [headerRow, ...dataRows].join("\n");
}

/**
 * Generates a timestamp-based filename for CSV export
 * @param prefix Optional prefix for the filename (default: "job-roles")
 * @returns Filename string in format: prefix-YYYY-MM-DD-HHMMSS.csv
 */
export function generateCsvFilename(prefix = "job-roles"): string {
	const now = new Date();
	const timestamp = now
		.toISOString()
		.replace(/T/, "-")
		.replace(/:/g, "")
		.replace(/\..+/, "")
		.substring(0, 17); // YYYY-MM-DD-HHMMSS

	return `${prefix}-${timestamp}.csv`;
}
