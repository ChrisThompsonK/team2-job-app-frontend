/**
 * Validation for authentication forms
 */

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

export class AuthValidator {
	/**
	 * Validate email format
	 * Uses a robust regex that follows RFC 5322 standards for email validation
	 * Prevents common invalid patterns like double dots, leading/trailing dots, etc.
	 */
	public validateEmail(email: string): ValidationResult {
		const errors: string[] = [];

		if (!email || email.trim().length === 0) {
			errors.push("Email is required");
		} else {
			// More robust email validation regex
			// - Allows alphanumeric, dots, hyphens, underscores in local part
			// - Prevents consecutive dots, leading/trailing dots
			// - Requires valid domain with at least one dot
			// - Domain parts must start and end with alphanumeric characters
			const emailRegex =
				/^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;

			if (!emailRegex.test(email.trim())) {
				errors.push("Please enter a valid email address");
			}

			// Additional validation checks
			const trimmedEmail = email.trim();

			// Check for consecutive dots
			if (trimmedEmail.includes("..")) {
				errors.push("Email address cannot contain consecutive dots");
			}

			// Check maximum length (RFC 5321)
			if (trimmedEmail.length > 254) {
				errors.push("Email address is too long (maximum 254 characters)");
			}

			// Check local part length (before @)
			const atIndex = trimmedEmail.indexOf("@");
			if (atIndex > 64) {
				errors.push("Email local part is too long (maximum 64 characters)");
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Validate password meets security requirements
	 */
	public validatePassword(password: string): ValidationResult {
		const errors: string[] = [];

		if (!password) {
			errors.push("Password is required");
			return { isValid: false, errors };
		}

		if (password.length < 8) {
			errors.push("Password must be at least 8 characters long");
		}

		if (!/[A-Z]/.test(password)) {
			errors.push("Password must contain at least one uppercase letter");
		}

		if (!/[a-z]/.test(password)) {
			errors.push("Password must contain at least one lowercase letter");
		}

		if (!/[0-9]/.test(password)) {
			errors.push("Password must contain at least one number");
		}

		if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
			errors.push(
				'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
			);
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Validate name field (forename or surname)
	 */
	public validateName(name: string, fieldName: string): ValidationResult {
		const errors: string[] = [];

		if (!name || name.trim().length === 0) {
			errors.push(`${fieldName} is required`);
		} else if (name.length > 50) {
			errors.push(`${fieldName} must not exceed 50 characters`);
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Validate login form data
	 */
	public validateLoginData(email: string, password: string): ValidationResult {
		const errors: string[] = [];

		const emailValidation = this.validateEmail(email);
		if (!emailValidation.isValid) {
			errors.push(...emailValidation.errors);
		}

		if (!password || password.trim().length === 0) {
			errors.push("Password is required");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Validate registration form data
	 */
	public validateRegistrationData(
		email: string,
		password: string,
		forename: string,
		surname: string
	): ValidationResult {
		const errors: string[] = [];

		const emailValidation = this.validateEmail(email);
		if (!emailValidation.isValid) {
			errors.push(...emailValidation.errors);
		}

		const passwordValidation = this.validatePassword(password);
		if (!passwordValidation.isValid) {
			errors.push(...passwordValidation.errors);
		}

		const forenameValidation = this.validateName(forename, "First name");
		if (!forenameValidation.isValid) {
			errors.push(...forenameValidation.errors);
		}

		const surnameValidation = this.validateName(surname, "Last name");
		if (!surnameValidation.isValid) {
			errors.push(...surnameValidation.errors);
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}
