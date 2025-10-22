/**
 * Express session type extensions
 */

import "express-session";
import type { AuthUser } from "../models/auth-response.js";
import type { User } from "../models/user.js";

declare module "express-session" {
	interface SessionData {
		user?: User | AuthUser;
		isAuthenticated?: boolean;
		loginTime?: Date;
		loginSuccess?: string;
	}
}
