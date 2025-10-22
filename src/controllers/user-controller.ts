/**
 * User Controller for handling authentication operations
 */

import type { Request, Response } from "express";
import { APP_CONFIG } from "../config/constants.js";
import type { User } from "../models/user.js";
import {
	validateLoginForm,
	validateRegistrationForm,
} from "../utils/auth-validator.js";

export class UserController {
	/**
	 * GET /login
	 * Renders the login page
	 * @param req - Express request object
	 * @param res - Express response object used to render the template
	 * @returns void
	 */
	public getLoginPage = (req: Request, res: Response): void => {
		// If user is already logged in, redirect to home
		if (req.session["isAuthenticated"]) {
			res.redirect("/");
			return;
		}

		// Handle authentication error messages
		let errorMessage = "";
		if (req.query["error"] === "auth_required") {
			errorMessage = "Please log in to access that page.";
		}

		res.render("login.njk", {
			error: errorMessage || undefined,
		});
	};

	/**
	 * POST /login
	 * Handles login form submission and creates user session
	 * For testing: always succeeds and creates session
	 */
	public postLogin = async (req: Request, res: Response): Promise<void> => {
		// TODO: Implement actual authentication logic with backend
		const { username, password, remember } = req.body;

		// Enhanced validation using auth validator
		const validation = validateLoginForm(username, password);

		if (!validation.isValid) {
			const errorMessage =
				validation.errors.username ||
				validation.errors.password ||
				"Please check your credentials.";

			res.render("login.njk", {
				error: errorMessage,
				fieldErrors: validation.errors,
				formData: {
					username: typeof username === "string" ? username.trim() : "",
					password: "", // Never send password back
					remember: remember === "on",
				},
			});
			return;
		}

		// For testing purposes: simulate successful login
		// In production, this would call the authentication service and validate credentials
		try {
			// Simulate user data that would come from backend authentication
			// In real implementation, this would validate credentials and get user_type from database
			const user: User = {
				username: username.trim(),
				user_type: "Admin", // This would come from the backend API/database
				email: `${username.trim()}@${APP_CONFIG.EMAIL_DOMAIN}`, // Mock email for demo
			};

			// Store user in session
			req.session["user"] = user;
			req.session["isAuthenticated"] = true;
			req.session["loginTime"] = new Date();

			// Redirect to original URL or home page after successful login
			const redirectUrl = req.session["redirectUrl"] || "/";
			delete req.session["redirectUrl"]; // Clear redirect URL
			res.redirect(redirectUrl);
		} catch (error) {
			console.error("Error in UserController.postLogin:", error);
			res.render("login.njk", {
				error: "An error occurred during login. Please try again.",
				formData: { username: username || "", password: "" },
			});
		}
	};

	/**
	 * GET /register
	 * Renders the registration page
	 */
	public getRegisterPage = (req: Request, res: Response): void => {
		// If user is already logged in, redirect to home
		if (req.session["isAuthenticated"]) {
			res.redirect("/");
			return;
		}
		res.render("register.njk");
	};

	/**
	 * POST /register
	 * Handles user registration and creates new account
	 */
	public postRegister = async (req: Request, res: Response): Promise<void> => {
		const { username, email, password, confirmPassword, terms } = req.body;

		// Enhanced validation using auth validator
		const validation = validateRegistrationForm(
			username,
			email,
			password,
			confirmPassword,
			terms === "on"
		);

		if (!validation.isValid) {
			const errorMessage =
				validation.errors.username ||
				validation.errors.email ||
				validation.errors.password ||
				validation.errors.confirmPassword ||
				validation.errors.terms ||
				"Please check your information and try again.";

			res.render("register.njk", {
				error: errorMessage,
				fieldErrors: validation.errors,
				formData: {
					username: typeof username === "string" ? username.trim() : "",
					email: typeof email === "string" ? email.trim() : "",
					// Never send passwords back
					password: "",
					confirmPassword: "",
					terms: terms === "on",
				},
			});
			return;
		}

		// Check if username already exists (simulated)
		const existingUsers = ["admin", "test", "user", "demo", "kainos"];
		if (existingUsers.includes(username.toLowerCase())) {
			res.render("register.njk", {
				error: "Username is already taken. Please choose a different username.",
				fieldErrors: { username: "Username is already taken" },
				formData: {
					username: "",
					email: email.trim(),
					password: "",
					confirmPassword: "",
					terms: terms === "on",
				},
			});
			return;
		}

		try {
			// Simulate user creation that would call backend API
			// In real implementation, this would create user in database
			const newUser: User = {
				username: username.trim(),
				user_type: "User", // New registrations default to User role
				email: email.trim(),
			};

			// Store user in session (auto-login after registration)
			req.session["user"] = newUser;
			req.session["isAuthenticated"] = true;
			req.session["loginTime"] = new Date();

			// Redirect to home page with success message
			res.redirect("/?registered=true");
		} catch (error) {
			console.error("Error in UserController.postRegister:", error);
			res.render("register.njk", {
				error: "An error occurred during registration. Please try again.",
				formData: {
					username: username.trim(),
					email: email.trim(),
					password: "",
					confirmPassword: "",
					terms: terms === "on",
				},
			});
		}
	};

	/**
	 * GET /forgot-password
	 * Renders the forgot password page
	 */
	public getForgotPasswordPage = (req: Request, res: Response): void => {
		// If user is already logged in, redirect to home
		if (req.session["isAuthenticated"]) {
			res.redirect("/");
			return;
		}
		res.render("forgot-password.njk");
	};

	/**
	 * POST /forgot-password
	 * Handles forgot password form submission (demo mode)
	 */
	public postForgotPassword = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const { usernameOrEmail } = req.body;

		// Basic validation
		if (
			!usernameOrEmail ||
			typeof usernameOrEmail !== "string" ||
			usernameOrEmail.trim().length < 3
		) {
			res.render("forgot-password.njk", {
				error: "Please enter a valid username or email address.",
				fieldErrors: { usernameOrEmail: "Username or email is required" },
				formData: {
					usernameOrEmail:
						typeof usernameOrEmail === "string" ? usernameOrEmail.trim() : "",
				},
			});
			return;
		}

		try {
			// Simulate password reset process
			// In real implementation, this would:
			// 1. Check if user exists
			// 2. Generate reset token
			// 3. Send email with reset link
			// 4. Store token with expiration

			// For demo, we always show success to prevent username enumeration
			res.render("forgot-password.njk", {
				success: true,
			});
		} catch (error) {
			console.error("Error in UserController.postForgotPassword:", error);
			res.render("forgot-password.njk", {
				error:
					"An error occurred while processing your request. Please try again.",
				formData: {
					usernameOrEmail: usernameOrEmail.trim(),
				},
			});
		}
	};

	/**
	 * POST /logout
	 * Handles user logout and destroys session
	 */
	public postLogout = (req: Request, res: Response): void => {
		try {
			// Destroy the session
			req.session.destroy((error) => {
				if (error) {
					console.error("Error destroying session:", error);
					res.status(500).render("error.njk", {
						message: "Error logging out. Please try again.",
					});
					return;
				}

				// Clear the session cookie
				res.clearCookie(APP_CONFIG.SESSION.COOKIE_NAME);

				// Redirect to home page
				res.redirect("/");
			});
		} catch (error) {
			console.error("Error in UserController.postLogout:", error);
			res.status(500).render("error.njk", {
				message: "Error logging out. Please try again.",
			});
		}
	};
}
