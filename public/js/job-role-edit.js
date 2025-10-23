/**
 * Job Role Edit Form - Client-side validation and UX enhancements
 */

document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("editJobRoleForm");

	if (!form) {
		console.warn("Edit job role form not found on page");
		return;
	}

	// Validation helpers
	const validateURL = (str) => {
		try {
			const url = new URL(str);
			return url.protocol === "http:" || url.protocol === "https:";
		} catch {
			return false;
		}
	};

	const validateDate = (dateStr) => {
		if (!dateStr) return false;
		const selected = new Date(dateStr);
		// Check if date is valid
		if (Number.isNaN(selected.getTime())) return false;
		// For editing, allow dates in the past (they may have been set before)
		// Only validate that it's a valid date
		return true;
	};

	const validateField = (field, check, message) => {
		const isValid = check();
		field.classList.toggle("border-red-500", !isValid);
		return isValid ? null : message;
	};

	// Form validation and submission
	form.addEventListener("submit", (e) => {
		const errors = [
			validateField(
				form.roleName,
				() => form.roleName.value.trim().length > 0,
				"Role Name is required"
			),
			validateField(
				form.location,
				() => form.location.value.length > 0,
				"Location is required"
			),
			validateField(
				form.capability,
				() => form.capability.value.length > 0,
				"Capability is required"
			),
			validateField(
				form.band,
				() => form.band.value.length > 0,
				"Band Level is required"
			),
			validateField(
				form.closingDate,
				() => form.closingDate.value && validateDate(form.closingDate.value),
				"Closing Date is required"
			),
			validateField(
				form.numberOfOpenPositions,
				() => {
					const val = parseInt(form.numberOfOpenPositions.value, 10);
					return !Number.isNaN(val) && val >= 1;
				},
				"Number of Positions must be at least 1"
			),
			validateField(
				form.status,
				() => form.status.value.length > 0,
				"Status is required"
			),
			validateField(
				form.jobSpecLink,
				() =>
					form.jobSpecLink.value.trim() &&
					validateURL(form.jobSpecLink.value.trim()),
				"Job Spec Link must be a valid URL"
			),
			validateField(
				form.description,
				() => form.description.value.trim().length > 0,
				"Job Description is required"
			),
			validateField(
				form.responsibilities,
				() => form.responsibilities.value.trim().length > 0,
				"Key Responsibilities is required"
			),
		].filter(Boolean);

		if (errors.length) {
			e.preventDefault();
			alert(`Please fix the following errors:\n\n${errors.join("\n")}`);
			return;
		}

		// Show loading state (but don't disable form fields yet - they need to submit!)
		const submitButton = form.querySelector('button[type="submit"]');
		submitButton.disabled = true;
		submitButton.innerHTML = `
            <svg class="animate-spin w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating Job Role...
        `;

		// Don't disable other fields - they need to be enabled to submit their values!
		// The disabled submit button is enough to prevent duplicate submissions
	});

	// Clear error styling on input
	form.querySelectorAll("input, select, textarea").forEach((input) => {
		input.addEventListener("input", () =>
			input.classList.remove("border-red-500")
		);
	});

	// Auto-hide error message
	const errorMessage = document.getElementById("errorMessage");
	if (errorMessage) {
		setTimeout(() => {
			errorMessage.style.opacity = "0";
			errorMessage.style.transition = "opacity 0.5s";
			setTimeout(() => errorMessage.remove(), 500);
		}, 5000);
	}
});
