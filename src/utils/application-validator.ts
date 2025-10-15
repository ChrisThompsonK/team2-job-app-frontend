/**
 * Application Validator
 * Validates job application form data
 */

export interface ApplicationValidationResult {
	isValid: boolean;
	errors: {
		applicantName?: string;
		applicantEmail?: string;
		coverLetter?: string;
		cvFile?: string;
	};
}

/**
 * Email regex pattern for validation
 * RFC 5322 Official Standard (practical version)
 */
const EMAIL_REGEX =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/**
 * Name validation constants
 */
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;

/**
 * Cover letter validation constants
 */
const MAX_COVER_LETTER_LENGTH = 5000;

/**
 * Validates applicant name
 */
export function validateApplicantName(name: string | undefined): string | null {
	if (!name || name.trim().length === 0) {
		return "Applicant name is required";
	}

	const trimmedName = name.trim();

	if (trimmedName.length < MIN_NAME_LENGTH) {
		return `Name must be at least ${MIN_NAME_LENGTH} characters long`;
	}

	if (trimmedName.length > MAX_NAME_LENGTH) {
		return `Name must not exceed ${MAX_NAME_LENGTH} characters`;
	}

	// Check for valid characters (letters, spaces, hyphens, apostrophes, including Unicode)
	const nameRegex = /^[\p{L}\s'-]+$/u;
	if (!nameRegex.test(trimmedName)) {
		return "Name can only contain letters, spaces, hyphens, and apostrophes";
	}

	return null;
}

/**
 * Validates applicant email
 */
export function validateApplicantEmail(
	email: string | undefined
): string | null {
	if (!email || email.trim().length === 0) {
		return "Email address is required";
	}

	const trimmedEmail = email.trim();

	if (!EMAIL_REGEX.test(trimmedEmail)) {
		return "Please provide a valid email address";
	}

	if (trimmedEmail.length > 255) {
		return "Email address is too long";
	}

	return null;
}

/**
 * Validates cover letter (optional field)
 */
export function validateCoverLetter(
	coverLetter: string | undefined
): string | null {
	// Cover letter is optional
	if (!coverLetter || coverLetter.trim().length === 0) {
		return null;
	}

	const trimmedCoverLetter = coverLetter.trim();

	if (trimmedCoverLetter.length > MAX_COVER_LETTER_LENGTH) {
		return `Cover letter must not exceed ${MAX_COVER_LETTER_LENGTH} characters`;
	}

	return null;
}

/**
 * Validates CV file upload
 */
export function validateCvFile(
	file: Express.Multer.File | undefined
): string | null {
	if (!file) {
		return "CV file is required";
	}

	// Check file size (5MB max)
	const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
	if (file.size > maxFileSize) {
		return "CV file size must not exceed 5MB";
	}

	// Check file type
	const allowedMimeTypes = [
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	];

	if (!allowedMimeTypes.includes(file.mimetype)) {
		return "CV must be in PDF, DOC, or DOCX format";
	}

	return null;
}

/**
 * Validates complete application data
 */
export function validateApplicationData(
	applicantName: string | undefined,
	applicantEmail: string | undefined,
	coverLetter: string | undefined,
	cvFile: Express.Multer.File | undefined
): ApplicationValidationResult {
	const errors: ApplicationValidationResult["errors"] = {};

	const nameError = validateApplicantName(applicantName);
	if (nameError) {
		errors.applicantName = nameError;
	}

	const emailError = validateApplicantEmail(applicantEmail);
	if (emailError) {
		errors.applicantEmail = emailError;
	}

	const coverLetterError = validateCoverLetter(coverLetter);
	if (coverLetterError) {
		errors.coverLetter = coverLetterError;
	}

	const cvFileError = validateCvFile(cvFile);
	if (cvFileError) {
		errors.cvFile = cvFileError;
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
}
