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
				jobRole.status.toLowerCase() !== "open"
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
				jobRole.status.toLowerCase() !== "open"
			) {
				console.warn(
					"[ApplicationController] Rejected application due to eligibility check",
					{
						reason:
							jobRole.numberOfOpenPositions <= 0
								? "no-open-positions"
								: "status-not-open",
						statusValue: jobRole.status,
					}
				);
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
	public getApplicants = async (req: Request, res: Response): Promise<void> => {
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
			const page = Number.parseInt(req.query["page"] as string, 10) || 1;
			const limit = Number.parseInt(req.query["limit"] as string, 10) || 10;

			// Validate pagination parameters
			if (page < 1 || limit < 1 || limit > 50) {
				res.status(400).render("error.njk", {
					message: "Invalid pagination parameters.",
				});
				return;
			}

			// Fetch job role to verify it exists
			const jobRole = await this.jobRoleService.getJobRoleById(jobRoleId);

			if (!jobRole) {
				res.status(404).render("error.njk", {
					message: "Job role not found.",
				});
				return;
			}

			// Fetch applicants for this job role
			const applicantsData =
				await this.applicationService.getApplicantsByJobRole(
					jobRoleId,
					page,
					limit
				);

			res.render("job-applicants-list.njk", {
				applicants: applicantsData.applicants,
				pagination: applicantsData.pagination,
				jobRole: applicantsData.jobRole,
				currentPage: page,
			});
		} catch (error) {
			console.error("Error in ApplicationController.getApplicants:", error);

			// Handle specific error types
			let errorMessage =
				"Sorry, we couldn't load the applicants list at this time. Please try again later.";

			if (error instanceof Error) {
				if (error.message.includes("Unable to connect to the backend API")) {
					errorMessage =
						"Backend service is currently unavailable. Please try again later.";
				} else if (error.message.includes("Request timeout")) {
					errorMessage = "Request timeout occurred. Please try again.";
				} else {
					errorMessage = error.message;
				}
			}

			res.status(500).render("error.njk", {
				message: errorMessage,
			});
		}
	};

	/**
	 * GET /applications/:id/cv
	 * Downloads CV file for a specific application (proxy to backend)
	 */
	public downloadCv = async (req: Request, res: Response): Promise<void> => {
		try {
			const id = req.params["id"];
			const applicationId = validateJobRoleId(id); // Reusing validation for numeric IDs

			if (applicationId === null) {
				res.status(400).render("error.njk", {
					message: "Invalid application ID provided.",
				});
				return;
			}

			// Download CV from backend
			const cvData =
				await this.applicationService.downloadApplicationCv(applicationId);

			// Set response headers for file download
			res.setHeader("Content-Type", cvData.mimeType);
			res.setHeader(
				"Content-Disposition",
				`attachment; filename="${cvData.fileName}"`
			);
			res.setHeader("Content-Length", cvData.buffer.length);

			// Send the file buffer
			res.send(cvData.buffer);
		} catch (error) {
			console.error("Error in ApplicationController.downloadCv:", error);

			let errorMessage =
				"Sorry, we couldn't download the CV at this time. Please try again later.";

			if (error instanceof Error) {
				if (error.message.includes("CV not found")) {
					res.status(404).send("CV not found for this application");
					return;
				}
				errorMessage = error.message;
			}

			res.status(500).send(errorMessage);
		}
	};

	/**
	 * POST /job-roles/:jobRoleId/applications/:applicationId/accept
	 * Accepts an applicant for a job role
	 */
	public acceptApplicant = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const { jobRoleId, applicationId } = req.params;
			const { reason } = req.body;

			const jobRoleIdNum = validateJobRoleId(jobRoleId);
			if (jobRoleIdNum === null) {
				res.status(400).render("error.njk", {
					message: "Invalid job role ID provided.",
				});
				return;
			}

			const appIdNum = Number.parseInt(applicationId as string, 10);
			if (Number.isNaN(appIdNum) || appIdNum <= 0) {
				res.status(400).render("error.njk", {
					message: "Invalid application ID provided.",
				});
				return;
			}

			await this.applicationService.acceptApplicant(
				appIdNum,
				jobRoleIdNum,
				reason as string | undefined
			);

			res.status(200).json({
				success: true,
				message: "Applicant accepted successfully",
			});
		} catch (error) {
			console.error("Error in ApplicationController.acceptApplicant:", error);

			let errorMessage =
				"Sorry, we couldn't accept the applicant at this time. Please try again later.";

			if (error instanceof Error) {
				errorMessage = error.message;
			}

			res.status(500).json({
				success: false,
				message: errorMessage,
			});
		}
	};

	/**
	 * POST /job-roles/:jobRoleId/applications/:applicationId/reject
	 * Rejects an applicant for a job role
	 */
	public rejectApplicant = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const { jobRoleId, applicationId } = req.params;
			const { reason } = req.body;

			const jobRoleIdNum = validateJobRoleId(jobRoleId);
			if (jobRoleIdNum === null) {
				res.status(400).render("error.njk", {
					message: "Invalid job role ID provided.",
				});
				return;
			}

			const appIdNum = Number.parseInt(applicationId as string, 10);
			if (Number.isNaN(appIdNum) || appIdNum <= 0) {
				res.status(400).render("error.njk", {
					message: "Invalid application ID provided.",
				});
				return;
			}

			await this.applicationService.rejectApplicant(
				appIdNum,
				jobRoleIdNum,
				reason as string | undefined
			);

			res.status(200).json({
				success: true,
				message: "Applicant rejected successfully",
			});
		} catch (error) {
			console.error("Error in ApplicationController.rejectApplicant:", error);

			let errorMessage =
				"Sorry, we couldn't reject the applicant at this time. Please try again later.";

			if (error instanceof Error) {
				errorMessage = error.message;
			}

			res.status(500).json({
				success: false,
				message: errorMessage,
			});
		}
	};
}
