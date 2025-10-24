// Authentication and Authorization Middleware
// Created: 23 October 2025

import type { NextFunction, Request, Response } from "express";

/**
 * Helper function to check if user is authenticated (session exists)
 */
export function isAuthenticated(req: Request): boolean {
	return !!req.session && !!req.session.user;
}

/**
 * Helper function to check if user is an admin
 */
export function isAdmin(req: Request): boolean {
	if (!isAuthenticated(req) || !req.session.user) {
		return false;
	}
	const user = req.session.user;
	// Check both user_type (User model) and role (AuthUser model)
	return (
		("user_type" in user && user.user_type === "Admin") ||
		("role" in user && user.role === "Admin")
	);
}

/**
 * Middleware: Require authentication
 * Redirects to login page if user is not authenticated
 */
export function requireAuth(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	if (!isAuthenticated(req)) {
		res.redirect("/login");
		return;
	}
	next();
}

/**
 * Middleware: Require admin role
 * Redirects to login if not authenticated, or shows unauthorized page if not admin
 */
export function requireAdmin(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	if (!isAuthenticated(req)) {
		res.redirect("/login");
		return;
	}
	if (!isAdmin(req)) {
		res.status(403).render("unauthorized.njk", {
			message: "You must be an admin to access this page.",
		});
		return;
	}
	next();
}
