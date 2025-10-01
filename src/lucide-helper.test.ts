/**
 * Tests for Lucide Icon Helper
 */

import { describe, expect, it } from "vitest";
import {
	getAvailableIcons,
	lucideIconFilter,
	renderLucideIcon,
} from "./utils/lucide-helper.js";

describe("Lucide Icon Helper", () => {
	describe("renderLucideIcon", () => {
		it("should render a basic info icon", () => {
			const result = renderLucideIcon("info");
			expect(result).toContain("<svg");
			expect(result).toContain('viewBox="0 0 24 24"');
			expect(result).toContain('width="24"');
			expect(result).toContain('height="24"');
			expect(result).toContain("</svg>");
		});

		it("should apply custom size configuration", () => {
			const result = renderLucideIcon("info", { size: 32 });
			expect(result).toContain('width="32"');
			expect(result).toContain('height="32"');
		});

		it("should apply custom className", () => {
			const result = renderLucideIcon("info", { className: "text-blue-500" });
			expect(result).toContain('class="text-blue-500"');
		});

		it("should apply custom stroke width", () => {
			const result = renderLucideIcon("info", { strokeWidth: 3 });
			expect(result).toContain('stroke-width="3"');
		});

		it("should render different icon types", () => {
			const icons = ["info", "map-pin", "tag", "briefcase", "calendar"];

			for (const iconName of icons) {
				const result = renderLucideIcon(iconName);
				expect(result).toContain("<svg");
				expect(result).toContain("</svg>");
			}
		});

		it("should handle unknown icons gracefully", () => {
			const result = renderLucideIcon("unknown-icon");
			expect(result).toContain('<!-- Icon "unknown-icon" not found -->');
		});

		it("should handle alias icons", () => {
			const locationResult = renderLucideIcon("location");
			const mapPinResult = renderLucideIcon("map-pin");
			// Both should render the same icon (MapPin)
			expect(locationResult).toContain("<svg");
			expect(mapPinResult).toContain("<svg");
		});
	});

	describe("lucideIconFilter", () => {
		it("should work as a Nunjucks filter", () => {
			const result = lucideIconFilter("info", { size: 20 });
			expect(result).toContain("<svg");
			expect(result).toContain('width="20"');
		});
	});

	describe("getAvailableIcons", () => {
		it("should return array of available icon names", () => {
			const icons = getAvailableIcons();
			expect(Array.isArray(icons)).toBe(true);
			expect(icons).toContain("info");
			expect(icons).toContain("map-pin");
			expect(icons).toContain("tag");
			expect(icons).toContain("briefcase");
			expect(icons).toContain("calendar");
		});
	});
});
