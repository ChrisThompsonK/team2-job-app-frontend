/**
 * Job Role Controller for handling job role related routes
 */

import type { Request, Response } from "express";
import type { JobRoleService } from "../services/job-role-service.js";
import { validateJobRoleId } from "../utils/validation.js";

export class JobRoleController {
	private jobRoleService: JobRoleService;

	constructor(jobRoleService: JobRoleService) {
		this.jobRoleService = jobRoleService;
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

			// Define valid options for dropdown fields
			const VALID_LOCATIONS = [
				"Belfast, Northern Ireland",
				"Birmingham, England",
				"Derry~Londonderry, Northern Ireland",
				"Dublin, Ireland",
				"London, England",
				"Gdansk, Poland",
				"Helsinki, Finland",
				"Paris, France",
				"Antwerp, Belgium",
				"Buenos Aires, Argentina",
				"Indianapolis, United States",
				"Nova Scotia, Canada",
				"Toronto, Canada",
				"Remote",
			];

			const VALID_CAPABILITIES = [
				"Engineering",
				"Analytics",
				"Product",
				"Design",
				"Quality Assurance",
				"Documentation",
				"Testing",
			];

			const VALID_BANDS = ["Junior", "Mid", "Senior"];

			const VALID_STATUSES = ["Open", "Closed", "On Hold"];

			// Validate required fields
			if (
				!roleName ||
				!description ||
				!responsibilities ||
				!jobSpecLink ||
				!location ||
				!capability ||
				!band ||
				!closingDate ||
				!status ||
				!numberOfOpenPositions
			) {
				res.status(400).render("job-role-create.njk", {
					error: "All fields are required. Please fill in all information.",
				});
				return;
			}

			// Validate location is from allowed list
			if (!VALID_LOCATIONS.includes(location.trim())) {
				res.status(400).render("job-role-create.njk", {
					error: `Invalid location: "${location}". Please select a valid location from the dropdown.`,
				});
				return;
			}

			// Validate capability is from allowed list
			if (!VALID_CAPABILITIES.includes(capability.trim())) {
				res.status(400).render("job-role-create.njk", {
					error: `Invalid capability: "${capability}". Please select a valid capability from the dropdown.`,
				});
				return;
			}

			// Validate band is from allowed list
			if (!VALID_BANDS.includes(band.trim())) {
				res.status(400).render("job-role-create.njk", {
					error: `Invalid band level: "${band}". Please select a valid band from the dropdown.`,
				});
				return;
			}

			// Validate status is from allowed list
			if (!VALID_STATUSES.includes(status.trim())) {
				res.status(400).render("job-role-create.njk", {
					error: `Invalid status: "${status}". Please select a valid status from the dropdown.`,
				});
				return;
			}

			// Validate numberOfOpenPositions is a positive integer
			const positions = parseInt(numberOfOpenPositions, 10);
			if (Number.isNaN(positions) || positions < 1) {
				res.status(400).render("job-role-create.njk", {
					error: "Number of open positions must be at least 1.",
				});
				return;
			}

			// Validate date format (YYYY-MM-DD)
			const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
			if (!dateRegex.test(closingDate)) {
				res.status(400).render("job-role-create.njk", {
					error: "Invalid date format. Please use YYYY-MM-DD format.",
				});
				return;
			}

			// Validate date is not in the past
			const selectedDate = new Date(closingDate);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			if (selectedDate < today) {
				res.status(400).render("job-role-create.njk", {
					error: "Closing date cannot be in the past.",
				});
				return;
			}

			// Validate URL format for jobSpecLink
			try {
				const url = new URL(jobSpecLink);
				if (url.protocol !== "http:" && url.protocol !== "https:") {
					throw new Error("Invalid protocol");
				}
			} catch {
				res.status(400).render("job-role-create.njk", {
					error:
						"Invalid URL format for Job Spec Link. URL must start with http:// or https://",
				});
				return;
			}

			// Validate string lengths
			if (roleName.trim().length < 3) {
				res.status(400).render("job-role-create.njk", {
					error: "Role name must be at least 3 characters long.",
				});
				return;
			}

			if (description.trim().length < 10) {
				res.status(400).render("job-role-create.njk", {
					error: "Job description must be at least 10 characters long.",
				});
				return;
			}

			if (responsibilities.trim().length < 10) {
				res.status(400).render("job-role-create.njk", {
					error: "Key responsibilities must be at least 10 characters long.",
				});
				return;
			}

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
