import { describe, expect, it } from "vitest";

// Function to test
function formatDate(dateString: string): string {
	if (!dateString) return "";

	try {
		const date = new Date(dateString);

		// Check if date is valid
		if (Number.isNaN(date.getTime())) return dateString;

		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	} catch {
		return dateString;
	}
}

// Vitest test suite
describe("Date Formatting", () => {
	it("should format valid date strings correctly", () => {
		const testDates = ["2025-10-08", "2023-01-01", "1999-12-31"];
		const expectedResults = ["08/10/2025", "01/01/2023", "31/12/1999"];

		testDates.forEach((date, index) => {
			expect(formatDate(date)).toBe(expectedResults[index]);
		});
	});

	it("should return the original string for invalid dates", () => {
		const invalidDates = ["invalid-date", "", "2025-13-40"];

		invalidDates.forEach((date) => {
			expect(formatDate(date)).toBe(date);
		});
	});
});
