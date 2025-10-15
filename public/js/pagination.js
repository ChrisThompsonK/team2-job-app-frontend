/**
 * Pagination loading state management
 * Handles loading indicators during page transitions
 */

document.addEventListener("DOMContentLoaded", () => {
	// Add loading state to all pagination links
	const paginationLinks = document.querySelectorAll(".pagination-link");

	paginationLinks.forEach((link) => {
		link.addEventListener("click", (_e) => {
			// Show loading indicator
			showLoadingState();

			// Allow the navigation to proceed
			// The page will reload with new content
		});
	});
});

/**
 * Shows loading state overlay
 */
function showLoadingState() {
	// Create loading overlay if it doesn't exist
	let overlay = document.getElementById("pagination-loading");

	if (!overlay) {
		overlay = document.createElement("div");
		overlay.id = "pagination-loading";
		overlay.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 flex items-center gap-3">
          <span class="loading loading-spinner loading-md"></span>
          <span class="text-lg">Loading job roles...</span>
        </div>
      </div>
    `;
		document.body.appendChild(overlay);
	}

	overlay.style.display = "block";
}

/**
 * Hides loading state overlay
 */
function hideLoadingState() {
	const overlay = document.getElementById("pagination-loading");
	if (overlay) {
		overlay.style.display = "none";
	}
}

// Hide loading state when page loads (in case of back/forward navigation)
window.addEventListener("load", hideLoadingState);
