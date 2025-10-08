import { describe, it, expect } from "vitest";

// Function to test
function formatBand(band: string): string {
    if (!band) return "";
    return `${band} Level`;
}

// Vitest test suite
describe("Band Formatting", () => {
    it("should format band correctly", () => {
        const testBands = ["Senior", "Mid", "Junior", "Lead", "Principal"];
        const expectedResults = [
            "Senior Level",
            "Mid Level",
            "Junior Level",
            "Lead Level",
            "Principal Level",
        ];

        testBands.forEach((band, index) => {
            expect(formatBand(band)).toBe(expectedResults[index]);
        });
    });

    it("should return an empty string for empty input", () => {
        expect(formatBand("")).toBe("");
    });
});