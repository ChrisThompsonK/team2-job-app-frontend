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
	 * DELETE /job-roles/:id
	 * Deletes a job role by ID
	 */
	public deleteJobRole = async (req: Request, res: Response): Promise<void> => {
		try {
			const id = req.params["id"];

			const jobRoleId = validateJobRoleId(id);

			if (jobRoleId === null) {
				res.status(400).json({
					success: false,
					message:
						"Invalid job role ID provided. Please provide a valid numeric ID.",
				});
				return;
			}

			const deleted = await this.jobRoleService.deleteJobRole(jobRoleId);

			if (!deleted) {
				res.status(404).json({
					success: false,
					message: "Job role not found or could not be deleted.",
				});
				return;
			}

			res.status(200).json({
				success: true,
				message: "Job role deleted successfully.",
			});
		} catch (error) {
			console.error("Error in JobRoleController.deleteJobRole:", error);
			res.status(500).json({
				success: false,
				message:
					"Sorry, we couldn't delete the job role at this time. Please try again later.",
			});
		}
	};

	/**
	 * Handle delete job role via POST (for form submissions without JavaScript)
	 * Redirects back to job roles list with success/error message
	 */
	public deleteJobRoleForm = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const jobRoleId = validateJobRoleId(req.params["id"]);

			if (!jobRoleId) {
				res.redirect("/job-roles?error=invalid-id");
				return;
			}

			const deleted = await this.jobRoleService.deleteJobRole(jobRoleId);

			if (!deleted) {
				res.redirect("/job-roles?error=not-found");
				return;
			}

			res.redirect("/job-roles?success=deleted");
		} catch (error) {
			console.error("Error in JobRoleController.deleteJobRoleForm:", error);
			res.redirect("/job-roles?error=server-error");
		}
	};
}
