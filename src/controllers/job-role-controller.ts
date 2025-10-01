/**
 * Job Role Controller for handling job role related routes
 */

import type { Request, Response } from "express";
import type { JobRoleService } from "../services/job-role-service.js";

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
				title: "Available Job Roles at Kainos",
				jobRoles,
				totalRoles: jobRoles.length,
			});
		} catch (error) {
			console.error("Error in JobRoleController.getJobRoles:", error);
			res.status(500).render("error.njk", {
				title: "Error Loading Job Roles",
				message:
					"Sorry, we couldn't load the job roles at this time. Please try again later.",
			});
		}
	};
}
