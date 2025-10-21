/**
 * User Controller for handling authentication operations
 */

import type { Request, Response } from "express";
import { APP_CONFIG } from "../config/constants.js";
import type { User } from "../models/user.js";

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
		res.render("login.njk");
	};

	/**
	 * POST /login
	 * Handles login form submission and creates user session
	 * For testing: always succeeds and creates session
	 */
	public postLogin = async (req: Request, res: Response): Promise<void> => {
		// TODO: Implement actual authentication logic with backend
		const { username, password } = req.body;

		// Validate username field
		if (
			!username ||
			typeof username !== "string" ||
			username.trim().length === 0
		) {
			res.render("login.njk", {
				error: "Please provide a valid username.",
				formData: {
					username: typeof username === "string" ? username.trim() : "",
					password: "",
				},
			});
			return;
		}

		// Validate password field
		if (
			!password ||
			typeof password !== "string" ||
			password.trim().length === 0
		) {
			res.render("login.njk", {
				error: "Please provide a valid password.",
				formData: {
					username: username.trim(),
					password: typeof password === "string" ? password.trim() : "",
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

			// Redirect to home page after successful login
			res.redirect("/");
		} catch (error) {
			console.error("Error in UserController.postLogin:", error);
			res.render("login.njk", {
				error: "An error occurred during login. Please try again.",
				formData: { username: username || "", password: "" },
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
