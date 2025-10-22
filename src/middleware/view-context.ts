import type { NextFunction, Request, Response } from "express";

/**
 * Generate a consistent profile color based on username
 */
function getUserProfileColor(username: string): string {
	const colors = [
		"from-blue-500 to-purple-600",
		"from-green-500 to-blue-600", 
		"from-purple-500 to-pink-600",
		"from-yellow-500 to-orange-600",
		"from-red-500 to-pink-600",
		"from-indigo-500 to-blue-600",
		"from-teal-500 to-green-600",
		"from-orange-500 to-red-600"
	];
	
	// Generate a simple hash from username
	let hash = 0;
	for (let i = 0; i < username.length; i++) {
		const char = username.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	
	const colorIndex = Math.abs(hash) % colors.length;
	return colors[colorIndex] as string;
}

/**
 * Middleware to add authentication context to all views
 * This ensures all templates have access to user authentication data
 */
export function addAuthContextToViews(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	// Store the original render method
	const originalRender = res.render.bind(res);

	// Override the render method
	res.render = (
		view: string,
		options?: object,
		callback?: (err: Error, html: string) => void
	): void => {
		// Merge authentication data with locals
		const user = req.session?.["user"] || null;
		const authContext = {
			isAuthenticated: req.session?.["isAuthenticated"] || false,
			user,
			loginTime: req.session?.["loginTime"] || null,
			// Add helper for profile picture customization
			profileColor: user ? getUserProfileColor(user.username) : null,
		};

		// Merge with existing options
		const mergedOptions = {
			...authContext,
			...(options || {}),
		};

		// Call original render with merged options
		if (callback) {
			originalRender(view, mergedOptions, callback);
		} else {
			originalRender(view, mergedOptions);
		}
	};

	next();
}
