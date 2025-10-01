/**
 * Main entry point for the Express application
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import nunjucks from "nunjucks";

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AppConfig {
	name: string;
	version: string;
	environment: string;
	port: number;
}

class App {
	private config: AppConfig;
	private server: Application;

	constructor(config: AppConfig) {
		this.config = config;
		this.server = express();
		this.setupMiddleware();
		this.setupRoutes();
	}

	private setupMiddleware(): void {
		// Configure Nunjucks templating engine
		const viewsPath = path.join(__dirname, "..", "views");
		nunjucks.configure(viewsPath, {
			autoescape: true,
			express: this.server,
			watch: false, // Disable watching for now
		});

		// Set view engine
		this.server.set("view engine", "njk");

		// Add JSON parsing middleware
		this.server.use(express.json());

		// Add URL-encoded parsing middleware
		this.server.use(express.urlencoded({ extended: true }));

		// Add middleware for global template variables
		this.server.use((_req, res, next) => {
			res.locals["appName"] = this.config.name;
			res.locals["currentYear"] = new Date().getFullYear();
			next();
		});
	}

	private setupRoutes(): void {
		// Home page
		this.server.get("/", (_req: Request, res: Response) => {
			res.render("home", {
				title: this.config.name,
				message: "Hello World!",
				app: this.config.name,
				version: this.config.version,
				environment: this.config.environment,
				timestamp: new Date().toISOString(),
				requestId: Math.random().toString(36).substr(2, 9),
			});
		});

		// Health check endpoint
		this.server.get("/health", (_req: Request, res: Response) => {
			const uptimeSeconds = process.uptime();
			const uptimeFormatted = this.formatUptime(uptimeSeconds);
			const memoryUsage = this.formatMemoryUsage(
				process.memoryUsage().heapUsed
			);

			res.render("health", {
				title: "Health Check",
				status: "OK",
				uptime: uptimeSeconds,
				uptimeFormatted,
				memoryUsage,
				timestamp: new Date().toISOString(),
				nodeVersion: process.version,
				platform: process.platform,
			});
		});
	}

	private formatUptime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);
		return `${hours}h ${minutes}m ${secs}s`;
	}

	private formatMemoryUsage(bytes: number): string {
		const mb = bytes / 1024 / 1024;
		return `${mb.toFixed(1)} MB`;
	}

	public start(): void {
		this.server.listen(this.config.port, () => {
			console.log(`🚀 Starting ${this.config.name} v${this.config.version}`);
			console.log(`📦 Environment: ${this.config.environment}`);
			console.log(`🌐 Server running on http://localhost:${this.config.port}`);
			console.log(
				"✅ Application is running with TypeScript, ES Modules, Express & Nunjucks!"
			);
		});
	}

	public getConfig(): AppConfig {
		return { ...this.config };
	}

	public getServer(): Application {
		return this.server;
	}
}

// Application configuration
const appConfig: AppConfig = {
	name: "team2-job-app-frontend",
	version: "1.0.0",
	environment: process.env["NODE_ENV"] ?? "development",
	port: parseInt(process.env["PORT"] ?? "3000", 10),
};

// Initialize and start the application
const app = new App(appConfig);
app.start();

export { App, type AppConfig };
