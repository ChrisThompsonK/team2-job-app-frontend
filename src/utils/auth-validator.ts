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
	 */
	public validateEmail(email: string): ValidationResult {
		const errors: string[] = [];

		if (!email || email.trim().length === 0) {
			errors.push("Email is required");
		} else {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				errors.push("Please enter a valid email address");
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
