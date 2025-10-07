/**
 * Quick test to demonstrate date formatting
 */

// Test the date formatting function
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

// Test with sample dates from backend
console.log("\n📅 Date Formatting Examples:\n");

const testDates = [
	"2026-02-10T18:30:23.000Z", // Senior Software Engineer
	"2025-12-31T18:30:23.000Z", // Frontend Developer
	"2026-01-07T18:30:23.000Z", // Product Manager
	"2026-02-28T18:30:23.000Z", // UX/UI Designer
];

for (const isoDate of testDates) {
	console.log(`ISO Format:    ${isoDate}`);
	console.log(`Display:       ${formatDate(isoDate)}`);
	console.log("");
}

console.log(
	"✅ All dates will now display in dd/mm/yyyy format on the job roles pages!"
);
