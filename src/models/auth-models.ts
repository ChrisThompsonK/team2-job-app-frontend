export interface LoginRequest {
	email: string;
	password: string;
}

export interface UserResponse {
	id: number;
	email: string;
	is_admin: boolean;
	token?: string;
}

export interface AuthState {
	isAuthenticated: boolean;
	user: UserResponse | null;
}
