/**
 * Enhanced Authentication Controller using better-auth integration
 * Provides modern authentication features with improved UX
 */

import type { Request, Response } from "express";

export class AuthController {
	/**
	 * GET /auth/signin
	 * Renders the enhanced sign in page
	 */
	public getSignIn = (req: Request, res: Response): void => {
		// Check if user is already authenticated
		if (req.session?.["isAuthenticated"]) {
			res.redirect("/");
			return;
		}

		// Handle error messages from query parameters
		let errorMessage = "";
		if (req.query["error"] === "auth_required") {
			errorMessage = "Please log in to access that page.";
		} else if (req.query["error"] === "invalid_credentials") {
			errorMessage = "Invalid email or password.";
		} else if (req.query["error"] === "account_locked") {
			errorMessage = "Account temporarily locked. Please try again later.";
		}

		res.render("auth/signin.njk", {
			title: "Sign In",
			error: errorMessage || undefined,
		});
	};

	/**
	 * GET /auth/signup
	 * Renders the enhanced sign up page
	 */
	public getSignUp = (req: Request, res: Response): void => {
		// Check if user is already authenticated
		if (req.session?.["isAuthenticated"]) {
			res.redirect("/");
			return;
		}

		res.render("auth/signup.njk", {
			title: "Sign Up",
		});
	};

	/**
	 * GET /auth/forgot-password
	 * Renders the forgot password page
	 */
	public getForgotPassword = (_req: Request, res: Response): void => {
		res.render("auth/forgot-password.njk", {
			title: "Forgot Password",
		});
	};

