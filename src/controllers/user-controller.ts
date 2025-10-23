/**
 * User Controller for handling user session operations
 */

import type { Request, Response } from "express";
import { APP_CONFIG } from "../config/constants.js";

export class UserController {
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
