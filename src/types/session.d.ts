import "express-session";
import type { UserResponse } from "../models/auth-models";

declare module "express-session" {
	interface SessionData {
		user?: UserResponse;
		isAuthenticated?: boolean;
	}
}
