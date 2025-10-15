/**
 * Application Controller for handling job application routes
 */

import type { Request, Response } from "express";
import type { ApplicationService } from "../services/application-service.js";
import type { JobRoleService } from "../services/job-role-service.js";
import { validateApplicationData } from "../utils/application-validator.js";
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

			// Extract form data
			const applicantName = req.body["applicantName"] as string | undefined;
			const applicantEmail = req.body["applicantEmail"] as string | undefined;
			const coverLetter = req.body["coverLetter"] as string | undefined;
			const cvFile = req.file;

			// Validate all application data
			const validation = validateApplicationData(
				applicantName,
				applicantEmail,
				coverLetter,
				cvFile
			);

			if (!validation.isValid) {
				// Collect all validation errors into a single message
				const errorMessages = Object.values(validation.errors).join(". ");
				res.status(400).render("error.njk", {
					message: `Please correct the following errors: ${errorMessages}`,
					errors: validation.errors,
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

			// Debug logging for job role state during submission
			console.log("[ApplicationController] Submitting for jobRole:", {
				jobRoleId: jobRole.jobRoleId,
				status: jobRole.status,
				numberOfOpenPositions: jobRole.numberOfOpenPositions,
				closingDate: jobRole.closingDate,
			});

			if (
				jobRole.numberOfOpenPositions <= 0 ||
				jobRole.status.toLowerCase() !== "active"
			) {
				console.warn("[ApplicationController] Rejected application due to eligibility check", {
					reason: jobRole.numberOfOpenPositions <= 0 ? "no-open-positions" : "status-not-active",
					statusValue: jobRole.status,
				});
				res.status(400).render("error.njk", {
					message:
						"This job role is no longer accepting applications. Please browse other opportunities.",
				});
				return;
			}

			// Submit the application
			const application = await this.applicationService.submitApplication(
				jobRoleId,
				applicantName as string,
				applicantEmail as string,
				coverLetter,
				cvFile
			);

			// Render success page
			res.render("application-success.njk", {
				application,
				jobRole,
			});
		} catch (error) {
			console.error("Error in ApplicationController.submitApplication:", error);

			// Provide more specific error messages
			let errorMessage =
				"Sorry, we couldn't submit your application at this time. Please try again later.";

			if (error instanceof Error) {
				// Check if it's a connection error
				if (
					error.message.includes("ECONNREFUSED") ||
					error.message.includes("connect")
				) {
					errorMessage =
						"Unable to connect to the application service. Please ensure the backend API is running and try again.";
				} else if (error.message.includes("timeout")) {
					errorMessage =
						"The request timed out. Please check your connection and try again.";
				} else if (error.message.includes("Network Error")) {
					errorMessage =
						"Network error occurred. Please check your connection and try again.";
				} else if (
					error.message &&
					error.message !== "Failed to submit application. Please try again."
				) {
					// Use the specific error message if available
					errorMessage = error.message;
				}
			}

			res.status(500).render("error.njk", {
				message: errorMessage,
			});
		}
	};

	/**
	 * GET /job-roles/:id/applicants
	 * Renders the applicants list for a specific job role
	 */
	public getJobApplicants = async (
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

			// Get pagination parameters
			const page = Number.parseInt(req.query["page"] as string) || 1;
			const limit = Number.parseInt(req.query["limit"] as string) || 10;

			// Fetch job role to verify it exists
			const jobRole = await this.jobRoleService.getJobRoleById(jobRoleId);

			if (!jobRole) {
				res.status(404).render("error.njk", {
					message:
						"Job role not found. The role you're looking for may have been removed or doesn't exist.",
				});
				return;
			}

			// Fetch applicants for this job role
			const applicantsData = await this.applicationService.getApplicantsByJobRole(
				jobRoleId,
				page,
				limit
			);

			res.render("job-applicants-list.njk", {
				jobRole,
				applicants: applicantsData.applicants,
				pagination: applicantsData.pagination,
			});
		} catch (error) {
			console.error(
				"Error in ApplicationController.getJobApplicants:",
				error
			);
			res.status(500).render("error.njk", {
				message:
					"Sorry, we couldn't load the applicants list at this time. Please try again later.",
			});
		}
	};
}
