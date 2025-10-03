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

	// Initialize high contrast controls
	initHighContrastControls();

	// Initialize dark mode controls
	initDarkModeControls();

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

function initHighContrastControls() {
	const contrastButton = document.getElementById("high-contrast-toggle");
	const contrastStatus = document.getElementById("contrast-status");

	if (!contrastButton || !contrastStatus) return;

	// Load saved high contrast preference
	const savedContrast = localStorage.getItem("highContrast") === "true";
	applyHighContrast(savedContrast);
	updateContrastButton(savedContrast);

	// Add click event listener
	contrastButton.addEventListener("click", (event) => {
		event.preventDefault();
		const currentContrast = document.documentElement.classList.contains("high-contrast");
		const newContrast = !currentContrast;
		
		applyHighContrast(newContrast);
		updateContrastButton(newContrast);
		
		// Save preference
		localStorage.setItem("highContrast", newContrast.toString());
	});
}

function applyHighContrast(enabled) {
	if (enabled) {
		document.documentElement.classList.add("high-contrast");
	} else {
		document.documentElement.classList.remove("high-contrast");
	}
}

function updateContrastButton(enabled) {
	const contrastButton = document.getElementById("high-contrast-toggle");
	const contrastStatus = document.getElementById("contrast-status");

	if (!contrastButton || !contrastStatus) return;

	contrastButton.setAttribute("aria-pressed", enabled.toString());
	
	if (enabled) {
		// Active state
		contrastButton.classList.remove("bg-slate-100", "hover:bg-slate-200", "text-slate-700");
		contrastButton.classList.add("bg-yellow-400", "text-black", "font-bold");
		contrastStatus.textContent = "On";
		contrastStatus.classList.remove("text-slate-500");
		contrastStatus.classList.add("text-black", "font-bold");
	} else {
		// Inactive state
		contrastButton.classList.remove("bg-yellow-400", "text-black", "font-bold");
		contrastButton.classList.add("bg-slate-100", "hover:bg-slate-200", "text-slate-700");
		contrastStatus.textContent = "Off";
		contrastStatus.classList.remove("text-black", "font-bold");
		contrastStatus.classList.add("text-slate-500");
	}
}

function initDarkModeControls() {
	const darkModeButton = document.getElementById("dark-mode-toggle");
	const darkModeStatus = document.getElementById("dark-mode-status");

	if (!darkModeButton || !darkModeStatus) return;

	// Load saved dark mode preference
	const savedDarkMode = localStorage.getItem("darkMode") === "true";
	applyDarkMode(savedDarkMode);
	updateDarkModeButton(savedDarkMode);

	// Add click event listener
	darkModeButton.addEventListener("click", (event) => {
		event.preventDefault();
		const currentDarkMode = document.documentElement.classList.contains("dark-mode");
		const newDarkMode = !currentDarkMode;
		
		applyDarkMode(newDarkMode);
		updateDarkModeButton(newDarkMode);
		
		// Save preference
		localStorage.setItem("darkMode", newDarkMode.toString());
	});
}

function applyDarkMode(enabled) {
	if (enabled) {
		document.documentElement.classList.add("dark-mode");
	} else {
		document.documentElement.classList.remove("dark-mode");
	}
}

function updateDarkModeButton(enabled) {
	const darkModeButton = document.getElementById("dark-mode-toggle");
	const darkModeStatus = document.getElementById("dark-mode-status");

	if (!darkModeButton || !darkModeStatus) return;

	darkModeButton.setAttribute("aria-pressed", enabled.toString());
	
	if (enabled) {
		// Active state
		darkModeButton.classList.remove("bg-slate-100", "hover:bg-slate-200", "text-slate-700");
		darkModeButton.classList.add("bg-slate-800", "text-white", "font-medium");
		darkModeStatus.textContent = "On";
		darkModeStatus.classList.remove("text-slate-500");
		darkModeStatus.classList.add("text-slate-300", "font-medium");
		
		// Update icon to sun when dark mode is on
		const icon = darkModeButton.querySelector('i[data-lucide]');
		if (icon) {
			icon.setAttribute('data-lucide', 'sun');
		}
	} else {
		// Inactive state
		darkModeButton.classList.remove("bg-slate-800", "text-white", "font-medium");
		darkModeButton.classList.add("bg-slate-100", "hover:bg-slate-200", "text-slate-700");
		darkModeStatus.textContent = "Off";
		darkModeStatus.classList.remove("text-slate-300", "font-medium");
		darkModeStatus.classList.add("text-slate-500");
		
		// Update icon to moon when dark mode is off
		const icon = darkModeButton.querySelector('i[data-lucide]');
		if (icon) {
			icon.setAttribute('data-lucide', 'moon');
		}
	}
	
	// Reinitialize lucide icons to show the new icon
	if (typeof lucide !== 'undefined') {
		lucide.createIcons();
	}
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initAccessibilityButton);
} else {
	initAccessibilityButton();
}
