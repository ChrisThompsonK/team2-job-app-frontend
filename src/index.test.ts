/**
 * Tests for the main App class and configuration
 */

import { beforeEach, describe, expect, it } from "vitest";
import { App, type AppConfig } from "./index";

describe("App", () => {
	let app: App;
	let testConfig: AppConfig;

	beforeEach(() => {
		testConfig = {
			name: "test-app",
			version: "1.0.0",
			environment: "test",
			port: 3001, // Use a different port for testing
		};
		app = new App(testConfig);
	});

	it("should create an app instance with correct config", () => {
		expect(app.getConfig()).toEqual(testConfig);
	});

	it("should create an Express server instance", () => {
		const server = app.getServer();
		expect(server).toBeDefined();
		expect(typeof server).toBe("function"); // Express app is a function
	});

	it("should return a copy of the configuration", () => {
		const config = app.getConfig();
		expect(config).toEqual(testConfig);

		// Verify it's a copy, not the original
		config.name = "modified";
		expect(app.getConfig().name).toBe("test-app");
	});

	it("should return the Express server instance", () => {
		const server = app.getServer();
		expect(server).toBeDefined();
	});
});

describe("AppConfig", () => {
	it("should have all required properties", () => {
		const config: AppConfig = {
			name: "test",
			version: "1.0.0",
			environment: "development",
			port: 3000,
		};

		expect(config.name).toBe("test");
		expect(config.version).toBe("1.0.0");
		expect(config.environment).toBe("development");
		expect(config.port).toBe(3000);
	});
});
