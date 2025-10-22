/**
 * Authentication and Authorization middleware
 */

import type { NextFunction, Request, Response } from "express";

/**
 * Middleware to ensure user is authenticated
 */
export function requireAuth(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	if (!req.session["isAuthenticated"] || !req.session["user"]) {
		// Store the original URL for redirect after login
		req.session["redirectUrl"] = req.originalUrl;

		if (req.xhr || req.headers.accept?.includes("application/json")) {
			// AJAX request - return JSON error
			res.status(401).json({
				error: "Authentication required",
				message: "Please log in to access this resource",
				redirectUrl: "/login",
			});
		} else {
			// Regular request - redirect to login
			res.redirect("/login?error=auth_required");
		}
		return;
	}

	next();
}

/**
 * Middleware to ensure user has admin role
 */
export function requireAdmin(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	// First check if user is authenticated
	if (!req.session["isAuthenticated"] || !req.session["user"]) {
		req.session["redirectUrl"] = req.originalUrl;

		if (req.xhr || req.headers.accept?.includes("application/json")) {
			res.status(401).json({
				error: "Authentication required",
				message: "Please log in to access this resource",
				redirectUrl: "/login",
			});
		} else {
			res.redirect("/login?error=auth_required");
		}
		return;
	}

	// Check if user has admin role
	const user = req.session["user"];
	if (user.user_type !== "Admin") {
		if (req.xhr || req.headers.accept?.includes("application/json")) {
			res.status(403).json({
				error: "Access forbidden",
				message: "Admin access required for this resource",
			});
		} else {
			res.status(403).render("error.njk", {
				message:
					"Access Forbidden: Admin privileges required to access this resource.",
				error: "You do not have permission to access this page.",
			});
		}
		return;
	}

	next();
}

/**
 * Middleware to ensure user is a regular user/member (not admin-only resources)
 * This allows both Admin and User roles to access member features
 */
export function requireMember(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	// Check if user is authenticated
	if (!req.session["isAuthenticated"] || !req.session["user"]) {
		req.session["redirectUrl"] = req.originalUrl;

		if (req.xhr || req.headers.accept?.includes("application/json")) {
			res.status(401).json({
				error: "Authentication required",
				message: "Please log in to access this resource",
				redirectUrl: "/login",
			});
		} else {
			res.redirect("/login?error=auth_required");
		}
		return;
	}

	// Both Admin and User types can access member features
	// This middleware just ensures authentication
	next();
}
