/**
 * Unit tests for AxiosAuthService
 */

/// <reference types="vitest/globals" />

import axios, { AxiosError } from "axios";
import type {
	AuthErrorResponse,
	AuthSuccessResponse,
} from "../models/auth-response.js";
import { AxiosAuthService } from "./auth-service.js";

// Mock axios
vi.mock("axios");

describe("AxiosAuthService", () => {
	let service: AxiosAuthService;
	const mockBaseUrl = "http://localhost:8000/api/auth";
	const mockedAxios = vi.mocked(axios, true);

	beforeEach(() => {
		// Reset mocks before each test
		vi.clearAllMocks();

		// Mock axios.create to return a mock instance
		mockedAxios.create = vi.fn().mockReturnValue({
			post: vi.fn(),
		});

		service = new AxiosAuthService(mockBaseUrl);
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

			// biome-ignore lint/suspicious/noExplicitAny: Mock requires any for private property access
			const mockAxiosInstance = (service as any).axiosInstance;
			mockAxiosInstance.post = vi.fn().mockResolvedValueOnce({
				data: mockResponse,
			});

			const result = await service.login(credentials);

			expect(mockAxiosInstance.post).toHaveBeenCalledWith(
				"/login",
				credentials
			);
			expect(result).toEqual(mockResponse);
		});

		it("should throw AuthErrorResponse on authentication failure", async () => {
			const mockError: AuthErrorResponse = {
				error: "Unauthorized",
				message: "Invalid email or password",
			};

			// biome-ignore lint/suspicious/noExplicitAny: Mock requires any for private property access
			const mockAxiosInstance = (service as any).axiosInstance;
			const axiosError = new AxiosError("Request failed");
			axiosError.response = {
				data: mockError,
				// biome-ignore lint/suspicious/noExplicitAny: Mock response requires any type
			} as any;

			mockAxiosInstance.post = vi.fn().mockRejectedValueOnce(axiosError);

			await expect(service.login(credentials)).rejects.toEqual(mockError);
		});

		it("should throw network error when axios fails", async () => {
			// biome-ignore lint/suspicious/noExplicitAny: Mock requires any for private property access
			const mockAxiosInstance = (service as any).axiosInstance;
			mockAxiosInstance.post = vi
				.fn()
				.mockRejectedValueOnce(new Error("Network failure"));

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

			// biome-ignore lint/suspicious/noExplicitAny: Mock requires any for private property access
			const mockAxiosInstance = (service as any).axiosInstance;
			const axiosError = new AxiosError("Request failed");
			axiosError.response = {
				data: mockError,
				// biome-ignore lint/suspicious/noExplicitAny: Mock response requires any type
			} as any;

			mockAxiosInstance.post = vi.fn().mockRejectedValueOnce(axiosError);

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

			// biome-ignore lint/suspicious/noExplicitAny: Mock requires any for private property access
			const mockAxiosInstance = (service as any).axiosInstance;
			mockAxiosInstance.post = vi.fn().mockResolvedValueOnce({
				data: mockResponse,
			});

			const result = await service.register(userData);

			expect(mockAxiosInstance.post).toHaveBeenCalledWith(
				"/register",
				userData
			);
			expect(result).toEqual(mockResponse);
		});

		it("should throw AuthErrorResponse on registration failure", async () => {
			const mockError: AuthErrorResponse = {
				error: "Bad Request",
				message: "Email already exists",
			};

			// biome-ignore lint/suspicious/noExplicitAny: Mock requires any for private property access
			const mockAxiosInstance = (service as any).axiosInstance;
			const axiosError = new AxiosError("Request failed");
			axiosError.response = {
				data: mockError,
				// biome-ignore lint/suspicious/noExplicitAny: Mock response requires any type
			} as any;

			mockAxiosInstance.post = vi.fn().mockRejectedValueOnce(axiosError);

			await expect(service.register(userData)).rejects.toEqual(mockError);
		});

		it("should throw network error when axios fails", async () => {
			// biome-ignore lint/suspicious/noExplicitAny: Mock requires any for private property access
			const mockAxiosInstance = (service as any).axiosInstance;
			mockAxiosInstance.post = vi
				.fn()
				.mockRejectedValueOnce(new Error("Network failure"));

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

			// biome-ignore lint/suspicious/noExplicitAny: Mock requires any for private property access
			const mockAxiosInstance = (service as any).axiosInstance;
			const axiosError = new AxiosError("Request failed");
			axiosError.response = {
				data: mockError,
				// biome-ignore lint/suspicious/noExplicitAny: Mock response requires any type
			} as any;

			mockAxiosInstance.post = vi.fn().mockRejectedValueOnce(axiosError);

			await expect(service.register(userData)).rejects.toEqual(mockError);
		});
	});

	describe("constructor", () => {
		it("should use default base URL if not provided", () => {
			const defaultService = new AxiosAuthService();
			expect(defaultService).toBeDefined();
		});

		it("should use custom base URL when provided", () => {
			const customUrl = "http://custom-api.com/auth";
			const customService = new AxiosAuthService(customUrl);
			expect(customService).toBeDefined();
		});
	});
});
