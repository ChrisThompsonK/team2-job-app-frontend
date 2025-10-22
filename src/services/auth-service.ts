/**
 * Authentication service for handling login and registration
 */

import type { LoginRequest, RegisterRequest } from "../models/auth-request.js";
import type {
	AuthErrorResponse,
	AuthSuccessResponse,
} from "../models/auth-response.js";

const AUTH_API_BASE_URL = "http://localhost:8000/api/auth";

export interface AuthService {
	login(credentials: LoginRequest): Promise<AuthSuccessResponse>;
	register(userData: RegisterRequest): Promise<AuthSuccessResponse>;
}

export class FetchAuthService implements AuthService {
	private baseUrl: string;

	constructor(baseUrl: string = AUTH_API_BASE_URL) {
		this.baseUrl = baseUrl;
	}

	/**
	 * Authenticate user with email and password
	 * @throws {AuthErrorResponse} When authentication fails
	 */
	public async login(credentials: LoginRequest): Promise<AuthSuccessResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(credentials),
			});

			const data = await response.json();

			if (!response.ok) {
				throw data as AuthErrorResponse;
			}

			return data as AuthSuccessResponse;
		} catch (error) {
			if (error && typeof error === "object" && "error" in error) {
				throw error as AuthErrorResponse;
			}
			throw {
				error: "Network Error",
				message:
					"Unable to connect to authentication server. Please try again later.",
			} as AuthErrorResponse;
		}
	}

	/**
	 * Register new user account
	 * @throws {AuthErrorResponse} When registration fails
	 */
	public async register(
		userData: RegisterRequest
	): Promise<AuthSuccessResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(userData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw data as AuthErrorResponse;
			}

			return data as AuthSuccessResponse;
		} catch (error) {
			if (error && typeof error === "object" && "error" in error) {
				throw error as AuthErrorResponse;
			}
			throw {
				error: "Network Error",
				message:
					"Unable to connect to authentication server. Please try again later.",
			} as AuthErrorResponse;
		}
	}
}
