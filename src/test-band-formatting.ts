/**
 * Quick test to demonstrate band formatting
 */

// Test the band formatting function
function formatBand(band: string): string {
	if (!band) return "";
	return `${band} Level`;
}

// Test with sample bands from backend
console.log("\n🎯 Band Formatting Examples:\n");

const testBands = ["Senior", "Mid", "Junior", "Lead", "Principal"];

for (const band of testBands) {
	console.log(`Original:  ${band}`);
	console.log(`Display:   ${formatBand(band)}`);
	console.log("");
}

console.log('✅ All bands will now display with "Level" suffix!');
console.log("   Examples: Senior Level, Junior Level, Mid Level");
