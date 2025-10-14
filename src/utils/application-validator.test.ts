/**
 * Application Validator Tests
 */

import { describe, expect, it } from "vitest";
import {
	validateApplicantEmail,
	validateApplicantName,
	validateApplicationData,
	validateCoverLetter,
	validateCvFile,
} from "./application-validator.js";

describe("Application Validator", () => {
	describe("validateApplicantName", () => {
		it("should accept valid names", () => {
			expect(validateApplicantName("John Doe")).toBeNull();
			expect(validateApplicantName("Mary-Jane Smith")).toBeNull();
			expect(validateApplicantName("O'Connor")).toBeNull();
			expect(validateApplicantName("José García")).toBeNull();
			expect(validateApplicantName("Van Der Berg")).toBeNull();
		});

		it("should reject missing or empty names", () => {
			expect(validateApplicantName(undefined)).toBe(
				"Applicant name is required"
			);
			expect(validateApplicantName("")).toBe("Applicant name is required");
			expect(validateApplicantName("   ")).toBe("Applicant name is required");
		});

		it("should reject names that are too short", () => {
			expect(validateApplicantName("J")).toBe(
				"Name must be at least 2 characters long"
			);
		});

		it("should reject names that are too long", () => {
			const longName = "a".repeat(101);
			expect(validateApplicantName(longName)).toBe(
				"Name must not exceed 100 characters"
			);
		});

		it("should reject names with invalid characters", () => {
			expect(validateApplicantName("John123")).toBe(
				"Name can only contain letters, spaces, hyphens, and apostrophes"
			);
			expect(validateApplicantName("John@Doe")).toBe(
				"Name can only contain letters, spaces, hyphens, and apostrophes"
			);
			expect(validateApplicantName("John.Doe")).toBe(
				"Name can only contain letters, spaces, hyphens, and apostrophes"
			);
		});
	});

	describe("validateApplicantEmail", () => {
		it("should accept valid email addresses", () => {
			expect(validateApplicantEmail("john@example.com")).toBeNull();
			expect(validateApplicantEmail("user.name+tag@domain.co.uk")).toBeNull();
			expect(validateApplicantEmail("test123@test-domain.org")).toBeNull();
		});

		it("should reject missing or empty emails", () => {
			expect(validateApplicantEmail(undefined)).toBe(
				"Email address is required"
			);
			expect(validateApplicantEmail("")).toBe("Email address is required");
			expect(validateApplicantEmail("   ")).toBe("Email address is required");
		});

		it("should reject invalid email formats", () => {
			expect(validateApplicantEmail("invalid-email")).toBe(
				"Please provide a valid email address"
			);
			expect(validateApplicantEmail("@domain.com")).toBe(
				"Please provide a valid email address"
			);
			expect(validateApplicantEmail("user@")).toBe(
				"Please provide a valid email address"
			);
			expect(validateApplicantEmail("user@domain")).toBe(
				"Please provide a valid email address"
			);
		});

		it("should reject emails that are too long", () => {
			const longEmail = `${"a".repeat(250)}@example.com`;
			expect(validateApplicantEmail(longEmail)).toBe(
				"Email address is too long"
			);
		});
	});

	describe("validateCoverLetter", () => {
		it("should accept valid cover letters", () => {
			expect(
				validateCoverLetter("I am very interested in this position.")
			).toBeNull();
			expect(validateCoverLetter("Short note.")).toBeNull();
		});

		it("should accept missing or empty cover letters (optional field)", () => {
			expect(validateCoverLetter(undefined)).toBeNull();
			expect(validateCoverLetter("")).toBeNull();
			expect(validateCoverLetter("   ")).toBeNull();
		});

		it("should reject cover letters that are too long", () => {
			const longCoverLetter = "a".repeat(5001);
			expect(validateCoverLetter(longCoverLetter)).toBe(
				"Cover letter must not exceed 5000 characters"
			);
		});
	});

	describe("validateCvFile", () => {
		const createMockFile = (
			mimetype: string,
			size: number
		): Express.Multer.File => ({
			fieldname: "cv",
			originalname: "resume.pdf",
			encoding: "7bit",
			mimetype,
			buffer: Buffer.alloc(size),
			size,
			stream: null as never,
			destination: "",
			filename: "",
			path: "",
		});

		it("should accept valid PDF files", () => {
			const pdfFile = createMockFile("application/pdf", 1024 * 1024); // 1MB
			expect(validateCvFile(pdfFile)).toBeNull();
		});

		it("should accept valid DOC files", () => {
			const docFile = createMockFile("application/msword", 1024 * 1024); // 1MB
			expect(validateCvFile(docFile)).toBeNull();
		});

		it("should accept valid DOCX files", () => {
			const docxFile = createMockFile(
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				1024 * 1024
			); // 1MB
			expect(validateCvFile(docxFile)).toBeNull();
		});

		it("should reject missing file", () => {
			expect(validateCvFile(undefined)).toBe("CV file is required");
		});

		it("should reject files that are too large", () => {
			const largeFile = createMockFile("application/pdf", 6 * 1024 * 1024); // 6MB
			expect(validateCvFile(largeFile)).toBe(
				"CV file size must not exceed 5MB"
			);
		});

		it("should reject invalid file types", () => {
			const txtFile = createMockFile("text/plain", 1024);
			expect(validateCvFile(txtFile)).toBe(
				"CV must be in PDF, DOC, or DOCX format"
			);

			const jpgFile = createMockFile("image/jpeg", 1024);
			expect(validateCvFile(jpgFile)).toBe(
				"CV must be in PDF, DOC, or DOCX format"
			);
		});
	});

	describe("validateApplicationData", () => {
		const createValidFile = (): Express.Multer.File => ({
			fieldname: "cv",
			originalname: "resume.pdf",
			encoding: "7bit",
			mimetype: "application/pdf",
			buffer: Buffer.alloc(1024),
			size: 1024,
			stream: null as never,
			destination: "",
			filename: "",
			path: "",
		});

		it("should accept valid application data", () => {
			const result = validateApplicationData(
				"John Doe",
				"john@example.com",
				"I am very interested in this position.",
				createValidFile()
			);

			expect(result.isValid).toBe(true);
			expect(Object.keys(result.errors)).toHaveLength(0);
		});

		it("should accept valid data without cover letter", () => {
			const result = validateApplicationData(
				"John Doe",
				"john@example.com",
				undefined, // No cover letter
				createValidFile()
			);

			expect(result.isValid).toBe(true);
			expect(Object.keys(result.errors)).toHaveLength(0);
		});

		it("should return all validation errors", () => {
			const result = validateApplicationData(
				"", // Invalid name
				"invalid-email", // Invalid email
				"a".repeat(5001), // Cover letter too long
				undefined // No file
			);

			expect(result.isValid).toBe(false);
			expect(result.errors.applicantName).toBe("Applicant name is required");
			expect(result.errors.applicantEmail).toBe(
				"Please provide a valid email address"
			);
			expect(result.errors.coverLetter).toBe(
				"Cover letter must not exceed 5000 characters"
			);
			expect(result.errors.cvFile).toBe("CV file is required");
		});

		it("should handle individual field errors correctly", () => {
			// Test name error only
			let result = validateApplicationData(
				"J", // Too short
				"john@example.com",
				"Valid cover letter",
				createValidFile()
			);
			expect(result.isValid).toBe(false);
			expect(result.errors.applicantName).toBe(
				"Name must be at least 2 characters long"
			);
			expect(result.errors.applicantEmail).toBeUndefined();

			// Test email error only
			result = validateApplicationData(
				"John Doe",
				"invalid", // Invalid email
				"Valid cover letter",
				createValidFile()
			);
			expect(result.isValid).toBe(false);
			expect(result.errors.applicantEmail).toBe(
				"Please provide a valid email address"
			);
			expect(result.errors.applicantName).toBeUndefined();
		});
	});
});
