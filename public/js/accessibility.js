/**
 * Simple Accessibility Button Functionality
 * Handles basic show/hide panel functionality and text sizing
 */

function initAccessibilityButton() {
	const button = document.getElementById("accessibility-btn");
	const panel = document.getElementById("accessibility-panel");
	const mobileButton = document.getElementById("accessibility-btn-mobile");

	if (!button || !panel) return;

	// Initialize text size controls
	initTextSizeControls();

	// Toggle panel on button click
	function togglePanel(event) {
		event.preventDefault();
		event.stopPropagation();

		const isHidden = panel.classList.contains("hidden");

		if (isHidden) {
			panel.classList.remove("hidden");
			button.setAttribute("aria-expanded", "true");
			if (mobileButton) mobileButton.setAttribute("aria-expanded", "true");
		} else {
			panel.classList.add("hidden");
			button.setAttribute("aria-expanded", "false");
			if (mobileButton) mobileButton.setAttribute("aria-expanded", "false");
		}
	}

	// Close panel when clicking outside
	function closePanel() {
		panel.classList.add("hidden");
		button.setAttribute("aria-expanded", "false");
		if (mobileButton) mobileButton.setAttribute("aria-expanded", "false");
	}

	// Event listeners
	button.addEventListener("click", togglePanel);
	if (mobileButton) mobileButton.addEventListener("click", togglePanel);

	// Close when clicking outside
	document.addEventListener("click", (event) => {
		if (
			!button.contains(event.target) &&
			!panel.contains(event.target) &&
			(!mobileButton || !mobileButton.contains(event.target))
		) {
			closePanel();
		}
	});

	// Close on Escape key
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && !panel.classList.contains("hidden")) {
			closePanel();
			button.focus();
		}
	});
}

function initTextSizeControls() {
	const textSizeButtons = document.querySelectorAll(".text-size-btn");

	// Load saved text size preference
	const savedSize = localStorage.getItem("textSize") || "medium";
	applyTextSize(savedSize);
	updateActiveButton(savedSize);

	textSizeButtons.forEach((button) => {
		button.addEventListener("click", function (event) {
			event.preventDefault();
			const size = this.getAttribute("data-size");
			applyTextSize(size);
			updateActiveButton(size);

			// Save preference
			localStorage.setItem("textSize", size);
		});
	});
}

function applyTextSize(size) {
	// Remove all text size classes
	document.documentElement.classList.remove(
		"text-size-small",
		"text-size-medium",
		"text-size-large",
		"text-size-xlarge"
	);

	// Add the selected size class
	document.documentElement.classList.add(`text-size-${size}`);
}

function updateActiveButton(activeSize) {
	const textSizeButtons = document.querySelectorAll(".text-size-btn");

	textSizeButtons.forEach((button) => {
		const buttonSize = button.getAttribute("data-size");

		if (buttonSize === activeSize) {
			// Active button
			button.classList.add("active");
			button.classList.remove(
				"bg-slate-100",
				"hover:bg-slate-200",
				"text-slate-700"
			);
			button.classList.add("bg-blue-600", "text-white");
		} else {
			// Inactive button
			button.classList.remove("active");
			button.classList.remove("bg-blue-600", "text-white");
			button.classList.add(
				"bg-slate-100",
				"hover:bg-slate-200",
				"text-slate-700"
			);
		}
	});
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initAccessibilityButton);
} else {
	initAccessibilityButton();
}
