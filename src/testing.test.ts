import { describe, expect, it } from "vitest";
import { isAdult } from "./testing";

describe("isAdult", () => {
	it("should return true for ages 18 and above", () => {
		expect(isAdult(18)).toBe(true);
		expect(isAdult(19)).toBe(true);
		expect(isAdult(25)).toBe(true);
		expect(isAdult(65)).toBe(true);
		expect(isAdult(100)).toBe(true);
	});

	it("should return false for ages below 18", () => {
		expect(isAdult(0)).toBe(false);
		expect(isAdult(1)).toBe(false);
		expect(isAdult(17)).toBe(false);
		expect(isAdult(16)).toBe(false);
		expect(isAdult(10)).toBe(false);
	});

	it("should handle edge case exactly at boundary", () => {
		expect(isAdult(18)).toBe(true);
		expect(isAdult(17)).toBe(false);
	});

	it("should handle decimal ages correctly", () => {
		expect(isAdult(17.9)).toBe(false);
		expect(isAdult(18.0)).toBe(true);
		expect(isAdult(18.1)).toBe(true);
	});

	it("should handle negative ages", () => {
		expect(isAdult(-1)).toBe(false);
		expect(isAdult(-18)).toBe(false);
	});

	it("should handle very large ages", () => {
		expect(isAdult(999)).toBe(true);
		expect(isAdult(Number.MAX_SAFE_INTEGER)).toBe(true);
	});
});
