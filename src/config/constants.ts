/**
 * Application configuration constants
 */

export const APP_CONFIG = {
	// Email domain for mock user accounts
	EMAIL_DOMAIN: "kainos.com",

	// Session configuration
	SESSION: {
		COOKIE_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
		COOKIE_NAME: "connect.sid",
	},
} as const;

/**
 * Generate a random session secret for development environments
 * In production, this should come from environment variables
 */
export function generateSessionSecret(): string {
	if (process.env["NODE_ENV"] === "production") {
		throw new Error(
			"Session secret must be provided via SESSION_SECRET environment variable in production"
		);
	}

	// Generate a random 32-character hex string for development
	const chars = "0123456789abcdef";
	let result = "";
	for (let i = 0; i < 64; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}
