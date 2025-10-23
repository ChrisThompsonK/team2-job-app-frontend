/**
 * Authentication controller for handling login and registration routes
 */

import type { Request, Response } from "express";
import { AxiosAuthService } from "../services/auth-service.js";
import { AuthValidator } from "../utils/auth-validator.js";

export class AuthController {
	private authService: AxiosAuthService;
	private validator: AuthValidator;

	constructor(authService?: AxiosAuthService) {
		this.authService = authService || new AxiosAuthService();
		this.validator = new AuthValidator();
	}

	/**
	 * Render login page (redirect to home if already authenticated)
	 */
	public getLogin = (req: Request, res: Response): void => {
		try {
			// Check if user is already authenticated
			if (req.session.isAuthenticated || req.session.user) {
				res.redirect("/");
				return;
			}

			res.render("login.njk", {
				title: "Login",
			});
		} catch (error) {
			console.error("Error in AuthController.getLogin:", error);
			res.status(500).render("error.njk", {
				message: "Could not load login page. Please try again later.",
			});
		}
	};

	/**
	 * Render registration page (redirect to home if already authenticated)
	 */
	public getRegister = (req: Request, res: Response): void => {
		try {
			// Check if user is already authenticated
			if (req.session.isAuthenticated || req.session.user) {
				res.redirect("/");
				return;
			}

			res.render("register.njk", {
				title: "Register",
			});
		} catch (error) {
			console.error("Error in AuthController.getRegister:", error);
			res.status(500).render("error.njk", {
				message: "Could not load registration page. Please try again later.",
			});
		}
	};

	/**
	 * Handle login form submission (server-side fallback)
	 */
	public postLogin = async (req: Request, res: Response): Promise<void> => {
		try {
			const { email, password } = req.body;

			// Validate inputs
			const validationErrors: string[] = [];

			const emailValidation = this.validator.validateEmail(email);
			if (!emailValidation.isValid) {
				validationErrors.push(...emailValidation.errors);
			}

			const passwordValidation = this.validator.validatePassword(password);
			if (!passwordValidation.isValid) {
				validationErrors.push(...passwordValidation.errors);
			}

			// If validation fails, re-render form with errors
			if (validationErrors.length > 0) {
				res.status(400).render("login.njk", {
					title: "Login",
					validationErrors,
					formData: { email },
				});
				return;
			}

			// Attempt login
			const result = await this.authService.login({ email, password });

			// Set session
			req.session.isAuthenticated = true;
			req.session.user = result.user;

			// Redirect to homepage with success message in session
			req.session.loginSuccess = `Logged in successfully as: ${result.user.forename} ${result.user.surname}`;
			res.redirect("/");
		} catch (error: unknown) {
			console.error("Error in AuthController.postLogin:", error);

			// Handle authentication errors
			if (error && typeof error === "object" && "error" in error) {
				const authError = error as { error: string; message: string };
				res.status(401).render("login.njk", {
					title: "Login",
					validationErrors: [authError.message || "Invalid credentials"],
					formData: { email: req.body.email },
				});
				return;
			}

			// Generic error
			res.status(500).render("login.njk", {
				title: "Login",
				validationErrors: ["An error occurred. Please try again later."],
				formData: { email: req.body.email },
			});
		}
	};

	/**
	 * Handle registration form submission (server-side fallback)
	 */
	public postRegister = async (req: Request, res: Response): Promise<void> => {
		try {
			const { email, password, forename, surname } = req.body;

			// Validate inputs
			const validationErrors: string[] = [];

			const emailValidation = this.validator.validateEmail(email);
			if (!emailValidation.isValid) {
				validationErrors.push(...emailValidation.errors);
			}

			const passwordValidation = this.validator.validatePassword(password);
			if (!passwordValidation.isValid) {
				validationErrors.push(...passwordValidation.errors);
			}

			const forenameValidation = this.validator.validateName(
				forename,
				"First name"
			);
			if (!forenameValidation.isValid) {
				validationErrors.push(...forenameValidation.errors);
			}

			const surnameValidation = this.validator.validateName(
				surname,
				"Last name"
			);
			if (!surnameValidation.isValid) {
				validationErrors.push(...surnameValidation.errors);
			}

			// If validation fails, re-render form with errors
			if (validationErrors.length > 0) {
				res.status(400).render("register.njk", {
					title: "Register",
					validationErrors,
					formData: { email, forename, surname },
				});
				return;
			}

			// Attempt registration
			const result = await this.authService.register({
				email,
				password,
				forename,
				surname,
			});

			// Set session
			req.session.isAuthenticated = true;
			req.session.user = result.user;

			// Redirect to homepage with success message in session
			req.session.loginSuccess = `Registered and logged in successfully as: ${result.user.forename} ${result.user.surname}`;
			res.redirect("/");
		} catch (error: unknown) {
			console.error("Error in AuthController.postRegister:", error);

			// Handle registration errors
			if (error && typeof error === "object" && "error" in error) {
				const authError = error as {
					error: string;
					message: string;
					details?: string[];
				};
				const errorMessages = authError.details || [
					authError.message || "Registration failed",
				];
				res.status(400).render("register.njk", {
					title: "Register",
					validationErrors: errorMessages,
					formData: {
						email: req.body.email,
						forename: req.body.forename,
						surname: req.body.surname,
					},
				});
				return;
			}

			// Generic error
			res.status(500).render("register.njk", {
				title: "Register",
				validationErrors: ["An error occurred. Please try again later."],
				formData: {
					email: req.body.email,
					forename: req.body.forename,
					surname: req.body.surname,
				},
			});
		}
	};
}
