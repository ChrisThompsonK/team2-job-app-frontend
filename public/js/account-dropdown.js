/**
 * Header Account Dropdown JavaScript
 * Handles the account dropdown menu functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    const accountDropdownBtn = document.getElementById('account-dropdown-btn');
    const accountDropdownMenu = document.getElementById('account-dropdown-menu');
    const mobileAccountBtn = document.getElementById('mobile-account-btn');
    
    let isDropdownOpen = false;

    // Toggle dropdown when account button is clicked
    if (accountDropdownBtn && accountDropdownMenu) {
        accountDropdownBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (isDropdownOpen && !accountDropdownBtn.contains(e.target) && !accountDropdownMenu.contains(e.target)) {
                closeDropdown();
            }
        });

        // Handle keyboard navigation
        accountDropdownBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown();
            } else if (e.key === 'Escape') {
                closeDropdown();
            }
        });

        // Handle dropdown menu keyboard navigation
        accountDropdownMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeDropdown();
                accountDropdownBtn.focus();
            }
        });
    }

    // Mobile account button - redirect to mobile menu or profile
    if (mobileAccountBtn) {
        mobileAccountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // For mobile, we could redirect to profile or open mobile menu
            // For now, let's trigger the mobile menu
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenuBtn) {
                mobileMenuBtn.click();
            }
        });
    }

    function toggleDropdown() {
        if (isDropdownOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }

    function openDropdown() {
        if (!accountDropdownMenu) return;
        
        accountDropdownMenu.classList.remove('hidden');
        accountDropdownBtn.setAttribute('aria-expanded', 'true');
        
        // Rotate the dropdown arrow
        const arrow = accountDropdownBtn.querySelector('svg');
        if (arrow) {
            arrow.style.transform = 'rotate(180deg)';
        }
        
        isDropdownOpen = true;

        // Focus first menu item
        const firstMenuItem = accountDropdownMenu.querySelector('a, button');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
        }
    }

    function closeDropdown() {
        if (!accountDropdownMenu) return;
        
        accountDropdownMenu.classList.add('hidden');
        accountDropdownBtn.setAttribute('aria-expanded', 'false');
        
        // Reset the dropdown arrow
        const arrow = accountDropdownBtn.querySelector('svg');
        if (arrow) {
            arrow.style.transform = 'rotate(0deg)';
        }
        
        isDropdownOpen = false;
    }

    // Add smooth transitions for the dropdown
    if (accountDropdownMenu) {
        accountDropdownMenu.style.transition = 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out';
    }
});