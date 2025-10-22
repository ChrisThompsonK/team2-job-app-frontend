/**
 * Express session type extensions
 */

import "express-session";
import type { User } from "../models/user.js";
import type { AuthUser } from "../models/auth-response.js";

declare module "express-session" {
	interface SessionData {
		user?: User | AuthUser;
		isAuthenticated?: boolean;
		loginTime?: Date;
		loginSuccess?: string;
	}
}
