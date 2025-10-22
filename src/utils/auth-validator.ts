/**
 * Authentication validation utilities for better form validation
 */

export interface AuthValidationResult {
	isValid: boolean;
	error?: string;
	field?: string;
}

export interface LoginValidationResult {
	isValid: boolean;
	errors: {
		username?: string;
		password?: string;
		general?: string;
	};
}

export interface RegistrationValidationResult {
	isValid: boolean;
	errors: {
		username?: string;
		email?: string;
		password?: string;
		confirmPassword?: string;
		terms?: string;
		general?: string;
	};
}

/**
 * Validates username field
 */
export function validateUsername(
	username: string | undefined
): AuthValidationResult {
	if (!username || username.trim().length === 0) {
		return {
			isValid: false,
			error: "Username is required",
			field: "username",
		};
	}

	const trimmedUsername = username.trim();

	// Username length validation
	if (trimmedUsername.length < 3) {
		return {
			isValid: false,
			error: "Username must be at least 3 characters long",
			field: "username",
		};
	}

	if (trimmedUsername.length > 50) {
		return {
			isValid: false,
			error: "Username must be less than 50 characters",
			field: "username",
		};
	}

	// Username format validation (alphanumeric, dots, hyphens, underscores)
	const usernameRegex = /^[a-zA-Z0-9._-]+$/;
	if (!usernameRegex.test(trimmedUsername)) {
		return {
			isValid: false,
			error:
				"Username can only contain letters, numbers, dots, hyphens, and underscores",
			field: "username",
		};
	}

	return { isValid: true };
}

/**
 * Validates password field
 */
export function validatePassword(
	password: string | undefined
): AuthValidationResult {
	if (!password || password.trim().length === 0) {
		return {
			isValid: false,
			error: "Password is required",
			field: "password",
		};
	}

	const trimmedPassword = password.trim();

	// Password length validation
	if (trimmedPassword.length < 6) {
		return {
			isValid: false,
			error: "Password must be at least 6 characters long",
			field: "password",
		};
	}

	if (trimmedPassword.length > 100) {
		return {
			isValid: false,
			error: "Password must be less than 100 characters",
			field: "password",
		};
	}

	return { isValid: true };
}

/**
 * Validates email format (optional for registration)
 */
export function validateEmail(email: string | undefined): AuthValidationResult {
	if (!email || email.trim().length === 0) {
		return {
			isValid: false,
			error: "Email is required",
			field: "email",
		};
	}

	const trimmedEmail = email.trim();
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegex.test(trimmedEmail)) {
		return {
			isValid: false,
			error: "Please enter a valid email address",
			field: "email",
		};
	}

	return { isValid: true };
}

/**
 * Validates complete login form data
 */
export function validateLoginForm(
	username: string | undefined,
	password: string | undefined
): LoginValidationResult {
	const errors: LoginValidationResult["errors"] = {};

	const usernameValidation = validateUsername(username);
	if (!usernameValidation.isValid && usernameValidation.error) {
		errors.username = usernameValidation.error;
	}

	const passwordValidation = validatePassword(password);
	if (!passwordValidation.isValid && passwordValidation.error) {
		errors.password = passwordValidation.error;
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
}

/**
 * Password strength checker
 */
export function checkPasswordStrength(password: string): {
	score: number; // 0-4 (weak to very strong)
	feedback: string[];
} {
	const feedback: string[] = [];
	let score = 0;

	if (password.length >= 8) {
		score += 1;
	} else {
		feedback.push("Use at least 8 characters");
	}

	if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
		score += 1;
	} else {
		feedback.push("Use both uppercase and lowercase letters");
	}

	if (/\d/.test(password)) {
		score += 1;
	} else {
		feedback.push("Include at least one number");
	}

	if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password)) {
		score += 1;
	} else {
		feedback.push("Include at least one special character");
	}

	if (password.length >= 12) {
		score = Math.min(score + 1, 4);
	}

	return { score, feedback };
}

/**
 * Validates password confirmation
 */
export function validatePasswordConfirmation(
	password: string | undefined,
	confirmPassword: string | undefined
): AuthValidationResult {
	if (!confirmPassword || confirmPassword.trim().length === 0) {
		return {
			isValid: false,
			error: "Please confirm your password",
			field: "confirmPassword",
		};
	}

	if (!password || password.trim() !== confirmPassword.trim()) {
		return {
			isValid: false,
			error: "Passwords do not match",
			field: "confirmPassword",
		};
	}

	return { isValid: true };
}

/**
 * Validates complete registration form data
 */
export function validateRegistrationForm(
	username: string | undefined,
	email: string | undefined,
	password: string | undefined,
	confirmPassword: string | undefined,
	terms: boolean = false
): RegistrationValidationResult {
	const errors: RegistrationValidationResult["errors"] = {};

	const usernameValidation = validateUsername(username);
	if (!usernameValidation.isValid && usernameValidation.error) {
		errors.username = usernameValidation.error;
	}

	const emailValidation = validateEmail(email);
	if (!emailValidation.isValid && emailValidation.error) {
		errors.email = emailValidation.error;
	}

	const passwordValidation = validatePassword(password);
	if (!passwordValidation.isValid && passwordValidation.error) {
		errors.password = passwordValidation.error;
	}

	const confirmPasswordValidation = validatePasswordConfirmation(
		password,
		confirmPassword
	);
	if (!confirmPasswordValidation.isValid && confirmPasswordValidation.error) {
		errors.confirmPassword = confirmPasswordValidation.error;
	}

	if (!terms) {
		errors.terms = "You must agree to the terms of service and privacy policy";
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
}
