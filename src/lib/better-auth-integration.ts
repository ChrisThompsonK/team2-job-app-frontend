/**
 * Better Auth Express Integration
 * Handles auth routes and middleware integration with Express
 */

import type { Application, Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";

export const BetterAuthIntegration = {
	/**
	 * Setup better-auth routes and middleware
	 */
	setupAuth(app: Application): void {
		// Better-auth handles all auth routes under /api/auth/*
		// TODO: Fix better-auth handler integration
		// app.all("/api/auth/*", (_req: Request, _res: Response) => {
		// 	return auth.handler(req);
		// });

		// Add better-auth session middleware
		app.use("*", async (req: Request, _res: Response, next) => {
			try {
				const session = await auth.api.getSession({
					headers: req.headers as Record<string, string>,
				});

				// Attach session to request for backward compatibility
				if (session?.session && session?.user) {
					req.session = req.session || {};
					req.session["betterAuthSession"] = session.session;
					req.session["betterAuthUser"] = session.user;
					req.session["isAuthenticated"] = true;

				// Convert to legacy format for existing code compatibility
				req.session["user"] = {
					id: session.user.id,
					username: (session.user.username || session.user.email?.split("@")[0] || "user"),
					user_type: (session.user.userType as "Admin" | "User") || "User",
					email: session.user.email || "",
				};
				} else {
					// Clear session if no better-auth session
					if (req.session) {
						delete req.session["betterAuthSession"];
						delete req.session["betterAuthUser"];
						delete req.session["isAuthenticated"];
						delete req.session["user"];
					}
				}

				next();
			} catch (error) {
				console.error("Better-auth session middleware error:", error);
				// Don't fail the request, just continue without session
				next();
			}
		});
	},

	/**
	 * Create better-auth compatible controller methods
	 */
	createAuthController() {
		return {
			/**
			 * GET /auth/signin - Render sign in page
			 */
			getSignIn: (req: Request, res: Response) => {
				if (req.session?.["isAuthenticated"]) {
					res.redirect("/");
					return;
				}

				let errorMessage = "";
				if (req.query["error"] === "auth_required") {
					errorMessage = "Please log in to access that page.";
				}

				res.render("auth/signin.njk", {
					error: errorMessage || undefined,
					title: "Sign In",
				});
			},

			/**
			 * GET /auth/signup - Render sign up page
			 */
			getSignUp: (req: Request, res: Response) => {
				if (req.session?.["isAuthenticated"]) {
					res.redirect("/");
					return;
				}

				res.render("auth/signup.njk", {
					title: "Sign Up",
				});
			},

			/**
			 * GET /auth/forgot-password - Render forgot password page
			 */
			getForgotPassword: (_req: Request, res: Response) => {
				res.render("auth/forgot-password.njk", {
					title: "Forgot Password",
				});
			},

			/**
			 * GET /auth/reset-password - Render reset password page
			 */
			getResetPassword: (req: Request, res: Response) => {
				const token = req.query["token"] as string;

				if (!token) {
					res.redirect("/auth/forgot-password?error=invalid_token");
					return;
				}

				res.render("auth/reset-password.njk", {
					title: "Reset Password",
					token,
				});
			},

			/**
			 * POST /auth/signout - Handle sign out (legacy route)
			 */
			postSignOut: async (_req: Request, res: Response) => {
				try {
					// Let better-auth handle the actual signout via API
					res.redirect("/api/auth/sign-out");
				} catch (error) {
					console.error("Sign out error:", error);
					res.redirect("/?error=signout_failed");
				}
			},
		};
	},

	/**
	 * Enhanced auth middleware using better-auth
	 */
	createAuthMiddleware() {
		return {
			/**
			 * Require authentication middleware
			 */
			requireAuth: async (req: Request, res: Response, next: NextFunction) => {
				try {
					const session = await auth.api.getSession({
						headers: req.headers as Record<string, string>,
					});

					if (!session?.user) {
						// Store the original URL for redirect after login
						if (req.session) {
							req.session["redirectUrl"] = req.originalUrl;
						}
						res.redirect("/auth/signin?error=auth_required");
						return;
					}

					next();
				} catch (error) {
					console.error("Auth middleware error:", error);
					res.redirect("/auth/signin?error=auth_required");
				}
			},

			/**
			 * Require admin role middleware
			 */
			requireAdmin: async (req: Request, res: Response, next: NextFunction) => {
				try {
					const session = await auth.api.getSession({
						headers: req.headers as Record<string, string>,
					});

					if (!session?.user) {
						res.redirect("/auth/signin?error=auth_required");
						return;
					}

					// Check if user has admin role
					const userType = session.user.userType || "User";
					if (userType !== "Admin") {
						res.status(403).render("error.njk", {
							message: "Access denied. Admin privileges required.",
						});
						return;
					}

					next();
				} catch (error) {
					console.error("Admin middleware error:", error);
					res.status(403).render("error.njk", {
						message: "Access denied.",
					});
				}
			},

			/**
			 * Add auth context to views
			 */
			addAuthContext: async (
				req: Request,
				res: Response,
				next: NextFunction
			) => {
				try {
					const session = await auth.api.getSession({
						headers: req.headers as Record<string, string>,
					});

				// Add auth context to all views
				res.locals["auth"] = {
					isAuthenticated: !!session?.user,
					user: session?.user || null,
					session: session?.session || null,
				};

				// Legacy compatibility
				res.locals["isAuthenticated"] = !!session?.user;
				res.locals["user"] = session?.user
						? {
								id: session.user.id,
								username:
									session.user.username ?? (session.user.email ? session.user.email.split("@")[0] : "user"),
								user_type:
									(session.user.userType as "Admin" | "User") || "User",
								email: session.user.email || "",
							}
						: null;

					next();
				} catch (error) {
				console.error("Auth context middleware error:", error);
				// Don't fail the request, just continue without auth context
				res.locals["auth"] = {
					isAuthenticated: false,
					user: null,
					session: null,
				};
				res.locals["isAuthenticated"] = false;
				res.locals["user"] = null;
					next();
				}
			},
		};
	},
};
