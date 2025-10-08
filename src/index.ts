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
import { JobRoleController } from "./controllers/job-role-controller.js";
import { JsonJobRoleService } from "./services/job-role-service.js";

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
	private jobRoleService: JsonJobRoleService;
	private jobRoleController: JobRoleController;

	constructor(config: AppConfig) {
		this.config = config;
		this.server = express();

		// Initialize services with dependency injection
		this.jobRoleService = new JsonJobRoleService();
		this.jobRoleController = new JobRoleController(this.jobRoleService);

		this.initialize();
	}

	private async initialize(): Promise<void> {
		await this.setupTemplating();
		this.setupMiddleware();
		this.setupRoutes();
		this.start();
	}

	private async setupTemplating(): Promise<void> {
		// Configure Nunjucks - Fix the views path to point to the correct location
		// When running with tsx, __dirname points to src/, when compiled it points to dist/
		const viewsPath = path.join(__dirname, "views");
		console.log(`Templates path: ${viewsPath}`);

		const env = nunjucks.configure(viewsPath, {
			autoescape: true,
			express: this.server,
			watch: true, // Enable auto-reloading in development
		});

		// Add Lucide icon filter for rendering SVG icons
		env.addFilter(
			"lucideIcon",
			(iconName: string, options: { className?: string } = {}) => {
				const className = options.className || "";
				// Return a simple placeholder for icons since we don't have full Lucide integration
				// In a full implementation, this would render actual SVG icons
				return `<span class="icon ${className}" data-icon="${iconName}">🔹</span>`;
			}
		);

		console.log("Nunjucks filters configured successfully");
	}

	private setupMiddleware(): void {
		// Add JSON parsing middleware
		this.server.use(express.json());

		// Add URL-encoded parsing middleware
		this.server.use(express.urlencoded({ extended: true }));

		// Serve static files from public directory
		const publicPath = path.join(__dirname, "..", "public");
		this.server.use(express.static(publicPath));
	}

	private setupRoutes(): void {
		// Hello World endpoint - now renders a Nunjucks view
		this.server.get("/", (_req: Request, res: Response) => {
			const now = new Date();
			const readableTime = now.toLocaleString("en-GB", {
				day: "numeric",
				month: "numeric",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
			res.render("index.njk", {
				message: "Hello World!",
				app: this.config.name,
				version: this.config.version,
				environment: this.config.environment,
				timestamp: readableTime,
			});
		});

		// Job Roles endpoints
		this.server.get("/job-roles", this.jobRoleController.getJobRoles);
		this.server.get("/job-roles/:id", this.jobRoleController.getJobRoleById);

		// Login endpoint
		this.server.get("/login", this.jobRoleController.getLogin);
	}

	public start(): void {
		this.server.listen(this.config.port, () => {
			console.log(`🚀 Starting ${this.config.name} v${this.config.version}`);
			console.log(`📦 Environment: ${this.config.environment}`);
			console.log(`🌐 Server running on http://localhost:${this.config.port}`);
			console.log(
				"✅ Application is running with TypeScript, ES Modules, and Express!"
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
export const app = new App(appConfig);
// Note: The start() method is called automatically after async initialization

export { App, type AppConfig };
