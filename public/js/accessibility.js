/**
 * Simple Accessibility Button Functionality
 * Handles basic show/hide panel functionality
 */

function initAccessibilityButton() {
    const button = document.getElementById('accessibility-btn');
    const panel = document.getElementById('accessibility-panel');
    const mobileButton = document.getElementById('accessibility-btn-mobile');
    
    if (!button || !panel) return;
    
    // Toggle panel on button click
    function togglePanel(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const isHidden = panel.classList.contains('hidden');
        
        if (isHidden) {
            panel.classList.remove('hidden');
            button.setAttribute('aria-expanded', 'true');
            if (mobileButton) mobileButton.setAttribute('aria-expanded', 'true');
        } else {
            panel.classList.add('hidden');
            button.setAttribute('aria-expanded', 'false');
            if (mobileButton) mobileButton.setAttribute('aria-expanded', 'false');
        }
    }
    
    // Close panel when clicking outside
    function closePanel() {
        panel.classList.add('hidden');
        button.setAttribute('aria-expanded', 'false');
        if (mobileButton) mobileButton.setAttribute('aria-expanded', 'false');
    }
    
    // Event listeners
    button.addEventListener('click', togglePanel);
    if (mobileButton) mobileButton.addEventListener('click', togglePanel);
    
    // Close when clicking outside
    document.addEventListener('click', function(event) {
        if (!button.contains(event.target) && 
            !panel.contains(event.target) && 
            (!mobileButton || !mobileButton.contains(event.target))) {
            closePanel();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !panel.classList.contains('hidden')) {
            closePanel();
            button.focus();
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibilityButton);
} else {
    initAccessibilityButton();
}