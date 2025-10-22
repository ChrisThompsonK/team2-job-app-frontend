/**
 * Authentication controller for handling login and registration routes
 */

import type { Request, Response } from "express";

export class AuthController {
	/**
	 * Render login page (redirect to home if already authenticated)
	 */
	public getLogin = async (req: Request, res: Response): Promise<void> => {
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
	public getRegister = async (req: Request, res: Response): Promise<void> => {
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
}
