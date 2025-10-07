import axios from "axios";
import { env } from "../config/env.js";
import type { JobRoleDetailedResponse } from "../models/job-role-detailed-response.js";

// Create axios instance with base configuration from environment variables
const api = axios.create({
	baseURL: env.apiBaseUrl,
	timeout: env.apiTimeout,
	headers: {
		"Content-Type": "application/json",
	},
});

// Type for creating/updating job roles
type JobRoleInput = Omit<
	JobRoleDetailedResponse,
	"jobRoleId" | "numberOfOpenPositions"
>;

// Job Roles API
export const jobRolesAPI = {
	// Get all job roles
	getAll: () => api.get("/api/job-roles"),

	// Get active job roles
	getActive: () => api.get("/api/job-roles/active"),

	// Get job role by ID
	getById: (id: number) => api.get(`/api/job-roles/${id}`),

	// Create job role
	create: (data: Partial<JobRoleInput>) => api.post("/api/job-roles", data),

	// Update job role
	update: (id: number, data: Partial<JobRoleInput>) =>
		api.put(`/api/job-roles/${id}`, data),

	// Delete job role
	delete: (id: number) => api.delete(`/api/job-roles/${id}`),
};

export default api;
