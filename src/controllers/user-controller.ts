/**
 * User Controller for handling authentication operations
 */

import type { Request, Response } from "express";

export class UserController {
	/**
	 * GET /login
	 * Renders the login page
	 * @param _req - Express request object (unused)
	 * @param res - Express response object used to render the template
	 * @returns void
	 */
	public getLoginPage = (_req: Request, res: Response): void => {
		res.render("login.njk");
	};

	/**
	 * POST /login
	 * Handles login form submission
	 * For testing: always succeeds and shows success page
	 */
	public postLogin = async (req: Request, res: Response): Promise<void> => {
		// TODO: Implement actual authentication logic with backend
		const { username } = req.body;

		// For testing purposes: simulate successful login
		// In production, this would call the authentication service and get user_type from database
		try {
			// Simulate user data that would come from backend
			// In real implementation, user_type would come from the database
			const mockUser = {
				username: username,
				user_type: "Admin", // This would come from the backend API/database
			};

			// Render success page with user data
			res.render("login-success.njk", {
				user: mockUser,
			});
		} catch (error) {
			console.error("Error in UserController.postLogin:", error);
			res.render("login.njk", {
				error: "An error occurred during login. Please try again.",
				formData: { username },
			});
		}
	};
}
