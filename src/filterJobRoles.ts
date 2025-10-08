/**
 * Job Role Filtering System - TypeScript Version
 * Optimized for performance with large datasets
 */

interface CachedElements {
	searchBar: HTMLInputElement;
	locationFilter: HTMLSelectElement;
	bandFilter: HTMLSelectElement;
}

interface CachedJobCard {
	element: HTMLElement;
	roleName: string;
	location: string;
	band: string;
}

let cachedElements: CachedElements | null = null;
let cachedJobCards: CachedJobCard[] | null = null;
let debounceTimer: NodeJS.Timeout | null = null;

export function initializeFiltering(): void {
	cachedElements = {
		searchBar: document.getElementById("search-bar") as HTMLInputElement,
		locationFilter: document.getElementById(
			"location-filter"
		) as HTMLSelectElement,
		bandFilter: document.getElementById("band-filter") as HTMLSelectElement,
	};

	const jobCardElements = document.querySelectorAll<HTMLElement>(".job-card");
	cachedJobCards = Array.from(jobCardElements).map((card) => ({
		element: card,
		roleName: (card.getAttribute("data-job-role") || "").toLowerCase(),
		location: card.getAttribute("data-location") || "",
		band: card.getAttribute("data-band") || "",
	}));
}

export function filterJobRolesDebounced(): void {
	if (debounceTimer) {
		clearTimeout(debounceTimer);
	}

	debounceTimer = setTimeout(() => {
		filterJobRoles();
	}, 300);
}

export function filterJobRoles(): void {
	if (!cachedElements || !cachedJobCards) {
		initializeFiltering();
	}

	const query = cachedElements!.searchBar.value.toLowerCase();
	const locationFilter = cachedElements!.locationFilter.value;
	const bandFilter = cachedElements!.bandFilter.value;

	cachedJobCards!.forEach(({ element, roleName, location, band }) => {
		const matchesQuery = !query || roleName.includes(query);
		const matchesLocation = !locationFilter || location === locationFilter;
		const matchesBand = !bandFilter || band === bandFilter;

		const shouldShow = matchesQuery && matchesLocation && matchesBand;

		if (shouldShow) {
			element.classList.remove("hidden");
			element.style.display = "";
		} else {
			element.classList.add("hidden");
			element.style.display = "none";
		}
	});
}

export function resetCache(): void {
	cachedElements = null;
	cachedJobCards = null;
	if (debounceTimer) {
		clearTimeout(debounceTimer);
		debounceTimer = null;
	}
}
