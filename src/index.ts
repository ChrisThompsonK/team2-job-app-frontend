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
import session from "express-session";
import multer from "multer";
import nunjucks from "nunjucks";
import "./types/session.js";
import { APP_CONFIG, generateSessionSecret } from "./config/constants.js";
import { AdminController } from "./controllers/admin-controller.js";
import { ApplicationController } from "./controllers/application-controller.js";
import { AuthController } from "./controllers/auth-controller.js";
import { JobRoleController } from "./controllers/job-role-controller.js";
import { UserController } from "./controllers/user-controller.js";
import { requireAdmin, requireAuth, requireMember } from "./middleware/auth.js";
import { addAuthContextToViews } from "./middleware/view-context.js";
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
	private authController: AuthController;
	private upload: multer.Multer;
	private initializationPromise: Promise<void>;

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
		this.authController = new AuthController();

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

		this.initializationPromise = this.initialize();
	}

	public async waitForInitialization(): Promise<void> {
		return this.initializationPromise;
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
		const viewsPath = __dirname.includes('dist') 
			? path.join(__dirname, "..", "src", "views")
			: path.join(__dirname, "views");
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
		// Add session middleware
		let sessionSecret = process.env["SESSION_SECRET"];
		if (!sessionSecret) {
			if (process.env["NODE_ENV"] === "production") {
				throw new Error(
					"SESSION_SECRET environment variable is required in production"
				);
			}
			sessionSecret = generateSessionSecret();
			console.warn(
				"Warning: Using generated session secret for development. Set SESSION_SECRET environment variable for production."
			);
		}

		this.server.use(
			session({
				secret: sessionSecret,
				resave: false,
				saveUninitialized: false,
				cookie: {
					secure: process.env["NODE_ENV"] === "production", // HTTPS in production
					httpOnly: true,
					maxAge: APP_CONFIG.SESSION.COOKIE_MAX_AGE,
				},
			})
		);

		// Add JSON parsing middleware
		this.server.use(express.json());

		// Add URL-encoded parsing middleware
		this.server.use(express.urlencoded({ extended: true }));

		// Middleware to add authentication context to all views
		this.server.use(addAuthContextToViews);

		// Serve static files from public directory
		const publicPath = path.join(__dirname, "..", "public");
		this.server.use(express.static(publicPath));
	}

	private setupRoutes(): void {
		// Test route
		this.server.get("/test", (_req: Request, res: Response) => {
			res.json({ message: "Server is working!" });
		});

		// Enhanced Authentication routes
		this.server.get("/auth/signin", this.authController.getSignIn);
		this.server.post("/auth/signin", this.authController.postSignIn);
		this.server.get("/auth/signup", this.authController.getSignUp);
		this.server.post("/auth/signup", this.authController.postSignUp);
		this.server.get(
			"/auth/forgot-password",
			this.authController.getForgotPassword
		);
		this.server.post(
			"/auth/forgot-password",
			this.authController.postForgotPassword
		);
		this.server.post("/auth/signout", this.authController.postSignOut);

		// Legacy login routes (keep for backward compatibility)
		this.server.get("/login", this.userController.getLoginPage);
		this.server.post("/login", this.userController.postLogin);
		this.server.post("/logout", this.userController.postLogout);

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

		// About page
		this.server.get("/about", (_req: Request, res: Response) => {
			res.render("about.njk");
		});

		// Contact page
		this.server.get("/contact", (_req: Request, res: Response) => {
			res.render("contact.njk");
		});

		// Job Roles endpoints (public, read-only)
		this.server.get("/job-roles", this.jobRoleController.getJobRoles);
		this.server.get("/jobs/search", this.jobRoleController.searchJobRoles);
		this.server.get("/job-roles/:id", this.jobRoleController.getJobRoleById);

		// Delete endpoints (both AJAX and form submission) - admin only
		this.server.delete(
			"/job-roles/:id",
			requireAuth,
			requireAdmin,
			this.jobRoleController.deleteJobRole
		);
		this.server.post(
			"/job-roles/:id/delete",
			requireAuth,
			requireAdmin,
			this.jobRoleController.deleteJobRoleForm
		);

		// Admin endpoints (job role creation and editing) - admin only
		this.server.get(
			"/admin/job-roles/new",
			requireAuth,
			requireAdmin,
			this.adminController.getCreateJobRole
		);
		// Export endpoint (must come before :id routes) - admin only
		this.server.get(
			"/admin/job-roles/export",
			requireAuth,
			requireAdmin,
			this.adminController.exportJobRoles
		);
		this.server.post(
			"/admin/job-roles",
			requireAuth,
			requireAdmin,
			this.adminController.createJobRole
		);
		this.server.get(
			"/admin/job-roles/:id/edit",
			requireAuth,
			requireAdmin,
			this.adminController.getEditJobRole
		);
		this.server.post(
			"/admin/job-roles/:id",
			requireAuth,
			requireAdmin,
			this.adminController.updateJobRole
		);

		// Application endpoints - members only
		this.server.get(
			"/job-roles/:id/apply",
			requireAuth,
			requireMember,
			this.applicationController.getApplicationForm
		);
		this.server.post(
			"/job-roles/:id/apply",
			requireAuth,
			requireMember,
			this.upload.single("cv"),
			this.applicationController.submitApplication
		);

		// View applicants endpoint - admin only
		this.server.get(
			"/job-roles/:id/applicants",
			requireAuth,
			requireAdmin,
			this.applicationController.getApplicants
		);

		// CV download endpoint (proxy to backend)
		this.server.get(
			"/applications/:id/cv",
			this.applicationController.downloadCv
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
const initializeApp = async () => {
	const app = new App(appConfig);
	// Wait for initialization to complete
	await app.waitForInitialization();
	return app;
};

// Handle unhandled promise rejections and exceptions
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	process.exit(1);
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	process.exit(1);
});

// Start the app
initializeApp().catch((error) => {
	console.error("Failed to start application:", error);
	process.exit(1);
});

export { App, type AppConfig };
