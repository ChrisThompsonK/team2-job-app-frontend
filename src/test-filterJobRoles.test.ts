/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	filterJobRoles,
	initializeFiltering,
	resetCache,
} from "./filterJobRoles";

describe("Scalable Job Role Filtering", () => {
	let mockSearchBar: HTMLInputElement;
	let mockLocationFilter: HTMLSelectElement;
	let mockBandFilter: HTMLSelectElement;
	let mockJobCards: HTMLElement[];

	beforeEach(() => {
		resetCache();

		mockSearchBar = document.createElement("input");
		mockSearchBar.id = "search-bar";
		mockSearchBar.value = "";

		mockLocationFilter = document.createElement("select");
		mockLocationFilter.id = "location-filter";
		mockLocationFilter.value = "";

		mockBandFilter = document.createElement("select");
		mockBandFilter.id = "band-filter";
		mockBandFilter.value = "";

		mockJobCards = [
			createMockJobCard("Software Developer", "Belfast", "Trainee"),
			createMockJobCard("Senior Engineer", "London", "Senior"),
			createMockJobCard("Junior Developer", "Belfast", "Associate"),
		];

		vi.spyOn(document, "getElementById").mockImplementation((id: string) => {
			if (id === "search-bar") return mockSearchBar;
			if (id === "location-filter") return mockLocationFilter;
			if (id === "band-filter") return mockBandFilter;
			return null;
		});

		vi.spyOn(document, "querySelectorAll").mockReturnValue(
			mockJobCards as unknown as NodeListOf<HTMLElement>
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		resetCache();
	});

	function createMockJobCard(
		role: string,
		location: string,
		band: string
	): HTMLElement {
		const card = document.createElement("div");
		card.className = "job-card";
		card.setAttribute("data-job-role", role);
		card.setAttribute("data-location", location);
		card.setAttribute("data-band", band);
		card.style.display = "";
		card.classList.remove = vi.fn();
		card.classList.add = vi.fn();
		return card;
	}

	describe("Performance Optimizations", () => {
		it("should cache DOM elements on initialization", () => {
			const getElementSpy = vi.spyOn(document, "getElementById");

			initializeFiltering();
			expect(getElementSpy).toHaveBeenCalledTimes(3);

			filterJobRoles();
			filterJobRoles();

			expect(getElementSpy).toHaveBeenCalledTimes(3);
		});

		it("should cache job card data to avoid repeated getAttribute calls", () => {
			initializeFiltering();

			const card = mockJobCards[0];
			const getAttributeSpy = vi.spyOn(card, "getAttribute");

			filterJobRoles();
			filterJobRoles();
			filterJobRoles();

			expect(getAttributeSpy).toHaveBeenCalledTimes(0);
		});

		it("should use CSS classes for visibility toggling", () => {
			mockSearchBar.value = "developer";
			filterJobRoles();

			expect(mockJobCards[0].classList.remove).toHaveBeenCalledWith("hidden");
			expect(mockJobCards[1].classList.add).toHaveBeenCalledWith("hidden");
		});
	});

	describe("Filtering Logic", () => {
		it("should show all cards when no filters applied", () => {
			filterJobRoles();

			expect(mockJobCards[0].style.display).toBe("");
			expect(mockJobCards[1].style.display).toBe("");
			expect(mockJobCards[2].style.display).toBe("");
		});

		it("should filter by search query", () => {
			mockSearchBar.value = "developer";
			filterJobRoles();

			expect(mockJobCards[0].style.display).toBe("");
			expect(mockJobCards[1].style.display).toBe("none");
			expect(mockJobCards[2].style.display).toBe("");
		});

		it("should filter by location", () => {
			initializeFiltering();
			mockLocationFilter.value = "London";

			console.log(
				"Mock job cards:",
				mockJobCards.map((c) => ({
					role: c.getAttribute("data-job-role"),
					location: c.getAttribute("data-location"),
					band: c.getAttribute("data-band"),
				}))
			);

			filterJobRoles();

			console.log(
				"After filtering - displays:",
				mockJobCards.map((c) => c.style.display)
			);

			expect(mockJobCards[0].style.display).toBe("none");
			expect(mockJobCards[1].style.display).toBe("");
			expect(mockJobCards[2].style.display).toBe("none");
		});

		it("should filter by band", () => {
			initializeFiltering();
			mockBandFilter.value = "Senior";
			filterJobRoles();
			expect(mockJobCards[0].style.display).toBe("none");
			expect(mockJobCards[1].style.display).toBe("");
			expect(mockJobCards[2].style.display).toBe("none");
		});

		it("should apply multiple filters simultaneously", () => {
			mockSearchBar.value = "engineer";
			mockLocationFilter.value = "London";
			mockBandFilter.value = "Senior";
			filterJobRoles();

			expect(mockJobCards[0].style.display).toBe("none");
			expect(mockJobCards[1].style.display).toBe("");
			expect(mockJobCards[2].style.display).toBe("none");
		});

		it("should be case insensitive", () => {
			mockSearchBar.value = "DEVELOPER";
			filterJobRoles();

			expect(mockJobCards[0].style.display).toBe("");
			expect(mockJobCards[2].style.display).toBe("");
		});

		it("should handle partial matches", () => {
			mockSearchBar.value = "soft";
			filterJobRoles();

			expect(mockJobCards[0].style.display).toBe("");
			expect(mockJobCards[1].style.display).toBe("none");
			expect(mockJobCards[2].style.display).toBe("none");
		});
	});

	describe("Scalability with Large Datasets", () => {
		it("should handle 1000+ job cards efficiently", () => {
			const largeDataset: HTMLElement[] = [];

			for (let i = 0; i < 1000; i++) {
				largeDataset.push(
					createMockJobCard(
						`Developer ${i}`,
						i % 2 === 0 ? "Belfast" : "London",
						i % 3 === 0 ? "Senior" : "Junior"
					)
				);
			}

			vi.spyOn(document, "querySelectorAll").mockReturnValue(
				largeDataset as unknown as NodeListOf<HTMLElement>
			);

			const startTime = performance.now();
			initializeFiltering();
			filterJobRoles();
			const endTime = performance.now();

			expect(endTime - startTime).toBeLessThan(100);
		});
	});

	describe("Cache Management", () => {
		it("should reset cache properly", () => {
			initializeFiltering();
			resetCache();

			const getElementSpy = vi.spyOn(document, "getElementById");
			filterJobRoles();

			expect(getElementSpy).toHaveBeenCalled();
		});
	});
});
