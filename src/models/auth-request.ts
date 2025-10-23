/**
 * Authentication request interfaces for login and registration
 */

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	forename: string;
	surname: string;
}
