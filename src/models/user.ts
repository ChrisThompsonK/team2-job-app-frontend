/**
 * User model interfaces for authentication and session management
 * Compatible with better-auth schema
 */

export interface User {
	id: string;
	email: string;
	name?: string;
	username?: string;
	userType?: "Admin" | "User";
	image?: string;
	createdAt: Date;
	updatedAt: Date;
	emailVerified: boolean;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	name?: string;
	username?: string;
}

export interface AuthSession {
	user: User;
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
		token?: string;
		ipAddress?: string;
		userAgent?: string;
	};
}

// Legacy interface for backward compatibility
export interface LegacyUser {
	id?: string;
	username: string;
	user_type: "Admin" | "User";
	email?: string;
}

// Password reset interfaces
export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	token: string;
	password: string;
}
