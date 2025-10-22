/**
 * Unit tests for FetchAuthService
 */

/// <reference types="vitest/globals" />

import type {
	AuthErrorResponse,
	AuthSuccessResponse,
} from "../models/auth-response.js";
import { FetchAuthService } from "./auth-service.js";

// biome-ignore lint/suspicious/noExplicitAny: Mock objects require any type for testing

describe("FetchAuthService", () => {
	let service: FetchAuthService;
	const mockBaseUrl = "http://localhost:8000/api/auth";

	beforeEach(() => {
		service = new FetchAuthService(mockBaseUrl);
		// Reset fetch mock before each test
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("login", () => {
		const credentials = {
			email: "test@example.com",
			password: "SecurePass123!",
		};

		it("should successfully login with valid credentials", async () => {
			const mockResponse: AuthSuccessResponse = {
				message: "Login successful",
				user: {
					userId: "123",
					email: "test@example.com",
					forename: "John",
					surname: "Doe",
					role: "user",
				},
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const result = await service.login(credentials);

			expect(global.fetch).toHaveBeenCalledWith(`${mockBaseUrl}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(credentials),
			});

			expect(result).toEqual(mockResponse);
		});

		it("should throw AuthErrorResponse on authentication failure", async () => {
			const mockError: AuthErrorResponse = {
				error: "Unauthorized",
				message: "Invalid email or password",
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				json: async () => mockError,
			});

			await expect(service.login(credentials)).rejects.toEqual(mockError);
		});

		it("should throw network error when fetch fails", async () => {
			(global.fetch as any).mockRejectedValueOnce(new Error("Network failure"));

			await expect(service.login(credentials)).rejects.toEqual({
				error: "Network Error",
				message:
					"Unable to connect to authentication server. Please try again later.",
			});
		});

		it("should handle server error responses with details", async () => {
			const mockError: AuthErrorResponse = {
				error: "Validation Error",
				message: "Invalid input data",
				details: ["Email is required", "Password is too short"],
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				json: async () => mockError,
			});

			await expect(service.login(credentials)).rejects.toEqual(mockError);
		});
	});

	describe("register", () => {
		const userData = {
			email: "newuser@example.com",
			password: "SecurePass123!",
			forename: "Jane",
			surname: "Smith",
		};

		it("should successfully register a new user", async () => {
			const mockResponse: AuthSuccessResponse = {
				message: "Registration successful",
				user: {
					userId: "456",
					email: "newuser@example.com",
					forename: "Jane",
					surname: "Smith",
					role: "user",
				},
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			});

			const result = await service.register(userData);

			expect(global.fetch).toHaveBeenCalledWith(`${mockBaseUrl}/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(userData),
			});

			expect(result).toEqual(mockResponse);
		});

		it("should throw AuthErrorResponse on registration failure", async () => {
			const mockError: AuthErrorResponse = {
				error: "Bad Request",
				message: "Email already exists",
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				json: async () => mockError,
			});

			await expect(service.register(userData)).rejects.toEqual(mockError);
		});

		it("should throw network error when fetch fails", async () => {
			(global.fetch as any).mockRejectedValueOnce(new Error("Network failure"));

			await expect(service.register(userData)).rejects.toEqual({
				error: "Network Error",
				message:
					"Unable to connect to authentication server. Please try again later.",
			});
		});

		it("should handle validation errors with multiple details", async () => {
			const mockError: AuthErrorResponse = {
				error: "Validation Error",
				message: "Registration data is invalid",
				details: [
					"Email format is invalid",
					"Password must contain uppercase letter",
					"First name is required",
				],
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				json: async () => mockError,
			});

			await expect(service.register(userData)).rejects.toEqual(mockError);
		});
	});

	describe("constructor", () => {
		it("should use default base URL if not provided", () => {
			const defaultService = new FetchAuthService();
			expect(defaultService).toBeDefined();
		});

		it("should use custom base URL when provided", () => {
			const customUrl = "http://custom-api.com/auth";
			const customService = new FetchAuthService(customUrl);
			expect(customService).toBeDefined();
		});
	});
});
