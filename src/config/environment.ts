/**
 * Environment Configuration Module
 * Centralizes all environment variable access with type safety and validation
 * 
 * Following best practices from app-configuration.md:
 * - Load dotenv at the top of the main entry point (index.ts)
 * - Validate REQUIRED variables and throw errors if missing
 * - Provide defaults for optional variables
 * - All environment variables are strings - convert types as needed
 */

/**
 * Configuration interface for type safety
 */
interface Config {
	// Server Configuration
	nodeEnv: string;
	port: number;
	host: string;

	// API Configuration
	apiBaseUrl: string;
	apiTimeout: number;

	// Application Information
	appName: string;
	appVersion: string;
	appDescription: string;

	// Feature Flags
	enableMockData: boolean;
	enableDarkMode: boolean;
	enableAccessibilityFeatures: boolean;

	// Logging
	logLevel: string;
	enableDebugLogs: boolean;

	// Session/Storage
	sessionTimeout: number;
	storagePrefix: string;
}

/**
 * Parse boolean environment variables
 * Environment variables are always strings, so we need to convert them
 */
function parseBoolean(value: string | undefined, defaultValue = false): boolean {
	if (!value) return defaultValue;
	return value.toLowerCase() === "true" || value === "1";
}

/**
 * Parse integer environment variables
 * Remember: process.env values are always strings!
 */
function parseIntSafe(value: string | undefined, defaultValue: number): number {
	if (!value) return defaultValue;
	const parsed = Number.parseInt(value, 10);
	return Number.isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Get environment variable with fallback
 */
function getEnv(key: string, defaultValue = ""): string {
	return process.env[key] || defaultValue;
}

/**
 * Validate REQUIRED environment variables
 * Following the presentation pattern: throw errors for truly required values
 * 
 * Note: For this frontend application, most variables have sensible defaults.
 * In a real production app with database connections or API keys, you would add:
 * - DATABASE_URL (required in production)
 * - API_KEY (required if using external APIs)
 * - API_SECRET (required for secure API access)
 */
function validateRequiredVariables(): void {
	// For this frontend app, we don't have any truly REQUIRED variables
	// Everything has sensible defaults for development
	
	// Example of what you would do for required variables:
	// const required = ['DATABASE_URL', 'API_KEY'] as const;
	// for (const key of required) {
	//   if (!process.env[key]) {
	//     throw new Error(`Missing required environment variable: ${key}`);
	//   }
	// }
	
	// Instead, we just warn about missing recommended variables
	const recommended = ["NODE_ENV", "PORT"] as const;
	const missing = recommended.filter((key) => !process.env[key]);
	
	if (missing.length > 0) {
		console.warn(
			`⚠️  Missing recommended environment variables: ${missing.join(", ")}. Using defaults.`,
		);
	}
}

// Validate required variables at module load time
validateRequiredVariables();

/**
 * Centralized configuration object
 * All application configuration should be accessed through this object
 */
export const config: Config = {
	// Server Configuration
	nodeEnv: getEnv("NODE_ENV", "development"),
	port: parseIntSafe(getEnv("PORT"), 3000),
	host: getEnv("HOST", "localhost"),

	// API Configuration
	apiBaseUrl: getEnv("API_BASE_URL", "http://localhost:8080"),
	apiTimeout: parseIntSafe(getEnv("API_TIMEOUT"), 5000),

	// Application Information
	appName: getEnv("APP_NAME", "Kainos Job Application Portal"),
	appVersion: getEnv("APP_VERSION", "1.0.0"),
	appDescription: getEnv(
		"APP_DESCRIPTION",
		"Modern Job Application Frontend",
	),

	// Feature Flags
	enableMockData: parseBoolean(getEnv("ENABLE_MOCK_DATA"), true),
	enableDarkMode: parseBoolean(getEnv("ENABLE_DARK_MODE"), true),
	enableAccessibilityFeatures: parseBoolean(
		getEnv("ENABLE_ACCESSIBILITY_FEATURES"),
		true,
	),

	// Logging
	logLevel: getEnv("LOG_LEVEL", "info"),
	enableDebugLogs: parseBoolean(getEnv("ENABLE_DEBUG_LOGS"), false),

	// Session/Storage
	sessionTimeout: parseIntSafe(getEnv("SESSION_TIMEOUT"), 3600000),
	storagePrefix: getEnv("STORAGE_PREFIX", "kainos_job_app_"),
};

/**
 * Legacy validation function for backwards compatibility
 * The validation now happens automatically at module load
 */
export function validateConfig(): void {
	// Validation already done at module load, but keeping this for backwards compatibility
	validateRequiredVariables();
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
	return config.nodeEnv === "development";
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
	return config.nodeEnv === "production";
}

/**
 * Log configuration (safely, without sensitive data)
 */
export function logConfig(): void {
	console.log("📋 Application Configuration:");
	console.log(`   Environment: ${config.nodeEnv}`);
	console.log(`   Port: ${config.port}`);
	console.log(`   Host: ${config.host}`);
	console.log(`   App Name: ${config.appName}`);
	console.log(`   App Version: ${config.appVersion}`);
	console.log(`   API Base URL: ${config.apiBaseUrl}`);
	console.log(`   Mock Data: ${config.enableMockData ? "Enabled" : "Disabled"}`);
	console.log(
		`   Dark Mode: ${config.enableDarkMode ? "Enabled" : "Disabled"}`,
	);
	console.log(
		`   Accessibility: ${config.enableAccessibilityFeatures ? "Enabled" : "Disabled"}`,
	);
	console.log(`   Log Level: ${config.logLevel}`);
}

export default config;
