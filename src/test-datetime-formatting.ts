/**
 * Quick test to demonstrate date/time formatting
 */

// Test the formatDateTime function
function formatDateTime(dateString: string): string {
	if (!dateString) return "";

	try {
		const date = new Date(dateString);

		// Check if date is valid
		if (Number.isNaN(date.getTime())) return dateString;

		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");

		return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
	} catch {
		return dateString;
	}
}

// Test with current time
console.log("\n⏰ Date/Time Formatting Examples:\n");

const testTimestamps = [
	new Date().toISOString(), // Current time
	"2025-10-07T18:47:23.134Z", // From user's screenshot
	"2026-02-10T18:30:23.000Z", // Job closing date with time
];

for (const isoTimestamp of testTimestamps) {
	console.log(`ISO Format:    ${isoTimestamp}`);
	console.log(`Display:       ${formatDateTime(isoTimestamp)}`);
	console.log("");
}

console.log(
	"✅ Timestamps now display as dd/mm/yyyy HH:MM:SS (up to seconds, no milliseconds)!"
);
