#!/usr/bin/env node

/**
 * Environment Validation Script
 * Validates that all required environment variables are set
 */

import { validateConfig, logConfig } from "../dist/config/environment.js";

console.log("🔍 Validating environment configuration...\n");

try {
	validateConfig();
	logConfig();
	console.log("\n✅ Environment configuration is valid!");
	process.exit(0);
} catch (error) {
	console.error("\n❌ Environment configuration validation failed:");
	console.error(error);
	process.exit(1);
}
