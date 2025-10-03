/**
 * Consolidated Accessibility Features
 * Optimized version with reduced complexity and better maintainability
 */

class AccessibilityManager {
	constructor() {
		this.button = document.getElementById("accessibility-btn");
		this.panel = document.getElementById("accessibility-panel");
		this.mobileButton = document.getElementById("accessibility-btn-mobile");

		this.init();
	}

	init() {
		if (!this.button || !this.panel) return;

		this.setupPanelToggle();
		this.setupTextSize();
		this.setupToggleControls();
		this.setupKeyboardEnhancements();
		this.loadSavedPreferences();
	}

	setupPanelToggle() {
		const togglePanel = (event) => {
			event.preventDefault();
			event.stopPropagation();

			const isHidden = this.panel.classList.contains("hidden");
			this.panel.classList.toggle("hidden", !isHidden);

			// Optimized: set aria-expanded for both buttons in one operation
			const expanded = isHidden.toString();
			[this.button, this.mobileButton].filter(Boolean).forEach((btn) => {
				btn.setAttribute("aria-expanded", expanded);
			});
		};

		const closePanel = () => {
			this.panel.classList.add("hidden");
			// Optimized: set aria-expanded for both buttons in one operation
			[this.button, this.mobileButton].filter(Boolean).forEach((btn) => {
				btn.setAttribute("aria-expanded", "false");
			});
		};

		// Event listeners - optimized delegation
		[this.button, this.mobileButton].filter(Boolean).forEach((btn) => {
			btn.addEventListener("click", togglePanel);
		});

		// Optimized: single event listener for outside clicks and escape
		document.addEventListener("click", (e) => {
			const isInsidePanel = this.panel.contains(e.target);
			const isButton = [this.button, this.mobileButton]
				.filter(Boolean)
				.some((btn) => btn.contains(e.target));

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
		const sizeClasses = ['text-size-small', 'text-size-medium', 'text-size-large', 'text-size-xlarge'];
		const root = document.documentElement;
		
		// Remove all size classes at once, then add the new one
		root.classList.remove(...sizeClasses);
		root.classList.add(`text-size-${size}`);

		// Optimized: batch DOM updates for button states
		const buttons = document.querySelectorAll(".text-size-btn");
		
		buttons.forEach(btn => {
			const isActive = btn.getAttribute("data-size") === size;
			
			// Optimized: use toggle with condition instead of conditional add/remove
			btn.classList.toggle("active", isActive);
			btn.classList.toggle("bg-blue-600", isActive);
			btn.classList.toggle("text-white", isActive);
			btn.classList.toggle("bg-slate-100", !isActive);
			btn.classList.toggle("hover:bg-slate-200", !isActive);
			btn.classList.toggle("text-slate-700", !isActive);
		});
	}

	setupToggleControls() {
		this.setupToggle("dark-mode", {
			storageKey: "darkMode",
			className: "dark-mode",
			activeClasses: ["bg-slate-800", "text-white", "font-medium"],
			inactiveClasses: ["bg-slate-100", "hover:bg-slate-200", "text-slate-700"],
			hasIcon: true,
		});
	}

	setupToggle(type, config) {
		const button = document.getElementById(`${type}-toggle`);
		const status = document.getElementById(`${type.replace("-", "-")}-status`);

		if (!button || !status) return;

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
		button.setAttribute("aria-pressed", enabled.toString());

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
				// Defer icon refresh to avoid blocking
				requestAnimationFrame(() => {
					if (typeof lucide !== "undefined") lucide.createIcons();
				});
			}
		}

		// Update status styles (optimized for dark mode)
		if (config.className === "dark-mode") {
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

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener(
		"DOMContentLoaded",
		() => new AccessibilityManager()
	);
} else {
	new AccessibilityManager();
}
