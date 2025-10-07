import type { NextFunction, Request, Response } from "express";

// Middleware to check if user is authenticated
export const requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (req.session?.isAuthenticated && req.session?.user) {
		next();
	} else {
		res.status(401).json({
			success: false,
			message: "Authentication required",
		});
	}
};

// Middleware to check if user is an admin
export const requireAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (
		req.session?.isAuthenticated &&
		req.session?.user &&
		req.session.user.is_admin
	) {
		next();
	} else {
		res.status(403).json({
			success: false,
			message: "Admin access required",
		});
	}
};

// Middleware to add user data to response locals for template rendering
export const addUserToLocals = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (req.session?.user) {
		res.locals["user"] = req.session.user;
		res.locals["isAuthenticated"] = req.session.isAuthenticated;
	} else {
		res.locals["user"] = null;
		res.locals["isAuthenticated"] = false;
	}
	next();
};
