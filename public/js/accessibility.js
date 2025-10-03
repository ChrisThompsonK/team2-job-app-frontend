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
			
			const expanded = isHidden.toString();
			this.button.setAttribute("aria-expanded", expanded);
			if (this.mobileButton) this.mobileButton.setAttribute("aria-expanded", expanded);
		};

		const closePanel = () => {
			this.panel.classList.add("hidden");
			this.button.setAttribute("aria-expanded", "false");
			if (this.mobileButton) this.mobileButton.setAttribute("aria-expanded", "false");
		};

		// Event listeners
		this.button.addEventListener("click", togglePanel);
		if (this.mobileButton) this.mobileButton.addEventListener("click", togglePanel);

		// Close on outside click or escape
		document.addEventListener("click", (e) => {
			if (!this.button.contains(e.target) && !this.panel.contains(e.target) && 
				(!this.mobileButton || !this.mobileButton.contains(e.target))) {
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
		
		buttons.forEach(button => {
			button.addEventListener("click", (e) => {
				e.preventDefault();
				const size = button.getAttribute("data-size");
				this.applyTextSize(size);
				localStorage.setItem("textSize", size);
			});
		});
	}

	applyTextSize(size) {
		// Remove all text size classes efficiently
		const sizeClasses = ['text-size-small', 'text-size-medium', 'text-size-large', 'text-size-xlarge'];
		document.documentElement.classList.remove(...sizeClasses);
		document.documentElement.classList.add(`text-size-${size}`);

		// Update active button
		document.querySelectorAll(".text-size-btn").forEach(btn => {
			const isActive = btn.getAttribute("data-size") === size;
			btn.classList.toggle("active", isActive);
			
			if (isActive) {
				btn.classList.remove("bg-slate-100", "hover:bg-slate-200", "text-slate-700");
				btn.classList.add("bg-blue-600", "text-white");
			} else {
				btn.classList.remove("bg-blue-600", "text-white");
				btn.classList.add("bg-slate-100", "hover:bg-slate-200", "text-slate-700");
			}
		});
	}

	setupToggleControls() {
		this.setupToggle("high-contrast", {
			storageKey: "highContrast",
			className: "high-contrast",
			activeClasses: ["bg-yellow-400", "text-black", "font-bold"],
			inactiveClasses: ["bg-slate-100", "hover:bg-slate-200", "text-slate-700"]
		});

		this.setupToggle("dark-mode", {
			storageKey: "darkMode",
			className: "dark-mode",
			activeClasses: ["bg-slate-800", "text-white", "font-medium"],
			inactiveClasses: ["bg-slate-100", "hover:bg-slate-200", "text-slate-700"],
			hasIcon: true
		});
	}

	setupToggle(type, config) {
		const button = document.getElementById(`${type}-toggle`);
		const status = document.getElementById(`${type.replace('-', '-')}-status`);
		
		if (!button || !status) return;

		button.addEventListener("click", (e) => {
			e.preventDefault();
			const isEnabled = document.documentElement.classList.contains(config.className);
			const newState = !isEnabled;
			
			this.applyToggle(type, config, newState);
			localStorage.setItem(config.storageKey, newState.toString());
		});
	}

	applyToggle(type, config, enabled) {
		const button = document.getElementById(`${type}-toggle`);
		const status = document.getElementById(`${type.replace('-', '-')}-status`);
		
		// Apply/remove main class
		document.documentElement.classList.toggle(config.className, enabled);
		button.setAttribute("aria-pressed", enabled.toString());
		
		// Update button appearance
		if (enabled) {
			button.classList.remove(...config.inactiveClasses);
			button.classList.add(...config.activeClasses);
			status.textContent = "On";
		} else {
			button.classList.remove(...config.activeClasses);
			button.classList.add(...config.inactiveClasses);
			status.textContent = "Off";
		}

		// Handle icon changes for dark mode
		if (config.hasIcon) {
			const icon = button.querySelector('i[data-lucide]');
			if (icon) {
				icon.setAttribute('data-lucide', enabled ? 'sun' : 'moon');
				if (typeof lucide !== 'undefined') lucide.createIcons();
			}
		}

		// Update status styles
		if (type === 'high-contrast') {
			status.classList.toggle("text-black", enabled);
			status.classList.toggle("font-bold", enabled);
			status.classList.toggle("text-slate-500", !enabled);
		} else if (type === 'dark-mode') {
			status.classList.toggle("text-slate-300", enabled);
			status.classList.toggle("font-medium", enabled);
			status.classList.toggle("text-slate-500", !enabled);
		}
	}

	setupKeyboardEnhancements() {
		// Add keyboard support for onclick buttons and role="button" elements
		const interactiveElements = document.querySelectorAll('button[onclick], [role="button"]:not(button)');
		
		interactiveElements.forEach(element => {
			element.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					element.click();
				}
			});
			
			if (!element.hasAttribute('tabindex')) {
				element.setAttribute('tabindex', '0');
			}
		});

		// Keyboard user feedback
		let isKeyboardUser = false;
		
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Tab' && !isKeyboardUser) {
				isKeyboardUser = true;
				document.body.classList.add('keyboard-user');
			}
		});
		
		document.addEventListener('mousedown', () => {
			if (isKeyboardUser) {
				isKeyboardUser = false;
				document.body.classList.remove('keyboard-user');
			}
		});

		// Make interactive cards accessible
		document.querySelectorAll('.hover\\:shadow-lg, .hover\\:shadow-xl').forEach(card => {
			const link = card.querySelector('a[href]');
			if (link) {
				card.setAttribute('tabindex', '0');
				card.setAttribute('role', 'link');
				card.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent.trim());
				
				card.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						link.click();
					}
				});
			}
		});
	}

	loadSavedPreferences() {
		// Load and apply saved preferences
		const textSize = localStorage.getItem("textSize") || "medium";
		this.applyTextSize(textSize);

		const darkMode = localStorage.getItem("darkMode") === "true";
		this.applyToggle("dark-mode", {
			className: "dark-mode",
			activeClasses: ["bg-slate-800", "text-white", "font-medium"],
			inactiveClasses: ["bg-slate-100", "hover:bg-slate-200", "text-slate-700"],
			hasIcon: true
		}, darkMode);

		const highContrast = localStorage.getItem("highContrast") === "true";
		this.applyToggle("high-contrast", {
			className: "high-contrast",
			activeClasses: ["bg-yellow-400", "text-black", "font-bold"],
			inactiveClasses: ["bg-slate-100", "hover:bg-slate-200", "text-slate-700"]
		}, highContrast);
	}
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => new AccessibilityManager());
} else {
	new AccessibilityManager();
}
