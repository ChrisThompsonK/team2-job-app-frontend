/**
 * Express session type extensions
 */

import "express-session";
import type { LegacyUser } from "../models/user.js";

declare module "express-session" {
	interface SessionData {
		user?: LegacyUser;
		isAuthenticated?: boolean;
		loginTime?: Date;
		redirectUrl?: string;
		// Enhanced auth session data
		betterAuthSession?: Record<string, unknown>;
		betterAuthUser?: Record<string, unknown>;
	}
}
