/**
 * Keyboard Accessibility Enhancements
 * Ensures all interactive elements work properly with keyboard navigation
 */

function initKeyboardAccessibility() {
	// Handle buttons with onclick attributes that might not work with keyboard
	handleOnClickButtons();
	
	// Add Enter key support for role="button" elements
	handleButtonRoles();
	
	// Add general keyboard navigation enhancements
	handleGeneralKeyboardEnhancements();
}

function handleOnClickButtons() {
	// Find all buttons with onclick attributes
	const onClickButtons = document.querySelectorAll('button[onclick]');
	
	onClickButtons.forEach(button => {
		// Add keyboard event listener for Enter and Space keys
		button.addEventListener('keydown', (event) => {
			// Check if Enter (13) or Space (32) was pressed
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				// Trigger the click event to execute the onclick handler
				button.click();
			}
		});
		
		// Ensure the button is focusable
		if (!button.hasAttribute('tabindex')) {
			button.setAttribute('tabindex', '0');
		}
	});
}

function handleButtonRoles() {
	// Find all elements with role="button" that aren't actual buttons
	const buttonRoles = document.querySelectorAll('[role="button"]:not(button)');
	
	buttonRoles.forEach(element => {
		// Add keyboard event listener
		element.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				// Trigger a click event
				element.click();
			}
		});
		
		// Ensure the element is focusable
		if (!element.hasAttribute('tabindex')) {
			element.setAttribute('tabindex', '0');
		}
	});
}

function handleGeneralKeyboardEnhancements() {
	// Handle card-like interactive elements that might be clickable
	const interactiveCards = document.querySelectorAll('.hover\\:shadow-lg, .hover\\:shadow-xl');
	
	interactiveCards.forEach(card => {
		// Check if the card contains a link or should be interactive
		const link = card.querySelector('a[href]');
		if (link) {
			// Make the card keyboard accessible
			card.setAttribute('tabindex', '0');
			card.setAttribute('role', 'link');
			card.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent.trim());
			
			card.addEventListener('keydown', (event) => {
				if (event.key === 'Enter') {
					event.preventDefault();
					link.click();
				}
			});
		}
	});
	
	// Handle mobile menu button if it exists
	const mobileMenuButtons = document.querySelectorAll('button[aria-haspopup], button[aria-expanded]');
	mobileMenuButtons.forEach(button => {
		// These should already work, but ensure they're properly labeled
		if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
			button.setAttribute('aria-label', 'Toggle menu');
		}
	});
}

// Add visual feedback for keyboard users
function addKeyboardFeedback() {
	// Add a subtle visual indicator for keyboard users
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Tab') {
			document.body.classList.add('keyboard-user');
		}
	});
	
	// Remove the indicator if mouse is used
	document.addEventListener('mousedown', () => {
		document.body.classList.remove('keyboard-user');
	});
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		initKeyboardAccessibility();
		addKeyboardFeedback();
	});
} else {
	initKeyboardAccessibility();
	addKeyboardFeedback();
}