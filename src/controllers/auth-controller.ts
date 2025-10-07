import type { Request, Response } from "express";
import type { LoginRequest } from "../models/auth-models";
import { authService } from "../services/auth-service";

export class AuthController {
	async login(req: Request, res: Response): Promise<void> {
		try {
			const loginRequest: LoginRequest = {
				email: req.body.email,
				password: req.body.password,
			};

			const user = await authService.login(loginRequest);

			// Store user information in session
			if (req.session) {
				req.session.user = user;
				req.session.isAuthenticated = true;
			}

			res.status(200).json({
				success: true,
				message: "Login successful",
				user: {
					id: user.id,
					email: user.email,
					is_admin: user.is_admin,
				},
			});
		} catch (error) {
			console.error("Login error:", error);
			res.status(401).json({
				success: false,
				message: error instanceof Error ? error.message : "Login failed",
			});
		}
	}

	async logout(req: Request, res: Response): Promise<void> {
		try {
			await authService.logout();

			// Clear session
			if (req.session) {
				req.session.destroy((err: Error | undefined) => {
					if (err) {
						console.error("Session destruction error:", err);
					}
				});
			}

			res.status(200).json({
				success: true,
				message: "Logout successful",
			});
		} catch (error) {
			console.error("Logout error:", error);
			res.status(500).json({
				success: false,
				message: error instanceof Error ? error.message : "Logout failed",
			});
		}
	}

	async getCurrentUser(req: Request, res: Response): Promise<void> {
		try {
			if (req.session?.user) {
				res.status(200).json({
					success: true,
					user: req.session.user,
				});
			} else {
				res.status(401).json({
					success: false,
					message: "Not authenticated",
				});
			}
		} catch (error) {
			console.error("Get current user error:", error);
			res.status(500).json({
				success: false,
				message:
					error instanceof Error ? error.message : "Failed to get user data",
			});
		}
	}
}

export const authController = new AuthController();
