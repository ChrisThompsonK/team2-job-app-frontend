/**
 * Example usage of AxiosJobRoleService
 * This demonstrates how to use the axios-based service to fetch job roles from the backend
 */

import { AxiosJobRoleService } from "./services/axios-job-role-service.js";

// Example 1: Basic usage with default backend URL (http://localhost:8080)
async function basicExample() {
	const service = new AxiosJobRoleService();

	// Fetch all job roles
	const allRoles = await service.getJobRoles();
	console.log("All job roles:", allRoles);

	// Fetch a specific job role by ID
	const roleDetail = await service.getJobRoleById(1);
	console.log("Job role 1 details:", roleDetail);
}

// Example 2: Custom backend URL
async function customBackendExample() {
	// If your backend is running on a different URL, pass it to the constructor
	const service = new AxiosJobRoleService("http://localhost:3000");

	const allRoles = await service.getJobRoles();
	console.log("All job roles from custom backend:", allRoles);
}

// Example 3: Error handling
async function errorHandlingExample() {
	const service = new AxiosJobRoleService();

	// The service returns an empty array if the backend is not available
	const roles = await service.getJobRoles();
	if (roles.length === 0) {
		console.log("No roles found or backend is not available");
	}

	// Returns null if role not found or error occurs
	const role = await service.getJobRoleById(999);
	if (!role) {
		console.log("Role not found");
	}
}

export { basicExample, customBackendExample, errorHandlingExample };