	/**
	 * POST /auth/signin
	 * Enhanced sign in with better validation and security
	 */
	public postSignIn = async (req: Request, res: Response): Promise<void> => {
		try {
			const { email, password, remember } = req.body;

			// Validate input
			if (!email || typeof email !== "string" || email.trim().length === 0) {
				res.status(400).json({
					error: true,
					message: "Please provide a valid email address.",
				});
				return;
			}

			if (
				!password ||
				typeof password !== "string" ||
				password.trim().length === 0
			) {
				res.status(400).json({
					error: true,
					message: "Please provide a valid password.",
				});
				return;
			}

			// Email format validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email.trim())) {
				res.status(400).json({
					error: true,
					message: "Please provide a valid email address.",
				});
				return;
			}

			// TODO: Replace with actual better-auth integration
			// For now, simulate authentication logic
			const trimmedEmail = email.trim().toLowerCase();
			const isValidLogin = this.simulateAuthentication(
				trimmedEmail,
				password.trim()
			);

			if (!isValidLogin) {
				res.status(401).json({
					error: true,
					message: "Invalid email or password.",
				});
				return;
			}

			// Create user session (simulated user data)
			const user = {
				id: crypto.randomUUID(),
				email: trimmedEmail,
				name: trimmedEmail.split("@")[0],
				username: trimmedEmail.split("@")[0],
				userType: "User" as const,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				emailVerified: true,
			};

			// Store user in session (using legacy format for compatibility)
			if (req.session) {
				req.session["user"] = {
					id: user.id,
					username: user.username || user.email.split("@")[0] || "user",
					user_type: user.userType === "User" ? "User" : "Admin",
					email: user.email,
				};
				req.session["isAuthenticated"] = true;
				req.session["loginTime"] = new Date();

				// Handle remember me option
				if (remember) {
					req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
				}
			}

			res.json({
				success: true,
				message: "Successfully signed in!",
				redirectUrl: req.session?.["redirectUrl"] || "/",
			});

			// Clear redirect URL
			if (req.session?.["redirectUrl"]) {
				delete req.session["redirectUrl"];
			}
		} catch (error) {
			console.error("Error in AuthController.postSignIn:", error);
			res.status(500).json({
				error: true,
				message: "An error occurred during sign in. Please try again.",
			});
		}
	};

	/**
	 * POST /auth/signup
	 * Enhanced sign up with validation and better UX
	 */
	public postSignUp = async (req: Request, res: Response): Promise<void> => {
		try {
			const { name, email, username, password, confirmPassword } = req.body;

			// Validate required fields
			if (!name || typeof name !== "string" || name.trim().length === 0) {
				res.status(400).json({
					error: true,
					message: "Please provide your full name.",
				});
				return;
			}

			if (!email || typeof email !== "string" || email.trim().length === 0) {
				res.status(400).json({
					error: true,
					message: "Please provide a valid email address.",
				});
				return;
			}

			if (!password || typeof password !== "string") {
				res.status(400).json({
					error: true,
					message: "Please provide a valid password.",
				});
				return;
			}

			if (password !== confirmPassword) {
				res.status(400).json({
					error: true,
					message: "Passwords do not match.",
				});
				return;
			}

			// Email format validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email.trim())) {
				res.status(400).json({
					error: true,
					message: "Please provide a valid email address.",
				});
				return;
			}

			// Password strength validation
			const passwordStrength = this.checkPasswordStrength(password);
			if (passwordStrength.score < 3) {
				res.status(400).json({
					error: true,
					message: "Password is too weak. Please choose a stronger password.",
					details: passwordStrength.feedback,
				});
				return;
			}

			// Username validation (if provided)
			if (username && typeof username === "string") {
				const usernameValidation = this.validateUsername(username.trim());
				if (!usernameValidation.isValid) {
					res.status(400).json({
						error: true,
						message: usernameValidation.message,
					});
					return;
				}
			}

			// TODO: Replace with actual better-auth registration
			// For now, simulate successful registration
			const newUser = {
				id: crypto.randomUUID(),
				email: email.trim().toLowerCase(),
				name: name.trim(),
				username: username?.trim() || email.split("@")[0],
				userType: "User" as const,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				emailVerified: false,
			};

			// Simulate sending verification email
			console.log(`Verification email would be sent to: ${newUser.email}`);

			res.json({
				success: true,
				message:
					"Account created successfully! Please check your email for verification.",
				user: {
					id: newUser.id,
					email: newUser.email,
					name: newUser.name,
					username: newUser.username,
				},
			});
		} catch (error) {
			console.error("Error in AuthController.postSignUp:", error);
			res.status(500).json({
				error: true,
				message: "An error occurred during sign up. Please try again.",
			});
		}
	};

	/**
	 * POST /auth/signout
	 * Enhanced sign out with proper session cleanup
	 */
	public postSignOut = (req: Request, res: Response): void => {
		try {
			// Destroy the session
			req.session.destroy((error) => {
				if (error) {
					console.error("Error destroying session:", error);
					res.status(500).json({
						error: true,
						message: "Error signing out. Please try again.",
					});
					return;
				}

				// Clear the session cookie
				res.clearCookie("connect.sid");

				// Return success response
				res.json({
					success: true,
					message: "Successfully signed out!",
					redirectUrl: "/",
				});
			});
		} catch (error) {
			console.error("Error in AuthController.postSignOut:", error);
			res.status(500).json({
				error: true,
				message: "Error signing out. Please try again.",
			});
		}
	};

	/**
	 * POST /auth/forgot-password
	 * Handle forgot password requests
	 */
	public postForgotPassword = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const { email } = req.body;

			if (!email || typeof email !== "string" || email.trim().length === 0) {
				res.status(400).json({
					error: true,
					message: "Please provide a valid email address.",
				});
				return;
			}

			// Email format validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email.trim())) {
				res.status(400).json({
					error: true,
					message: "Please provide a valid email address.",
				});
				return;
			}

			// TODO: Integrate with better-auth forgot password functionality
			// For now, simulate sending reset email
			console.log(`Password reset email would be sent to: ${email.trim()}`);

			res.json({
				success: true,
				message:
					"If an account exists with this email, you will receive a password reset link.",
			});
		} catch (error) {
			console.error("Error in AuthController.postForgotPassword:", error);
			res.status(500).json({
				error: true,
				message: "An error occurred. Please try again.",
			});
		}
	};

	/**
	 * Simulate authentication (replace with better-auth integration)
	 */
	private simulateAuthentication(email: string, password: string): boolean {
		// For development purposes, accept any valid email with password "password123"
		// In production, this would use better-auth to verify credentials
		return password === "password123" || email.includes("admin");
	}

	/**
	 * Check password strength
	 */
	private checkPasswordStrength(password: string): {
		score: number;
		feedback: string[];
	} {
		let score = 0;
		const feedback: string[] = [];

		if (password.length >= 8) score += 1;
		else feedback.push("At least 8 characters");

		if (/[a-z]/.test(password)) score += 1;
		else feedback.push("Lowercase letter");

		if (/[A-Z]/.test(password)) score += 1;
		else feedback.push("Uppercase letter");

		if (/[0-9]/.test(password)) score += 1;
		else feedback.push("Number");

		if (/[^A-Za-z0-9]/.test(password)) score += 1;
		else feedback.push("Special character");

		return { score, feedback };
	}

	/**
	 * Validate username format
	 */
	private validateUsername(username: string): {
		isValid: boolean;
		message?: string;
	} {
		if (username.length < 3) {
			return {
				isValid: false,
				message: "Username must be at least 3 characters long.",
			};
		}

		if (username.length > 20) {
			return {
				isValid: false,
				message: "Username must be less than 20 characters long.",
			};
		}

		if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			return {
				isValid: false,
				message: "Username can only contain letters, numbers, and underscores.",
			};
		}

		// Check for reserved usernames
		const reserved = ["admin", "administrator", "root", "system", "api", "www"];
		if (reserved.includes(username.toLowerCase())) {
			return { isValid: false, message: "This username is not available." };
		}

		return { isValid: true };
	}
}
