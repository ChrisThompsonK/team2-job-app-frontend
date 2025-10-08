/**
 * Job Role Filtering System
 * Optimized for performance with large datasets
 */

// Cache DOM elements and job card data for better performance
let cachedElements = null;
let cachedJobCards = null;
let debounceTimer = null;

/**
 * Initialize the filtering system by caching DOM elements and card data
 */
function initializeFiltering() {
    // Cache filter controls
    cachedElements = {
        searchBar: document.getElementById('search-bar'),
        locationFilter: document.getElementById('location-filter'),
        bandFilter: document.getElementById('band-filter')
    };

    // Cache job cards and their data to avoid repeated DOM queries
    const jobCardElements = document.querySelectorAll('.job-card');
    cachedJobCards = Array.from(jobCardElements).map(card => ({
        element: card,
        roleName: (card.getAttribute('data-job-role') || '').toLowerCase(),
        location: card.getAttribute('data-location') || '',
        band: card.getAttribute('data-band') || ''
    }));
}

/**
 * Debounced filter function for search input
 * Delays execution until user stops typing (300ms)
 */
function filterJobRolesDebounced() {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(() => {
        filterJobRoles();
    }, 300);
}

/**
 * Main filtering function - optimized for performance
 */
function filterJobRoles() {
    // Initialize cache if not already done
    if (!cachedElements || !cachedJobCards) {
        initializeFiltering();
    }

    // Get current filter values
    const query = cachedElements.searchBar.value.toLowerCase();
    const locationFilter = cachedElements.locationFilter.value;
    const bandFilter = cachedElements.bandFilter.value;

    // Use CSS class toggling instead of direct style manipulation
    // This is more efficient and avoids layout thrashing
    cachedJobCards.forEach(({ element, roleName, location, band }) => {
        const matchesQuery = !query || roleName.includes(query);
        const matchesLocation = !locationFilter || location === locationFilter;
        const matchesBand = !bandFilter || band === bandFilter;

        const shouldShow = matchesQuery && matchesLocation && matchesBand;
        
        // Toggle visibility class instead of inline styles
        if (shouldShow) {
            element.classList.remove('hidden');
            element.style.display = '';
        } else {
            element.classList.add('hidden');
            element.style.display = 'none';
        }
    });
}

/**
 * Initialize filtering when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFiltering);
} else {
    initializeFiltering();
}
