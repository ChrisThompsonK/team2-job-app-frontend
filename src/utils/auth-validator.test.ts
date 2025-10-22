/**
 * Tests for Authentication Validator
 */

import { describe, expect, it } from "vitest";
import {
	checkPasswordStrength,
	validateEmail,
	validateLoginForm,
	validatePassword,
	validateUsername,
} from "./auth-validator.js";

describe("Auth Validator", () => {
	describe("validateUsername", () => {
		it("should accept valid usernames", () => {
			expect(validateUsername("johndoe")).toEqual({ isValid: true });
			expect(validateUsername("jane.smith")).toEqual({ isValid: true });
			expect(validateUsername("user_123")).toEqual({ isValid: true });
			expect(validateUsername("test-user")).toEqual({ isValid: true });
		});

		it("should reject missing or empty usernames", () => {
			expect(validateUsername(undefined)).toEqual({
				isValid: false,
				error: "Username is required",
				field: "username",
			});
			expect(validateUsername("")).toEqual({
				isValid: false,
				error: "Username is required",
				field: "username",
			});
			expect(validateUsername("   ")).toEqual({
				isValid: false,
				error: "Username is required",
				field: "username",
			});
		});

		it("should reject usernames that are too short", () => {
			expect(validateUsername("ab")).toEqual({
				isValid: false,
				error: "Username must be at least 3 characters long",
				field: "username",
			});
		});

		it("should reject usernames that are too long", () => {
			const longUsername = "a".repeat(51);
			expect(validateUsername(longUsername)).toEqual({
				isValid: false,
				error: "Username must be less than 50 characters",
				field: "username",
			});
		});

		it("should reject usernames with invalid characters", () => {
			expect(validateUsername("user@domain")).toEqual({
				isValid: false,
				error:
					"Username can only contain letters, numbers, dots, hyphens, and underscores",
				field: "username",
			});
			expect(validateUsername("user spaces")).toEqual({
				isValid: false,
				error:
					"Username can only contain letters, numbers, dots, hyphens, and underscores",
				field: "username",
			});
		});
	});

	describe("validatePassword", () => {
		it("should accept valid passwords", () => {
			expect(validatePassword("password123")).toEqual({ isValid: true });
			expect(validatePassword("myP@ssw0rd")).toEqual({ isValid: true });
		});

		it("should reject missing or empty passwords", () => {
			expect(validatePassword(undefined)).toEqual({
				isValid: false,
				error: "Password is required",
				field: "password",
			});
			expect(validatePassword("")).toEqual({
				isValid: false,
				error: "Password is required",
				field: "password",
			});
		});

		it("should reject passwords that are too short", () => {
			expect(validatePassword("12345")).toEqual({
				isValid: false,
				error: "Password must be at least 6 characters long",
				field: "password",
			});
		});

		it("should reject passwords that are too long", () => {
			const longPassword = "a".repeat(101);
			expect(validatePassword(longPassword)).toEqual({
				isValid: false,
				error: "Password must be less than 100 characters",
				field: "password",
			});
		});
	});

	describe("validateEmail", () => {
		it("should accept valid email addresses", () => {
			expect(validateEmail("user@example.com")).toEqual({ isValid: true });
			expect(validateEmail("jane.doe@company.co.uk")).toEqual({
				isValid: true,
			});
		});

		it("should reject missing or empty emails", () => {
			expect(validateEmail(undefined)).toEqual({
				isValid: false,
				error: "Email is required",
				field: "email",
			});
			expect(validateEmail("")).toEqual({
				isValid: false,
				error: "Email is required",
				field: "email",
			});
		});

		it("should reject invalid email formats", () => {
			expect(validateEmail("invalid-email")).toEqual({
				isValid: false,
				error: "Please enter a valid email address",
				field: "email",
			});
			expect(validateEmail("user@")).toEqual({
				isValid: false,
				error: "Please enter a valid email address",
				field: "email",
			});
		});
	});

	describe("validateLoginForm", () => {
		it("should validate complete login form successfully", () => {
			const result = validateLoginForm("johndoe", "password123");
			expect(result.isValid).toBe(true);
			expect(result.errors).toEqual({});
		});

		it("should return all validation errors", () => {
			const result = validateLoginForm("", "");
			expect(result.isValid).toBe(false);
			expect(result.errors.username).toBe("Username is required");
			expect(result.errors.password).toBe("Password is required");
		});
	});

	describe("checkPasswordStrength", () => {
		it("should rate weak passwords correctly", () => {
			const result = checkPasswordStrength("123");
			expect(result.score).toBe(0);
			expect(result.feedback).toContain("Use at least 8 characters");
		});

		it("should rate strong passwords correctly", () => {
			const result = checkPasswordStrength("MyStr0ng!P@ssw0rd");
			expect(result.score).toBe(4);
			expect(result.feedback).toHaveLength(0);
		});

		it("should provide helpful feedback", () => {
			const result = checkPasswordStrength("password");
			expect(result.feedback).toContain(
				"Use both uppercase and lowercase letters"
			);
			expect(result.feedback).toContain("Include at least one number");
			expect(result.feedback).toContain(
				"Include at least one special character"
			);
		});
	});
});
