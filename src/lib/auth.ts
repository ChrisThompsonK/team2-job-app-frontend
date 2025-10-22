/**
 * Better Auth Configuration
 * Configures authentication with multiple providers and session management
 */

import { betterAuth } from "better-auth";

export const auth = betterAuth({
	// Base URL for redirects
	baseURL: process.env["BETTER_AUTH_URL"] || "http://localhost:3000",

	// Secret for signing tokens
	secret:
		process.env["BETTER_AUTH_SECRET"] || "dev-secret-key-change-in-production",

	// Trust host for development
	...(process.env["NODE_ENV"] !== "production" && {
		trustedOrigins: ["http://localhost:3000"],
	}),

	// Database - using in-memory adapter for development
	database: {
		provider: "sqlite",
		url: ":memory:",
	},

	// Email and password authentication
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false, // Set to true in production
	},

	// Additional user fields
	user: {
		additionalFields: {
			username: {
				type: "string",
				required: false,
			},
			userType: {
				type: "string",
				required: false,
				defaultValue: "User",
			},
		},
	},
});

// Export types for use in the application
export type BetterAuthSession = typeof auth.$Infer.Session;
export type BetterAuthUser = {
	id: string;
	email: string;
	name: string;
	username?: string;
	userType?: string;
	image?: string | null;
	createdAt: Date;
	updatedAt: Date;
	emailVerified: boolean;
};
