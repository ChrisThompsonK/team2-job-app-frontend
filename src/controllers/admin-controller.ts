/**
 * Admin Controller for handling admin-specific operations
 * Manages job role creation and other administrative tasks
 */

import type { Request, Response } from "express";
import type { JobRoleService } from "../services/job-role-service.js";
import type { JobRoleValidator } from "../utils/job-role-validator.js";

export class AdminController {
	private jobRoleService: JobRoleService;
	private jobRoleValidator: JobRoleValidator;

	constructor(
		jobRoleService: JobRoleService,
		jobRoleValidator: JobRoleValidator
	) {
		this.jobRoleService = jobRoleService;
		this.jobRoleValidator = jobRoleValidator;
	}

	/**
	 * GET /admin/job-roles/new
	 * Renders the form for creating a new job role
	 * Displays dropdowns for bands and capabilities from the database
	 */
	public getCreateJobRole = (_req: Request, res: Response): void => {
		// TODO: Fetch bands and capabilities from database when backend supports it
		// For now, using constants from validator
		res.render("job-role-create.njk");
	};

	/**
	 * POST /admin/job-roles
	 * Creates a new job role and saves it to the database
	 * Validates input data and sets status to "open" automatically
	 */
	public createJobRole = async (req: Request, res: Response): Promise<void> => {
		try {
			// Extract form data from request body
			const {
				roleName,
				description,
				responsibilities,
				jobSpecLink,
				location,
				capability,
				band,
				closingDate,
				numberOfOpenPositions,
			} = req.body;

			// Validate all fields using the injected validator
			const validationResult = this.jobRoleValidator.validateJobRole({
				roleName,
				description,
				responsibilities,
				jobSpecLink,
				location,
				capability,
				band,
				closingDate,
				status: "Open", // Status is always set to "Open" for new roles
				numberOfOpenPositions,
			});

			if (!validationResult.isValid) {
				res.status(400).render("job-role-create.njk", {
					error: validationResult.error,
					formData: req.body, // Pass back form data for user convenience
				});
				return;
			}

			// Parse validated number of positions
			const positions = parseInt(numberOfOpenPositions, 10);

			// Create the job role via service with status set to "Open"
			const newJobRole = await this.jobRoleService.createJobRole({
				roleName: roleName.trim(),
				description: description.trim(),
				responsibilities: responsibilities.trim(),
				jobSpecLink: jobSpecLink.trim(),
				location: location.trim(),
				capability: capability.trim(),
				band: band.trim(),
				closingDate: closingDate.trim(),
				status: "Open", // Automatically set to "Open" as per acceptance criteria
				numberOfOpenPositions: positions,
			});

			// Redirect to the newly created job role's detail page
			res.redirect(`/job-roles/${newJobRole.jobRoleId}`);
		} catch (error) {
			console.error("Error in AdminController.createJobRole:", error);
			res.status(500).render("job-role-create.njk", {
				error:
					"Sorry, we couldn't create the job role at this time. Please try again later.",
				formData: req.body, // Pass back form data even on error
			});
		}
	};
}
