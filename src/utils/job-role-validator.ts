/**
 * Validator for job role creation and updates
 */

import {
	VALID_BANDS,
	VALID_CAPABILITIES,
	VALID_LOCATIONS,
	VALID_STATUSES,
} from "./job-role-validation-constants.js";

export interface ValidationResult {
	isValid: boolean;
	error?: string;
}

export interface JobRoleData {
	roleName: string;
	description: string;
	responsibilities: string;
	jobSpecLink: string;
	location: string;
	capability: string;
	band: string;
	closingDate: string;
	status: string;
	numberOfOpenPositions: string;
}

export class JobRoleValidator {
	/**
	 * Validates all fields for job role creation
	 */
	public validateJobRole(
		data: JobRoleData,
		isUpdate = false
	): ValidationResult {
		// Validate required fields
		const requiredFieldsResult = this.validateRequiredFields(data);
		if (!requiredFieldsResult.isValid) {
			return requiredFieldsResult;
		}

		// Validate location
		const locationResult = this.validateLocation(data.location);
		if (!locationResult.isValid) {
			return locationResult;
		}

		// Validate capability
		const capabilityResult = this.validateCapability(data.capability);
		if (!capabilityResult.isValid) {
			return capabilityResult;
		}

		// Validate band
		const bandResult = this.validateBand(data.band);
		if (!bandResult.isValid) {
			return bandResult;
		}

		// Validate status
		const statusResult = this.validateStatus(data.status);
		if (!statusResult.isValid) {
			return statusResult;
		}

		// Validate number of open positions
		const positionsResult = this.validateNumberOfPositions(
			data.numberOfOpenPositions
		);
		if (!positionsResult.isValid) {
			return positionsResult;
		}

		// Validate closing date (allow past dates for updates)
		const dateResult = this.validateClosingDate(data.closingDate, isUpdate);
		if (!dateResult.isValid) {
			return dateResult;
		}

		// Validate job spec link
		const urlResult = this.validateJobSpecLink(data.jobSpecLink);
		if (!urlResult.isValid) {
			return urlResult;
		}

		// Validate string lengths
		const lengthResult = this.validateStringLengths(data);
		if (!lengthResult.isValid) {
			return lengthResult;
		}

		return { isValid: true };
	}

	private validateRequiredFields(data: JobRoleData): ValidationResult {
		if (
			!data.roleName ||
			!data.description ||
			!data.responsibilities ||
			!data.jobSpecLink ||
			!data.location ||
			!data.capability ||
			!data.band ||
			!data.closingDate ||
			!data.status ||
			!data.numberOfOpenPositions
		) {
			return {
				isValid: false,
				error: "All fields are required. Please fill in all information.",
			};
		}
		return { isValid: true };
	}

	private validateLocation(location: string): ValidationResult {
		if (
			!VALID_LOCATIONS.includes(
				location.trim() as (typeof VALID_LOCATIONS)[number]
			)
		) {
			return {
				isValid: false,
				error: `Invalid location: "${location}". Please select a valid location from the dropdown.`,
			};
		}
		return { isValid: true };
	}

	private validateCapability(capability: string): ValidationResult {
		if (
			!VALID_CAPABILITIES.includes(
				capability.trim() as (typeof VALID_CAPABILITIES)[number]
			)
		) {
			return {
				isValid: false,
				error: `Invalid capability: "${capability}". Please select a valid capability from the dropdown.`,
			};
		}
		return { isValid: true };
	}

	private validateBand(band: string): ValidationResult {
		if (!VALID_BANDS.includes(band.trim() as (typeof VALID_BANDS)[number])) {
			return {
				isValid: false,
				error: `Invalid band level: "${band}". Please select a valid band from the dropdown.`,
			};
		}
		return { isValid: true };
	}

	private validateStatus(status: string): ValidationResult {
		if (
			!VALID_STATUSES.includes(status.trim() as (typeof VALID_STATUSES)[number])
		) {
			return {
				isValid: false,
				error: `Invalid status: "${status}". Please select a valid status from the dropdown.`,
			};
		}
		return { isValid: true };
	}

	private validateNumberOfPositions(
		numberOfOpenPositions: string
	): ValidationResult {
		const positions = parseInt(numberOfOpenPositions, 10);
		if (Number.isNaN(positions) || positions < 1) {
			return {
				isValid: false,
				error: "Number of open positions must be at least 1.",
			};
		}
		return { isValid: true };
	}

	private validateClosingDate(
		closingDate: string,
		allowPastDates = false
	): ValidationResult {
		// Trim whitespace before validation
		const trimmedDate = closingDate.trim();

		// Validate date format (YYYY-MM-DD)
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		if (!dateRegex.test(trimmedDate)) {
			return {
				isValid: false,
				error: "Invalid date format. Please use YYYY-MM-DD format.",
			};
		}

		// Validate date is not in the past (only for new job roles)
		if (!allowPastDates) {
			const selectedDate = new Date(trimmedDate);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			if (selectedDate < today) {
				return {
					isValid: false,
					error: "Closing date cannot be in the past.",
				};
			}
		}

		return { isValid: true };
	}

	private validateJobSpecLink(jobSpecLink: string): ValidationResult {
		try {
			const url = new URL(jobSpecLink.trim());
			if (url.protocol !== "http:" && url.protocol !== "https:") {
				throw new Error("Invalid protocol");
			}
		} catch {
			return {
				isValid: false,
				error:
					"Invalid URL format for Job Spec Link. URL must start with http:// or https://",
			};
		}
		return { isValid: true };
	}

	private validateStringLengths(data: JobRoleData): ValidationResult {
		if (data.roleName.trim().length < 3) {
			return {
				isValid: false,
				error: "Role name must be at least 3 characters long.",
			};
		}

		if (data.description.trim().length < 10) {
			return {
				isValid: false,
				error: "Job description must be at least 10 characters long.",
			};
		}

		if (data.responsibilities.trim().length < 10) {
			return {
				isValid: false,
				error: "Key responsibilities must be at least 10 characters long.",
			};
		}

		return { isValid: true };
	}
}
