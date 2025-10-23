/**
 * Job Role Controller for handling job role related routes
 */

import type { Request, Response } from "express";
import { isAdmin } from "../middleware/auth-middleware.js";
import type { JobRoleService } from "../services/job-role-service.js";
import { validatePaginationParams } from "../utils/pagination-validation.js";
import { buildPaginationUrls } from "../utils/url-builder.js";
import { validateJobRoleId } from "../utils/validation.js";

export class JobRoleController {
	private jobRoleService: JobRoleService;

	constructor(jobRoleService: JobRoleService) {
		this.jobRoleService = jobRoleService;
	}

	/**
	 * GET /job-roles
	 * Renders the job roles list view with paginated data from the API
	 * Shows admin view for authenticated admins, public view for other users
	 */
	public getJobRoles = async (req: Request, res: Response): Promise<void> => {
		try {
			// Validate pagination parameters from query string
			const paginationValidation = validatePaginationParams(
				req.query["page"] as string,
				req.query["limit"] as string
			);

			if (!paginationValidation.isValid) {
				return res.status(400).render("pagination-error.njk", {
					message: paginationValidation.error,
				});
			}

			// Fetch filter options for search form dropdowns
			const filterOptions = await this.jobRoleService.getFilterOptions();

			// Fetch paginated job roles
			const paginatedResult = await this.jobRoleService.getJobRolesPaginated({
				page: paginationValidation.page,
				limit: paginationValidation.limit,
			});

			// Handle case where user navigates to a page beyond available data
			if (
				paginatedResult.pagination.totalPages > 0 &&
				paginationValidation.page > paginatedResult.pagination.totalPages
			) {
				return res.status(404).render("pagination-error.njk", {
					message: `Page ${paginationValidation.page} does not exist. There are only ${paginatedResult.pagination.totalPages} pages available.`,
				});
			}

			// Handle empty results gracefully
			if (paginatedResult.pagination.totalCount === 0) {
				const viewName = isAdmin(req)
					? "job-role-list-admin.njk"
					: "job-role-list.njk";
				return res.render(viewName, {
					jobRoles: [],
					pagination: null,
					paginationUrls: null,
					totalRoles: 0,
					currentUrl: req.path,
					isSearchPage: false,
					filterOptions: filterOptions,
				});
			}

			// Build pagination URLs using the utility
			const paginationUrls = buildPaginationUrls(
				req.path,
				paginationValidation.page,
				paginatedResult.pagination.totalPages,
				paginationValidation.limit,
				null // No search params for regular listing
			);

			// Determine which view to render based on user role
			const viewName = isAdmin(req)
				? "job-role-list-admin.njk"
				: "job-role-list.njk";

			res.render(viewName, {
				jobRoles: paginatedResult.data,
				pagination: paginatedResult.pagination,
				paginationUrls: paginationUrls,
				totalRoles: paginatedResult.pagination.totalCount,
				currentUrl: req.path,
				isSearchPage: false,
				filterOptions: filterOptions,
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

			// Check if this was just created (query parameter from redirect)
			const wasJustCreated = req.query["created"] === "true";

			res.render("job-role-information.njk", {
				jobRole,
				created: wasJustCreated,
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

	/**
	 * GET /jobs/search
	 * Handles search and filter requests with pagination
	 * Renders the job roles list view with search results and active filters
	 */
	public searchJobRoles = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			// Extract search parameters from query string
			const searchQuery = (req.query["search"] as string) || "";
			const capability = (req.query["capability"] as string) || "";
			const location = (req.query["location"] as string) || "";
			const band = (req.query["band"] as string) || "";
			const status = (req.query["status"] as string) || "";

			// Validate pagination parameters
			const paginationValidation = validatePaginationParams(
				req.query["page"] as string,
				req.query["limit"] as string
			);

			if (!paginationValidation.isValid) {
				return res.status(400).render("pagination-error.njk", {
					message: paginationValidation.error,
				});
			}

			// Fetch filter options for dropdowns
			const filterOptions = await this.jobRoleService.getFilterOptions();

			// Perform search with all parameters
			const searchResult = await this.jobRoleService.searchJobRoles({
				search: searchQuery,
				capability: capability,
				location: location,
				band: band,
				status: status,
				page: paginationValidation.page,
				limit: paginationValidation.limit,
			});

			// Handle case where user navigates to a page beyond available data
			if (
				searchResult.pagination.totalPages > 0 &&
				paginationValidation.page > searchResult.pagination.totalPages
			) {
				return res.status(404).render("pagination-error.njk", {
					message: `Page ${paginationValidation.page} does not exist. There are only ${searchResult.pagination.totalPages} pages available.`,
				});
			}

			// Prepare active filters for display
			const activeFilters: Array<{
				type: string;
				value: string;
				label: string;
			}> = [];
			if (searchQuery.trim()) {
				activeFilters.push({
					type: "search",
					value: searchQuery,
					label: `Search: "${searchQuery}"`,
				});
			}
			if (capability.trim()) {
				activeFilters.push({
					type: "capability",
					value: capability,
					label: `Capability: ${capability}`,
				});
			}
			if (location.trim()) {
				activeFilters.push({
					type: "location",
					value: location,
					label: `Location: ${location}`,
				});
			}
			if (band.trim()) {
				activeFilters.push({
					type: "band",
					value: band,
					label: `Band: ${band}`,
				});
			}
			if (status.trim()) {
				activeFilters.push({
					type: "status",
					value: status,
					label: `Status: ${status}`,
				});
			}

			// Render the job roles list with search context
			res.render("job-role-list.njk", {
				jobRoles: searchResult.data,
				pagination:
					searchResult.pagination.totalCount > 0
						? searchResult.pagination
						: null,
				paginationUrls:
					searchResult.pagination.totalCount > 0
						? buildPaginationUrls(
								"/jobs/search",
								paginationValidation.page,
								searchResult.pagination.totalPages,
								paginationValidation.limit,
								{
									search: searchQuery,
									capability: capability,
									location: location,
									band: band,
									status: status,
								}
							)
						: null,
				totalRoles: searchResult.pagination.totalCount,
				currentUrl: "/jobs/search",
				isSearchPage: true,
				searchParams: {
					search: searchQuery,
					capability: capability,
					location: location,
					band: band,
					status: status,
				},
				activeFilters: activeFilters,
				filterOptions: filterOptions,
			});
		} catch (error) {
			console.error("Error in JobRoleController.searchJobRoles:", error);
			res.status(500).render("error.njk", {
				message:
					"Sorry, we couldn't search the job roles at this time. Please try again later.",
			});
		}
	};
}
