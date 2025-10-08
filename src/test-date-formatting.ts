/**
 * Quick test to demonstrate date formatting
 */

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
