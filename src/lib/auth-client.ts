/**
 * Better Auth Client Configuration
 * Client-side authentication functions and utilities
 */

import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
	baseURL:
		typeof window !== "undefined"
			? window.location.origin
			: process.env["BETTER_AUTH_URL"] || "http://localhost:3000",
	fetchOptions: {
		onError(e) {
			if (e.error.status === 429) {
				throw new Error("Too many requests. Please try again later.");
			}
			throw e.error;
		},
	},
});

// Auth helper functions for frontend
export const authHelpers = {
	/**
	 * Sign in with email and password
	 */
	async signIn(email: string, password: string) {
		try {
			const { data, error } = await authClient.signIn.email({
				email,
				password,
			});

			if (error) {
				throw new Error(error.message || "Login failed");
			}

			return { success: true, data };
		} catch (error) {
			console.error("Sign in error:", error);
			throw error;
		}
	},

	/**
	 * Sign up with email and password
	 */
	async signUp(email: string, password: string, name?: string) {
		try {
			const { data, error } = await authClient.signUp.email({
				email,
				password,
				name: name || "",
			});

			if (error) {
				throw new Error(error.message || "Registration failed");
			}

			return { success: true, data };
		} catch (error) {
			console.error("Sign up error:", error);
			throw error;
		}
	},

	/**
	 * Sign out current user
	 */
	async signOut() {
		try {
			await authClient.signOut();
			return { success: true };
		} catch (error) {
			console.error("Sign out error:", error);
			throw error;
		}
	},

	/**
	 * Get current session
	 */
	async getSession() {
		try {
			const { data } = await authClient.getSession();
			return data;
		} catch (error) {
			console.error("Get session error:", error);
			return null;
		}
	},

	/**
	 * Forgot password
	 */
	async forgotPassword(email: string) {
		try {
			const { data, error } = await authClient.forgetPassword({
				email,
				redirectTo: `${window.location.origin}/reset-password`,
			});

			if (error) {
				throw new Error(error.message || "Failed to send reset email");
			}

			return { success: true, data };
		} catch (error) {
			console.error("Forgot password error:", error);
			throw error;
		}
	},

	/**
	 * Reset password with token
	 */
	async resetPassword(token: string, password: string) {
		try {
			const { data, error } = await authClient.resetPassword({
				token,
				newPassword: password,
			});

			if (error) {
				throw new Error(error.message || "Failed to reset password");
			}

			return { success: true, data };
		} catch (error) {
			console.error("Reset password error:", error);
			throw error;
		}
	},
};

// Export session management utilities
export const sessionUtils = {
	/**
	 * Check if user is authenticated
	 */
	async isAuthenticated(): Promise<boolean> {
		try {
			const session = await authHelpers.getSession();
			return !!session?.user;
		} catch {
			return false;
		}
	},

	/**
	 * Get current user
	 */
	async getCurrentUser() {
		try {
			const session = await authHelpers.getSession();
			return session?.user || null;
		} catch {
			return null;
		}
	},

	/**
	 * Require authentication (redirect to login if not authenticated)
	 */
	async requireAuth(redirectPath = "/login") {
		const isAuth = await this.isAuthenticated();
		if (!isAuth) {
			window.location.href = redirectPath;
			return false;
		}
		return true;
	},
};
