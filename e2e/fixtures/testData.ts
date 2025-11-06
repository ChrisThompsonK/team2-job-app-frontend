/**
 * Test data for user authentication
 */
export const testUsers = {
	validUser: {
		email: "test.user@example.com",
		password: "Test123!",
		firstName: "John",
		lastName: "Doe",
	},
	adminUser: {
		email: "admin@example.com",
		password: "Admin123!",
		firstName: "Admin",
		lastName: "User",
	},
	invalidUser: {
		email: "invalid@example.com",
		password: "WrongPassword",
	},
};

/**
 * Test data for job applications
 */
export const testApplications = {
	validApplication: {
		firstName: "Jane",
		lastName: "Smith",
		email: "jane.smith@example.com",
		phone: "+44 7700 900000",
		coverLetter:
			"I am writing to express my strong interest in this position. With my extensive experience and skills, I believe I would be a valuable addition to your team.",
	},
	minimalApplication: {
		firstName: "Bob",
		lastName: "Johnson",
		email: "bob.johnson@example.com",
		phone: "+44 7700 900001",
	},
	invalidApplication: {
		firstName: "",
		lastName: "",
		email: "invalid-email",
		phone: "123",
	},
};

/**
 * Test file paths for CV uploads
 */
export const testFiles = {
	validCV: "./e2e/fixtures/files/test-cv.txt", // Using the txt file we created
	invalidFile: "./e2e/fixtures/files/invalid.txt",
	largeFile: "./e2e/fixtures/files/large-file.pdf",
};

/**
 * Test data for job roles
 */
export const testJobRoles = {
	softwareEngineer: {
		title: "Software Engineer",
		capability: "Engineering",
		band: "Principal",
	},
	dataAnalyst: {
		title: "Data Analyst",
		capability: "Data",
		band: "Senior",
	},
};

/**
 * Common test URLs
 */
export const testUrls = {
	home: "/",
	login: "/login",
	register: "/register",
	jobRoles: "/job-roles",
	myApplications: "/my-applications",
};
