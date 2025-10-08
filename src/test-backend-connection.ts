/**
 * Simple script to test backend connection
 * Run with: npm run dev (or tsx src/test-backend-connection.ts)
 */

import { AxiosJobRoleService } from "./services/axios-job-role-service.js";

async function testBackendConnection() {
	console.log("🔍 Testing backend connection...\n");

	// Test with default backend URL (http://localhost:8080)
	const service = new AxiosJobRoleService();

	try {
		console.log("📡 Attempting to fetch job roles from /api/job-roles...");
		const roles = await service.getJobRoles();

		if (roles.length > 0) {
			console.log("✅ SUCCESS! Backend is connected.");
			console.log(`📊 Found ${roles.length} job role(s):\n`);
			roles.forEach((role) => {
				console.log(`  - ID: ${role.jobRoleId}, Role: ${role.roleName}`);
			});

			// Test fetching a specific role
			console.log("\n📡 Testing detailed endpoint /api/job-roles/1...");
			const detailedRole = await service.getJobRoleById(1);

			if (detailedRole) {
				console.log("✅ Detailed endpoint works!");
				console.log(`📄 Role Details: ${detailedRole.roleName}`);
				console.log(
					`   Description: ${detailedRole.description?.substring(0, 100)}...`
				);
			} else {
				console.log("⚠️  No role found with ID 1");
			}
		} else {
			console.log("⚠️  Backend responded but returned no data.");
			console.log(
				"   This might mean the backend is connected but has no job roles."
			);
		}
	} catch (error) {
		console.log("❌ FAILED! Backend is not connected or not responding.");
		console.log(
			"   Make sure your backend is running on http://localhost:8080\n"
		);
		if (error instanceof Error) {
			console.log(`   Error: ${error.message}`);
		}
	}
}

// Run the test
testBackendConnection();
