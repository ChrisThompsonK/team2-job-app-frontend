/**
 * Consolidated Accessibility Features and App Initialization
 * Optimized version with reduced complexity and better maintainability
 * Includes contrast checking and accessibility validation
 */

/**
 * Check color contrast ratio between two colors
 * Returns true if contrast meets WCAG AA standards (4.5:1)
 */
function checkContrast(foreground, background) {
	function getRGBValues(color) {
		// Convert hex to RGB
		if (color.startsWith('#')) {
			const hex = color.slice(1);
			return [
				parseInt(hex.substr(0, 2), 16),
				parseInt(hex.substr(2, 2), 16),
				parseInt(hex.substr(4, 2), 16)
			];
		}
		// Handle rgb() format
		const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
		if (match) {
			return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
		}
		return [0, 0, 0]; // Fallback
	}

	function getLuminance(rgb) {
		const [r, g, b] = rgb.map(c => {
			const sRGB = c / 255;
			return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
		});
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	}

	const fgRGB = getRGBValues(foreground);
	const bgRGB = getRGBValues(background);
	const fgLum = getLuminance(fgRGB);
	const bgLum = getLuminance(bgRGB);
	const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
	
	return ratio >= 4.5; // WCAG AA standard
}

/**
 * Validate accessibility and contrast for form elements
 */
function validateAccessibility() {
	if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
		const formElements = document.querySelectorAll('input, select, textarea, button');
		
		formElements.forEach(element => {
			const computed = window.getComputedStyle(element);
			const foreground = computed.color;
			const background = computed.backgroundColor;
			
			// Only check elements with meaningful contrast (not transparent backgrounds)
			if (background && background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent') {
				const hasGoodContrast = checkContrast(foreground, background);
				
				if (!hasGoodContrast) {
					console.warn('Contrast issue detected:', {
						element: element.tagName + (element.className ? '.' + element.className.split(' ').join('.') : ''),
						foreground,
						background,
						suggestion: 'Consider using darker text or lighter background for better accessibility'
					});
				}
			}
			
			// Check for missing labels
			if (['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName) && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
				const label = document.querySelector(`label[for="${element.id}"]`);
				if (!label && !element.closest('label')) {
					console.warn('Missing label detected:', element);
				}
			}
		});
	}
}

/**
 * Switch header logo based on dark mode state
 * Can be called before AccessibilityManager is initialized
 */
function switchHeaderLogo(isDark) {
	// Only switch the header navigation logo, not logos in hero sections or footer
	const headerLogo = document.querySelector(
		'nav img[alt="Kainos Logo"], nav img[alt="Kainos Logo (dark)"]'
	);
	if (!headerLogo) return;

	if (isDark) {
		// Switch to dark logo (white version for dark backgrounds)
		if (headerLogo.src.includes("KainosLogoNoBackground.png")) {
			headerLogo.src = "/kainos-dark-bg.png";
			headerLogo.alt = "Kainos Logo (dark)";
		}
	} else {
		// Switch to light logo (dark version for light backgrounds)
		if (headerLogo.src.includes("kainos-dark-bg.png")) {
			headerLogo.src = "/KainosLogoNoBackground.png";
			headerLogo.alt = "Kainos Logo";
		}
	}
}

// Apply saved preferences immediately to prevent flash (light is default)
(() => {
	const savedDarkMode = localStorage.getItem("darkMode") === "true"; // only true explicitly enables dark
	const savedTextSize = localStorage.getItem("textSize") || "medium";

	// Apply dark mode only if explicitly stored
	if (savedDarkMode) {
		document.documentElement.classList.add("dark-mode");
		document.addEventListener("DOMContentLoaded", () => {
			document.body.classList.add("dark-mode");
			// Switch to dark mode logo when page loads with dark mode enabled
			switchHeaderLogo(true);
		});
	} else {
		// Ensure any stray dark-mode class is removed (in case markup was cached)
		document.documentElement.classList.remove("dark-mode");
		document.addEventListener("DOMContentLoaded", () => {
			document.body.classList.remove("dark-mode");
			// Ensure light mode logo when page loads with light mode
			switchHeaderLogo(false);
		});
	}

	// Apply text size preference (defaults to medium)
	const sizeClasses = [
		"text-size-small",
		"text-size-medium",
		"text-size-large",
		"text-size-xlarge",
	];
	document.documentElement.classList.remove(...sizeClasses);
	document.documentElement.classList.add(`text-size-${savedTextSize}`);
})();

/**
 * Initialize application features including Lucide icons
 */
function initializeApp() {
	// Initialize accessibility manager
	new AccessibilityManager();

	// Initialize Lucide icons after AccessibilityManager setup
	// This ensures all DOM elements are ready before icon creation
	if (typeof lucide !== "undefined") {
		lucide.createIcons();
	}

	// Run accessibility validation in development/testing
	// Only logs issues for developers to fix
	validateAccessibility();
}

