/**
 * Environment configuration module
 * Loads and validates environment variables from .env file
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
config({ path: resolve(__dirname, "../../.env") });

/**
 * Environment configuration object with type-safe access to environment variables
 */
export const env = {
	// Node Environment
	nodeEnv: process.env["NODE_ENV"] || "development",
	isDevelopment: process.env["NODE_ENV"] === "development",
	isProduction: process.env["NODE_ENV"] === "production",
	isTest: process.env["NODE_ENV"] === "test",

	// Server Configuration
	port: Number.parseInt(process.env["PORT"] || "3000", 10),
	host: process.env["HOST"] || "localhost",

	// API Configuration
	apiBaseUrl: process.env["API_BASE_URL"] || "http://localhost:8080",
	apiTimeout: Number.parseInt(process.env["API_TIMEOUT"] || "10000", 10),

	// Application Configuration
	appName: process.env["APP_NAME"] || "team2-job-app-frontend",
	appVersion: process.env["APP_VERSION"] || "1.0.0",

	// Session & Security
	sessionSecret: process.env["SESSION_SECRET"] || "default-secret-change-me",

	// Logging
	logLevel: process.env["LOG_LEVEL"] || "info",

	// Frontend URLs
	frontendUrl: process.env["FRONTEND_URL"] || "http://localhost:3000",

	// Feature Flags
	enableDebug: process.env["ENABLE_DEBUG"] === "true",
} as const;

/**
 * Validates that all required environment variables are set
 * @throws Error if any required variables are missing or invalid
 */
export function validateEnv(): void {
	const errors: string[] = [];

	// Validate port
	if (Number.isNaN(env.port) || env.port < 1 || env.port > 65535) {
		errors.push("PORT must be a valid port number between 1 and 65535");
	}

	// Validate API timeout
	if (Number.isNaN(env.apiTimeout) || env.apiTimeout < 0) {
		errors.push("API_TIMEOUT must be a positive number");
	}

	// Validate session secret in production
	if (env.isProduction && env.sessionSecret === "default-secret-change-me") {
		errors.push("SESSION_SECRET must be set in production environment");
	}

	// Validate log level
	const validLogLevels = ["error", "warn", "info", "debug"];
	if (!validLogLevels.includes(env.logLevel)) {
		errors.push(`LOG_LEVEL must be one of: ${validLogLevels.join(", ")}`);
	}

	if (errors.length > 0) {
		throw new Error(
			`Environment validation failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`
		);
	}
}

/**
 * Logs current environment configuration (safe for development)
 */
export function logEnvConfig(): void {
	if (env.isDevelopment || env.enableDebug) {
		console.log("📋 Environment Configuration:");
		console.log(`  NODE_ENV: ${env.nodeEnv}`);
		console.log(`  PORT: ${env.port}`);
		console.log(`  HOST: ${env.host}`);
		console.log(`  API_BASE_URL: ${env.apiBaseUrl}`);
		console.log(`  API_TIMEOUT: ${env.apiTimeout}ms`);
		console.log(`  APP_NAME: ${env.appName}`);
		console.log(`  APP_VERSION: ${env.appVersion}`);
		console.log(`  LOG_LEVEL: ${env.logLevel}`);
		console.log(`  FRONTEND_URL: ${env.frontendUrl}`);
		console.log(`  ENABLE_DEBUG: ${env.enableDebug}`);
	}
}
