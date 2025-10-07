import axios, { type AxiosInstance } from "axios";
import type { LoginRequest, UserResponse } from "../models/auth-models";

const API_BASE_URL = process.env["API_BASE_URL"] || "http://localhost:8080";

export class AuthService {
	private axiosInstance: AxiosInstance;

	constructor(baseURL = API_BASE_URL) {
		this.axiosInstance = axios.create({
			baseURL,
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true, // Important for cookies/sessions
		});
	}

	async login(loginRequest: LoginRequest): Promise<UserResponse> {
		try {
			const response = await this.axiosInstance.post<UserResponse>(
				"/api/auth/login",
				loginRequest
			);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(
					error.response?.data?.message || "Login failed. Please try again."
				);
			}
			throw new Error("An unexpected error occurred during login.");
		}
	}

	async logout(): Promise<void> {
		try {
			await this.axiosInstance.post("/api/auth/logout");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(
					error.response?.data?.message || "Logout failed. Please try again."
				);
			}
			throw new Error("An unexpected error occurred during logout.");
		}
	}

	async getCurrentUser(): Promise<UserResponse> {
		try {
			const response =
				await this.axiosInstance.get<UserResponse>("/api/auth/me");
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(
					error.response?.data?.message || "Failed to get current user."
				);
			}
			throw new Error("An unexpected error occurred while fetching user data.");
		}
	}
}

export const authService = new AuthService();
