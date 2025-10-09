/**
 * Application Controller for handling job application routes
 */

import type { Request, Response } from "express";
import type { ApplicationService } from "../services/application-service.js";
import type { JobRoleService } from "../services/job-role-service.js";
import { validateJobRoleId } from "../utils/validation.js";

export class ApplicationController {
	private applicationService: ApplicationService;
	private jobRoleService: JobRoleService;

	constructor(
		applicationService: ApplicationService,
		jobRoleService: JobRoleService
	) {
		this.applicationService = applicationService;
		this.jobRoleService = jobRoleService;
	}

	/**
	 * GET /job-roles/:id/apply
	 * Renders the application form for a specific job role
	 */
	public getApplicationForm = async (
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

			// Fetch job role to verify it exists and check eligibility
			const jobRole = await this.jobRoleService.getJobRoleById(jobRoleId);

			if (!jobRole) {
				res.status(404).render("error.njk", {
					message:
						"Job role not found. The role you're looking for may have been removed or doesn't exist.",
				});
				return;
			}

			// Check if the role is open for applications
			if (
				jobRole.numberOfOpenPositions <= 0 ||
				jobRole.status.toLowerCase() !== "active"
			) {
				res.status(400).render("error.njk", {
					message:
						"This job role is not currently accepting applications. Please check back later or browse other opportunities.",
				});
				return;
			}

			res.render("job-application-form.njk", {
				jobRole,
			});
		} catch (error) {
			console.error(
				"Error in ApplicationController.getApplicationForm:",
				error
			);
			res.status(500).render("error.njk", {
				message:
					"Sorry, we couldn't load the application form at this time. Please try again later.",
			});
		}
	};

	/**
	 * POST /job-roles/:id/apply
	 * Handles the submission of a job application
	 */
	public submitApplication = async (
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

			// Check if file was uploaded
			const cvFile = req.file;

			if (!cvFile) {
				res.status(400).render("error.njk", {
					message: "Please upload your CV to submit your application.",
				});
				return;
			}

			// Verify job role exists and is open
			const jobRole = await this.jobRoleService.getJobRoleById(jobRoleId);

			if (!jobRole) {
				res.status(404).render("error.njk", {
					message:
						"Job role not found. The role you're applying for may have been removed.",
				});
				return;
			}

			if (
				jobRole.numberOfOpenPositions <= 0 ||
				jobRole.status.toLowerCase() !== "active"
			) {
				res.status(400).render("error.njk", {
					message:
						"This job role is no longer accepting applications. Please browse other opportunities.",
				});
				return;
			}

			// Submit the application
			const application = await this.applicationService.submitApplication(
				jobRoleId,
				cvFile
			);

			// Render success page
			res.render("application-success.njk", {
				application,
				jobRole,
			});
		} catch (error) {
			console.error("Error in ApplicationController.submitApplication:", error);
			res.status(500).render("error.njk", {
				message:
					"Sorry, we couldn't submit your application at this time. Please try again later.",
			});
		}
	};
}
