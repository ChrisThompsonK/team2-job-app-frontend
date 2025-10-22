/**
 * Client-side authentication UI enhancements
 * Forms submit naturally to Express server routes
 */

// Note: This file only handles UI enhancements.
// Form submission is handled by the server via regular form POST,
// following the same pattern as other forms in the application.

/**
 * Set loading state for form submission
 */
function setLoadingState(button, isLoading) {
  if (!button) return;

  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `
      <svg class="animate-spin w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    `;
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || button.innerHTML;
  }
}

/**
 * Handle login form submission
 */
async function handleLogin(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const emailInput = form.querySelector('input[name="email"], input[name="username"]');
  const passwordInput = form.querySelector('input[name="password"]');

  // Get form data
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Clear previous errors
  const existingError = form.querySelector(".auth-error-display");
  if (existingError) {
    existingError.remove();
  }

  // Set loading state
  setLoadingState(submitBtn, true);

  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Display error from API
      const errorMessage = data.message || data.error || "Login failed. Please try again.";
      displayError(form.id, errorMessage);
      setLoadingState(submitBtn, false);
      return;
    }

    // Success - store success message and redirect to homepage
    if (data.user && data.user.forename && data.user.surname) {
      sessionStorage.setItem("loginSuccess", `Logged in successfully as: ${data.user.forename} ${data.user.surname}`);
    } else {
      sessionStorage.setItem("loginSuccess", "Logged in successfully!");
    }
    window.location.href = "/";
  } catch (error) {
    console.error("Login error:", error);
    displayError(form.id, "Unable to connect to the server. Please try again later.");
    setLoadingState(submitBtn, false);
  }
}

/**
 * Handle registration form submission
 */
async function handleRegister(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const emailInput = form.querySelector('input[name="email"]');
  const passwordInput = form.querySelector('input[name="password"]');
  const forenameInput = form.querySelector('input[name="forename"], input[name="firstName"]');
  const surnameInput = form.querySelector('input[name="surname"], input[name="lastName"]');

  // Get form data
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const forename = forenameInput.value.trim();
  const surname = surnameInput.value.trim();

  // Clear previous errors
  const existingError = form.querySelector(".auth-error-display");
  if (existingError) {
    existingError.remove();
  }

  // Set loading state
  setLoadingState(submitBtn, true);

  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password, forename, surname }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Display error from API
      if (data.details && Array.isArray(data.details)) {
        displayError(form.id, data.details);
      } else {
        const errorMessage = data.message || data.error || "Registration failed. Please try again.";
        displayError(form.id, errorMessage);
      }
      setLoadingState(submitBtn, false);
      return;
    }

    // Success - store success message and redirect to homepage
    if (data.user && data.user.forename && data.user.surname) {
      sessionStorage.setItem("loginSuccess", `Registered and logged in successfully as: ${data.user.forename} ${data.user.surname}`);
    } else {
      sessionStorage.setItem("loginSuccess", "Registration successful!");
    }
    window.location.href = "/";
  } catch (error) {
    console.error("Registration error:", error);
    displayError(form.id, "Unable to connect to the server. Please try again later.");
    setLoadingState(submitBtn, false);
  }
}

/**
 * Initialize authentication forms
 */
document.addEventListener("DOMContentLoaded", () => {
  // Login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Registration form
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
});
