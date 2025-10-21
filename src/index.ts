/**
 * Main entry point for the Express application
 */

import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import multer from "multer";
import nunjucks from "nunjucks";
import { AdminController } from "./controllers/admin-controller.js";
import { ApplicationController } from "./controllers/application-controller.js";
import { JobRoleController } from "./controllers/job-role-controller.js";
import { UserController } from "./controllers/user-controller.js";
import { AxiosApplicationService } from "./services/axios-application-service.js";
import { AxiosJobRoleService } from "./services/axios-job-role-service.js";
import { JobRoleValidator } from "./utils/job-role-validator.js";

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
	private jobRoleService: AxiosJobRoleService;
	private jobRoleController: JobRoleController;
	private adminController: AdminController;
	private applicationService: AxiosApplicationService;
	private applicationController: ApplicationController;
	private userController: UserController;
	private upload: multer.Multer;

	constructor(config: AppConfig) {
		this.config = config;
		this.server = express();

		// Initialize services with dependency injection
		this.jobRoleService = new AxiosJobRoleService();
		const jobRoleValidator = new JobRoleValidator();

		// Initialize controllers
		this.jobRoleController = new JobRoleController(this.jobRoleService);
		this.adminController = new AdminController(
			this.jobRoleService,
			jobRoleValidator
		);
		this.applicationService = new AxiosApplicationService();
		this.applicationController = new ApplicationController(
			this.applicationService,
			this.jobRoleService
		);
		this.userController = new UserController();

		// Configure multer for file uploads
		this.upload = multer({
			storage: multer.memoryStorage(),
			limits: {
				fileSize: 5 * 1024 * 1024, // 5MB limit
			},
			fileFilter: (_req, file, cb) => {
				// Accept only PDF, DOC, and DOCX files
				const allowedMimes = [
					"application/pdf",
					"application/msword",
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				];
				if (allowedMimes.includes(file.mimetype)) {
					cb(null, true);
				} else {
					cb(
						new Error(
							"Invalid file type. Only PDF, DOC, and DOCX files are allowed."
						)
					);
				}
			},
		});

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

		// Add date formatting filter for dd/mm/yyyy format (dates only)
		env.addFilter("formatDate", (dateString: string) => {
			if (!dateString) return "";

			try {
				const date = new Date(dateString);

				// Check if date is valid
				if (Number.isNaN(date.getTime())) return dateString;

				const day = String(date.getDate()).padStart(2, "0");
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const year = date.getFullYear();

				return `${day}/${month}/${year}`;
			} catch {
				return dateString;
			}
		});

		// Add date/time formatting filter for dd/mm/yyyy HH:MM:SS format
		env.addFilter("formatDateTime", (dateString: string) => {
			if (!dateString) return "";

			try {
				const date = new Date(dateString);

				// Check if date is valid
				if (Number.isNaN(date.getTime())) return dateString;

				const day = String(date.getDate()).padStart(2, "0");
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const year = date.getFullYear();
				const hours = String(date.getHours()).padStart(2, "0");
				const minutes = String(date.getMinutes()).padStart(2, "0");
				const seconds = String(date.getSeconds()).padStart(2, "0");

				return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
			} catch {
				return dateString;
			}
		});

		// Add band level formatting filter (adds "Level" suffix)
		env.addFilter("formatBand", (band: string) => {
			if (!band) return "";
			return `${band} Level`;
		});

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
		// Login routes
		this.server.get("/login", this.userController.getLoginPage);
		this.server.post("/login", this.userController.postLogin);

		// Health check endpoint to test backend connectivity
		this.server.get("/api/health", async (_req: Request, res: Response) => {
			try {
				const backendUrl =
					process.env["API_BASE_URL"] || "http://localhost:8080";
				const testResponse = await fetch(`${backendUrl}/api/job-roles`);

				if (testResponse.ok) {
					res.json({
						status: "ok",
						backend: "connected",
						backendUrl,
						message: "Backend API is reachable",
					});
				} else {
					res.status(503).json({
						status: "error",
						backend: "error",
						backendUrl,
						statusCode: testResponse.status,
						message: `Backend API returned status ${testResponse.status}`,
					});
				}
			} catch (error) {
				const backendUrl =
					process.env["API_BASE_URL"] || "http://localhost:8080";
				res.status(503).json({
					status: "error",
					backend: "unreachable",
					backendUrl,
					message:
						error instanceof Error
							? error.message
							: "Cannot connect to backend API",
					suggestion: `Please ensure the backend API is running on ${backendUrl}`,
				});
			}
		});

		// Home page
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

		// Job Roles endpoints (public, read-only)
		this.server.get("/job-roles", this.jobRoleController.getJobRoles);
		this.server.get("/jobs/search", this.jobRoleController.searchJobRoles);
		this.server.get("/job-roles/:id", this.jobRoleController.getJobRoleById);

		// Delete endpoints (both AJAX and form submission)
		this.server.delete("/job-roles/:id", this.jobRoleController.deleteJobRole);
		this.server.post(
			"/job-roles/:id/delete",
			this.jobRoleController.deleteJobRoleForm
		);

		// Admin endpoints (job role creation and editing)
		this.server.get(
			"/admin/job-roles/new",
			this.adminController.getCreateJobRole
		);
		this.server.post("/admin/job-roles", this.adminController.createJobRole);
		this.server.get(
			"/admin/job-roles/:id/edit",
			this.adminController.getEditJobRole
		);
		this.server.post(
			"/admin/job-roles/:id",
			this.adminController.updateJobRole
		);

		// Application endpoints
		this.server.get(
			"/job-roles/:id/apply",
			this.applicationController.getApplicationForm
		);
		this.server.post(
			"/job-roles/:id/apply",
			this.upload.single("cv"),
			this.applicationController.submitApplication
		);

		// View applicants endpoint
		this.server.get(
			"/job-roles/:id/applicants",
			this.applicationController.getApplicants
		);

		// Error handling middleware - must be last
		this.setupErrorHandling();
	}

	private setupErrorHandling(): void {
		// Multer error handling middleware
		this.server.use(
			(
				err: Error,
				_req: express.Request,
				res: express.Response,
				next: express.NextFunction
			) => {
				if (err instanceof multer.MulterError) {
					// Handle multer-specific errors
					let message = "File upload error occurred.";

					switch (err.code) {
						case "LIMIT_FILE_SIZE":
							message =
								"File is too large. Maximum file size is 5MB. Please upload a smaller file.";
							break;
						case "LIMIT_FILE_COUNT":
							message =
								"Too many files uploaded. Please upload only one CV file.";
							break;
						case "LIMIT_UNEXPECTED_FILE":
							message =
								"Unexpected field name. Please use the correct form field.";
							break;
						default:
							message = `File upload error: ${err.message}`;
					}

					console.error("Multer error:", err);
					res.status(400).render("error.njk", {
						message,
					});
					return;
				}

				// Handle other errors
				if (err.message?.includes("Invalid file type")) {
					console.error("File type error:", err);
					res.status(400).render("error.njk", {
						message: err.message,
					});
					return;
				}

				// Pass to next error handler
				next(err);
			}
		);

		// Generic error handling middleware
		this.server.use(
			(
				err: Error,
				_req: express.Request,
				res: express.Response,
				_next: express.NextFunction
			) => {
				console.error("Unhandled error:", err);
				res.status(500).render("error.njk", {
					message:
						"An unexpected error occurred. Please try again later or contact support.",
				});
			}
		);
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
	port: Number.parseInt(process.env["PORT"] ?? "3000", 10),
};

// Initialize and start the application
export const app = new App(appConfig);
// Note: The start() method is called automatically after async initialization

export { App, type AppConfig };
