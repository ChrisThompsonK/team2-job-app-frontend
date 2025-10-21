/**
 * Admin Controller for handling admin-specific operations
 * Manages job role creation and other administrative tasks
 */

import type { Request, Response } from "express";
import type { JobRoleService } from "../services/job-role-service.js";
import type { JobRoleValidator } from "../utils/job-role-validator.js";
import { validateJobRoleId } from "../utils/validation.js";

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

		// Preserve form data for error cases
		const preservedFormData = {
			roleName: roleName || "",
			description: description || "",
			responsibilities: responsibilities || "",
			jobSpecLink: jobSpecLink || "",
			location: location || "",
			capability: capability || "",
			band: band || "",
			closingDate: closingDate || "",
			numberOfOpenPositions: numberOfOpenPositions || "1",
		};

		try {
			// Always pass numberOfOpenPositions as string to validator
			const numberOfOpenPositionsStr =
				typeof numberOfOpenPositions === "string" &&
				numberOfOpenPositions.trim() !== ""
					? numberOfOpenPositions.trim()
					: "1";

			// Validate all fields using the injected validator
			const validationResult = this.jobRoleValidator.validateJobRole({
				roleName: roleName?.trim() || "",
				description: description?.trim() || "",
				responsibilities: responsibilities?.trim() || "",
				jobSpecLink: jobSpecLink?.trim() || "",
				location: location?.trim() || "",
				capability: capability?.trim() || "",
				band: band?.trim() || "",
				closingDate: closingDate?.trim() || "",
				status: "Open", // Status is always set to "Open" for new roles
				numberOfOpenPositions: numberOfOpenPositionsStr,
			});

			if (!validationResult.isValid) {
				res.status(400).render("job-role-create.njk", {
					error: validationResult.error,
					formData: preservedFormData, // Pass back original form data
				});
				return;
			}

			// Parse validated number of positions as number for service
			const positions = parseInt(numberOfOpenPositionsStr, 10);

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

			// Redirect to the newly created job role's detail page with success indicator
			res.redirect(`/job-roles/${newJobRole.jobRoleId}?created=true`);
		} catch (error) {
			console.error("Error in AdminController.createJobRole:", error);

			res.status(500).render("job-role-create.njk", {
				error:
					"Sorry, we couldn't create the job role at this time. Please try again later.",
				formData: preservedFormData, // Pass back preserved form data
			});
		}
	};

	/**
	 * GET /admin/job-roles/:id/edit
	 * Renders the form for editing an existing job role
	 * Pre-fills form with current job role data
	 */
	public getEditJobRole = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const jobRoleId = validateJobRoleId(req.params["id"]);

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

			res.render("job-role-edit.njk", {
				jobRole,
			});
		} catch (error) {
			console.error("Error in AdminController.getEditJobRole:", error);
			res.status(500).render("error.njk", {
				message:
					"Sorry, we couldn't load the job role for editing at this time. Please try again later.",
			});
		}
	};

	/**
	 * POST /admin/job-roles/:id
	 * Updates an existing job role in the database
	 * Validates input data and preserves status field
	 */
	public updateJobRole = async (req: Request, res: Response): Promise<void> => {
		try {
			const jobRoleId = validateJobRoleId(req.params["id"]);

			if (jobRoleId === null) {
				res.status(400).render("error.njk", {
					message:
						"Invalid job role ID provided. Please provide a valid numeric ID.",
				});
				return;
			}

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

			// Validate all fields using the injected validator (isUpdate = true to allow past dates)
			const validationResult = this.jobRoleValidator.validateJobRole(
				{
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
				},
				true
			);

			if (!validationResult.isValid) {
				// Fetch job role again for re-rendering with error
				const jobRole = await this.jobRoleService.getJobRoleById(jobRoleId);
				res.status(400).render("job-role-edit.njk", {
					error: validationResult.error,
					jobRole: jobRole || req.body, // Use existing data or fallback to submitted data
				});
				return;
			}

			// Parse validated number of positions
			const positions = parseInt(numberOfOpenPositions, 10);

			// Update the job role via service
			const updatedJobRole = await this.jobRoleService.updateJobRole(
				jobRoleId,
				{
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
				}
			);

			// Redirect to the updated job role's detail page with success indicator
			res.redirect(`/job-roles/${updatedJobRole.jobRoleId}?updated=true`);
		} catch (error) {
			console.error("Error in AdminController.updateJobRole:", error);

			// Try to fetch job role for re-rendering form
			const jobRoleId = validateJobRoleId(req.params["id"]);
			let jobRole = null;
			if (jobRoleId !== null) {
				jobRole = await this.jobRoleService.getJobRoleById(jobRoleId);
			}

			res.status(500).render("job-role-edit.njk", {
				error:
					"Sorry, we couldn't update the job role at this time. Please try again later.",
				jobRole: jobRole || req.body, // Pass back job role or form data
			});
		}
	};

	/**
	 * GET /admin/job-roles/export
	 * Exports all job roles to a CSV file
	 * Downloads CSV file with all job role information for stakeholder reporting
	 */
	public exportJobRoles = async (
		_req: Request,
		res: Response
	): Promise<void> => {
		try {
			// Fetch all job roles for export
			const jobRoles = await this.jobRoleService.getAllJobRolesForExport();

			// Check if we have data to export
			if (!jobRoles || jobRoles.length === 0) {
				res.status(404).render("error.njk", {
					message:
						"No job roles available to export. Please ensure the backend is running and has data.",
				});
				return;
			}

			console.log(
				`Exporting ${jobRoles.length} job role(s) to CSV`
			);

			// Convert to CSV format
			const { jobRolesToCsv, generateCsvFilename } = await import(
				"../utils/csv-export.js"
			);
			const csvContent = jobRolesToCsv(jobRoles);
			const filename = generateCsvFilename("job-roles-export");

			// Set headers for CSV download
			res.setHeader("Content-Type", "text/csv");
			res.setHeader(
				"Content-Disposition",
				`attachment; filename="${filename}"`
			);

			// Send CSV content
			res.send(csvContent);
		} catch (error) {
			console.error("Error in AdminController.exportJobRoles:", error);
			res.status(500).render("error.njk", {
				message:
					"Sorry, we couldn't generate the report at this time. Please try again later.",
			});
		}
	};
}
