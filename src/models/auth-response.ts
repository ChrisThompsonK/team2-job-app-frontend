/**
 * Authentication response interfaces from backend API
 */

export interface AuthUser {
	userId: string;
	email: string;
	forename: string;
	surname: string;
	role: string;
}

export interface AuthSuccessResponse {
	message: string;
	user: AuthUser;
}

export interface AuthErrorResponse {
	error: string;
	message?: string;
	details?: string[];
}
