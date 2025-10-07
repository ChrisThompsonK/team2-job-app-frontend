import { describe, expect, it } from "vitest";
import { api } from "../config/api";

describe("Axios API Configuration", () => {
	it("should have api instance configured", () => {
		expect(api).toBeDefined();
		expect(api.defaults.baseURL).toBeDefined();
	});
});
