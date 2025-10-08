/**
 * Job Role Controller for handling job role related routes
 */

import type { Request, Response } from "express";
import type { JobRoleService } from "../services/job-role-service.js";
import type { JobRoleValidator } from "../utils/job-role-validator.js";
import { validateJobRoleId } from "../utils/validation.js";

export class JobRoleController {
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
	 * GET /job-roles
	 * Renders the job roles list view with data from the API
	 */
	public getJobRoles = async (_req: Request, res: Response): Promise<void> => {
		try {
			const jobRoles = await this.jobRoleService.getJobRoles();

			res.render("job-role-list.njk", {
				jobRoles,
				totalRoles: jobRoles.length,
			});
		} catch (error) {
			console.error("Error in JobRoleController.getJobRoles:", error);
			res.status(500).render("error.njk", {
				message:
					"Sorry, we couldn't load the job roles at this time. Please try again later.",
			});
		}
	};

	/**
	 * GET /job-roles/{id}
	 * Renders the job role information view with detailed data for a specific role
	 */
	public getJobRoleById = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const id = req.params["id"];

			const jobRoleId = validateJobRoleId(id);

			if (jobRoleId === null) {
				res.status(400).render("error.njk", {
					message:
						"Invalid job role ID provided. Please provide a valid numeric ID.",
				});
				return;
			}

			const jobRole = await this.jobRoleService.getJobRoleById(jobRoleId);

			if (!jobRole) {
				res.status(404).render("error.njk", {
					message:
						"Job role not found. The role you're looking for may have been removed or doesn't exist.",
				});
				return;
			}

			res.render("job-role-information.njk", {
				jobRole,
			});
		} catch (error) {
			console.error("Error in JobRoleController.getJobRoleById:", error);
			res.status(500).render("error.njk", {
				message:
					"Sorry, we couldn't load the job role information at this time. Please try again later.",
			});
		}
	};

	/**
	 * GET /login
	 * Renders the login page
	 */
	public getLogin = (_req: Request, res: Response): void => {
		res.render("login.njk");
	};

	/**
	 * GET /job-roles/new
	 * Renders the form for creating a new job role
	 */
	public getCreateJobRole = (_req: Request, res: Response): void => {
		res.render("job-role-create.njk");
	};

	/**
	 * POST /job-roles
	 * Creates a new job role and saves it to the database
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
				status,
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
				status,
				numberOfOpenPositions,
			});

			if (!validationResult.isValid) {
				res.status(400).render("job-role-create.njk", {
					error: validationResult.error,
				});
				return;
			}

			// Parse validated number of positions
			const positions = parseInt(numberOfOpenPositions, 10);

			// Create the job role via service
			const newJobRole = await this.jobRoleService.createJobRole({
				roleName: roleName.trim(),
				description: description.trim(),
				responsibilities: responsibilities.trim(),
				jobSpecLink: jobSpecLink.trim(),
				location: location.trim(),
				capability: capability.trim(),
				band: band.trim(),
				closingDate: closingDate.trim(),
				status: status.trim(),
				numberOfOpenPositions: positions,
			});

			// Redirect to the newly created job role's detail page
			res.redirect(`/job-roles/${newJobRole.jobRoleId}`);
		} catch (error) {
			console.error("Error in JobRoleController.createJobRole:", error);
			res.status(500).render("job-role-create.njk", {
				error:
					"Sorry, we couldn't create the job role at this time. Please try again later.",
			});
		}
	};
}
