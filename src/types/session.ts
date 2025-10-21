/**
 * Express session type extensions
 */

import "express-session";
import type { User } from "../models/user.js";

declare module "express-session" {
	interface SessionData {
		user?: User;
		isAuthenticated?: boolean;
		loginTime?: Date;
	}
}
