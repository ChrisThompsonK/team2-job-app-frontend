/**
 * User model interfaces for authentication and session management
 */

export interface User {
	id?: string;
	username: string;
	user_type: "Admin" | "User";
	email?: string;
}

export interface LoginRequest {
	username: string;
	password?: string;
}

export interface AuthSession {
	user: User;
	isAuthenticated: boolean;
	loginTime: Date;
}