class AccessibilityManager {
	constructor() {
		this.button = document.getElementById("accessibility-btn");
		this.panel = document.getElementById("accessibility-panel");
		this.mobileButton = document.getElementById("accessibility-btn-mobile");
		this.init();
	}

	init() {
		// Always setup dark mode toggle, even if accessibility panel is missing
		this.setupToggleControls();
		this.loadSavedPreferences();

		if (!this.button || !this.panel) {
			console.warn(
				"Accessibility button or panel not found, but dark mode will still work"
			);
			return;
		}

		this.setupPanelToggle();
		this.setupTextSize();
		this.setupKeyboardEnhancements();
	}

	setupPanelToggle() {
		const togglePanel = (event) => {
			event.preventDefault();
			event.stopPropagation();

			const isHidden = this.panel.classList.contains("hidden");
			this.panel.classList.toggle("hidden", !isHidden);

			// Optimized: direct assignment with null checks instead of filtering
			const expanded = isHidden.toString();
			if (this.button) this.button.setAttribute("aria-expanded", expanded);
			if (this.mobileButton)
				this.mobileButton.setAttribute("aria-expanded", expanded);
		};

		const closePanel = () => {
			this.panel.classList.add("hidden");
			// Optimized: direct assignment with null checks
			if (this.button) this.button.setAttribute("aria-expanded", "false");
			if (this.mobileButton)
				this.mobileButton.setAttribute("aria-expanded", "false");
		};

		// Event listeners - optimized with null checks
		if (this.button) this.button.addEventListener("click", togglePanel);
		if (this.mobileButton)
			this.mobileButton.addEventListener("click", togglePanel);

		// Optimized: single event listener for outside clicks and escape
		document.addEventListener("click", (e) => {
			const isInsidePanel = this.panel.contains(e.target);
			const isButton =
				this.button?.contains(e.target) ||
				this.mobileButton?.contains(e.target);

			if (!isInsidePanel && !isButton) {
				closePanel();
			}
		});

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && !this.panel.classList.contains("hidden")) {
				closePanel();
				this.button.focus();
			}
		});
	}

	setupTextSize() {
		const buttons = document.querySelectorAll(".text-size-btn");

		buttons.forEach((button) => {
			button.addEventListener("click", (e) => {
				e.preventDefault();
				const size = button.getAttribute("data-size");
				this.applyTextSize(size);
				localStorage.setItem("textSize", size);
			});
		});
	}

	applyTextSize(size) {
		// Optimized: use class list manipulation more efficiently
		const sizeClasses = [
			"text-size-small",
			"text-size-medium",
			"text-size-large",
			"text-size-xlarge",
		];
		const root = document.documentElement;

		// Remove all size classes at once, then add the new one
		root.classList.remove(...sizeClasses);
		root.classList.add(`text-size-${size}`);

		// Optimized: more efficient class management for button states
		const buttons = document.querySelectorAll(".text-size-btn");
		buttons.forEach((btn) => {
			const isActive = btn.getAttribute("data-size") === size;
			// Use className assignment for better performance with rounded corners
			btn.className = isActive
				? "text-size-btn active bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500"
				: "text-size-btn bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500";
		});
	}

	setupToggleControls() {
		this.setupToggle("dark", {
			storageKey: "darkMode",
			className: "dark-mode",
			activeClasses: ["bg-slate-800", "text-white", "font-medium"],
			inactiveClasses: ["bg-slate-100", "hover:bg-slate-200", "text-slate-700"],
			hasIcon: true,
		});

		// Setup simple dark mode toggle as backup
		this.setupSimpleDarkToggle();
	}

	setupSimpleDarkToggle() {
		const simpleToggle = document.getElementById("simple-dark-toggle");
		if (!simpleToggle) return;

		simpleToggle.addEventListener("click", (e) => {
			e.preventDefault();
			const isDark = document.documentElement.classList.contains("dark-mode");
			const newState = !isDark;

			// Toggle dark-mode class on both html and body for better compatibility
			document.documentElement.classList.toggle("dark-mode", newState);
			document.body.classList.toggle("dark-mode", newState);

			// Save to localStorage
			localStorage.setItem("darkMode", newState.toString());

			// Handle logo switching
			this.switchLogos(newState);

			// Update button icon and styling
			const icon = simpleToggle.querySelector("i[data-lucide]");
			if (icon) {
				icon.setAttribute("data-lucide", newState ? "sun" : "moon");
				if (typeof lucide !== "undefined") lucide.createIcons();
			}

			// Update button styling
			if (newState) {
				simpleToggle.className =
					"bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm ml-4";
			} else {
				simpleToggle.className =
					"bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm ml-4";
			}
		});
	}

	switchLogos(isDark) {
		// Use the global function for consistent logo switching
		switchHeaderLogo(isDark);
	}

	setupToggle(type, config) {
		const button = document.getElementById(`${type}-toggle`);
		const status = document.getElementById(`${type}-status`);

		if (!button || !status) {
			console.warn(`${type} toggle elements not found`);
			return;
		}

		button.addEventListener("click", (e) => {
			e.preventDefault();
			const isEnabled = document.documentElement.classList.contains(
				config.className
			);
			const newState = !isEnabled;

			this.applyToggle(button, status, config, newState);
			localStorage.setItem(config.storageKey, newState.toString());
		});
	}

	applyToggle(button, status, config, enabled) {
		// Optimized: pass elements directly to avoid repeated DOM queries
		document.documentElement.classList.toggle(config.className, enabled);
		// Also apply to body for better compatibility
		if (config.className === "dark-mode") {
			document.body.classList.toggle(config.className, enabled);
		}
		button.setAttribute("aria-pressed", enabled.toString());

		// Handle logo switching for dark mode
		if (config.className === "dark-mode") {
			this.switchLogos(enabled);
		}

		// Optimized: batch class updates
		if (enabled) {
			button.classList.remove(...config.inactiveClasses);
			button.classList.add(...config.activeClasses);
			status.textContent = "On";
		} else {
			button.classList.remove(...config.activeClasses);
			button.classList.add(...config.inactiveClasses);
			status.textContent = "Off";
		}

		// Handle icon changes for dark mode (optimized icon update)
		if (config.hasIcon) {
			const icon = button.querySelector("i[data-lucide]");
			if (icon) {
				icon.setAttribute("data-lucide", enabled ? "sun" : "moon");
				// Simplified icon refresh - remove unnecessary requestAnimationFrame
				if (typeof lucide !== "undefined") lucide.createIcons();
			}
		}

		// Update status styles (optimized for dark mode)
		if (config.className === "dark") {
			status.classList.toggle("text-slate-300", enabled);
			status.classList.toggle("font-medium", enabled);
			status.classList.toggle("text-slate-500", !enabled);
		}
	}

	setupKeyboardEnhancements() {
		// Optimized: use event delegation instead of individual listeners
		document.addEventListener("keydown", (e) => {
			const target = e.target;

			// Handle keyboard interactions for interactive elements
			if (
				(e.key === "Enter" || e.key === " ") &&
				(target.matches('button[onclick], [role="button"]:not(button)') ||
					target.matches(".hover\\:shadow-lg, .hover\\:shadow-xl"))
			) {
				e.preventDefault();

				if (target.matches(".hover\\:shadow-lg, .hover\\:shadow-xl")) {
					const link = target.querySelector("a[href]");
					if (link) link.click();
				} else {
					target.click();
				}
			}

			// Track keyboard usage
			if (e.key === "Tab") {
				this.handleKeyboardUser(true);
			}
		});

		// Track mouse usage
		document.addEventListener("mousedown", () => {
			this.handleKeyboardUser(false);
		});

		// Set up interactive elements (optimized query)
		this.setupInteractiveElements();
	}

	handleKeyboardUser(isKeyboard) {
		const body = document.body;
		const hasClass = body.classList.contains("keyboard-user");

		if (isKeyboard && !hasClass) {
			body.classList.add("keyboard-user");
		} else if (!isKeyboard && hasClass) {
			body.classList.remove("keyboard-user");
		}
	}

	setupInteractiveElements() {
		// Optimized: batch process interactive elements
		const interactiveElements = document.querySelectorAll(
			'button[onclick], [role="button"]:not(button)'
		);

		interactiveElements.forEach((element) => {
			if (!element.hasAttribute("tabindex")) {
				element.setAttribute("tabindex", "0");
			}
		});

		// Set up interactive cards with better accessibility
		const cards = document.querySelectorAll(
			".hover\\:shadow-lg, .hover\\:shadow-xl"
		);
		cards.forEach((card) => {
			const link = card.querySelector("a[href]");
			if (link && !card.hasAttribute("tabindex")) {
				card.setAttribute("tabindex", "0");
				card.setAttribute("role", "link");
				card.setAttribute(
					"aria-label",
					link.getAttribute("aria-label") || link.textContent.trim()
				);
			}
		});
	}

	loadSavedPreferences() {
		// Optimized: batch load preferences and minimize DOM queries
		const preferences = {
			textSize: localStorage.getItem("textSize") || "medium",
			darkMode: localStorage.getItem("darkMode") === "true",
		};

		// Apply text size
		this.applyTextSize(preferences.textSize);

		// Apply dark mode with cached elements
		const darkModeButton = document.getElementById("dark-mode-toggle");
		const darkModeStatus = document.getElementById("dark-mode-status");
		const darkModeConfig = {
			className: "dark-mode",
			activeClasses: ["bg-slate-800", "text-white", "font-medium"],
			inactiveClasses: ["bg-slate-100", "hover:bg-slate-200", "text-slate-700"],
			hasIcon: true,
		};

		if (darkModeButton && darkModeStatus) {
			this.applyToggle(
				darkModeButton,
				darkModeStatus,
				darkModeConfig,
				preferences.darkMode
			);
		}
	}
}

// Initialize application when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeApp);
} else {
	initializeApp();
}
