/**
 * Authentication service for handling login and registration
 */

import axios, { AxiosError, type AxiosInstance } from "axios";
import type { LoginRequest, RegisterRequest } from "../models/auth-request.js";
import type {
	AuthErrorResponse,
	AuthSuccessResponse,
} from "../models/auth-response.js";

// Load API base URL from environment variables with fallback for development
const AUTH_API_BASE_URL =
	process.env["AUTH_API_BASE_URL"] || "http://localhost:8000/api/auth";

export interface AuthService {
	login(credentials: LoginRequest): Promise<AuthSuccessResponse>;
	register(userData: RegisterRequest): Promise<AuthSuccessResponse>;
}

export class AxiosAuthService implements AuthService {
	private axiosInstance: AxiosInstance;

	constructor(baseUrl: string = AUTH_API_BASE_URL) {
		this.axiosInstance = axios.create({
			baseURL: baseUrl,
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		});
	}

	/**
	 * Authenticate user with email and password
	 * @throws {AuthErrorResponse} When authentication fails
	 */
	public async login(credentials: LoginRequest): Promise<AuthSuccessResponse> {
		try {
			const response = await this.axiosInstance.post<AuthSuccessResponse>(
				"/login",
				credentials
			);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError && error.response?.data) {
				throw error.response.data as AuthErrorResponse;
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
			const response = await this.axiosInstance.post<AuthSuccessResponse>(
				"/register",
				userData
			);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError && error.response?.data) {
				throw error.response.data as AuthErrorResponse;
			}
			throw {
				error: "Network Error",
				message:
					"Unable to connect to authentication server. Please try again later.",
			} as AuthErrorResponse;
		}
	}
}
