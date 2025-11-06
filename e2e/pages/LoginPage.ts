import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Login Page Object
 * Handles all interactions with the login page
 *
 * This page manages:
 * - Email and password input fields
 * - Login form submission
 * - Error message handling
 * - Navigation to register page
 * - Form state and validation
 */
export class LoginPage extends BasePage {
	// Locators - Page Structure
	private readonly loginContainer: Locator;
	private readonly loginHeading: Locator;

	// Locators - Form Fields
	private readonly emailInput: Locator;
	private readonly passwordInput: Locator;

	// Locators - Form Actions
	private readonly loginButton: Locator;
	private readonly forgotPasswordLink: Locator;

	// Locators - Navigation
	private readonly registerLink: Locator;
	private readonly registerText: Locator;

	// Locators - Status Messages
	private readonly errorMessage: Locator;
	private readonly successMessage: Locator;
	private readonly validationErrors: Locator;

	// Locators - Form State
	private readonly loadingSpinner: Locator;
	private readonly rememberMeCheckbox: Locator;

	constructor(page: Page) {
		super(page);
		// Page structure
		this.loginContainer = page.locator("form, .login-container, [role='main'] form");
		this.loginHeading = page.locator("h1, h2");

		// Form fields
		this.emailInput = page.locator('input[name="email"]');
		this.passwordInput = page.locator('input[name="password"]');

		// Form actions
		this.loginButton = page.locator('button[type="submit"]');
		this.forgotPasswordLink = page.locator('a[href*="forgot"], button:has-text("Forgot")');

		// Navigation
		this.registerLink = page.locator('a[href="/register"]');
		this.registerText = page.locator("text=/don't have an account|sign up|register/i");

		// Status messages
		this.errorMessage = page.locator(".alert-error, .error-message, .alert[role='alert']");
		this.successMessage = page.locator(".alert-success, .success-message");
		this.validationErrors = page.locator(".field-error, .error-text, .help-text.error");

		// Form state
		this.loadingSpinner = page.locator(".spinner, .loading, [aria-busy='true']");
		this.rememberMeCheckbox = page.locator('input[type="checkbox"][name*="remember"]');
	}

	/**
	 * Navigate to login page
	 */
	async navigate(): Promise<void> {
		await this.goto("/login");
		await this.waitForPageLoad();
	}

	/**
	 * Perform login with email and password
	 */
	async login(email: string, password: string): Promise<void> {
		await this.fillField(this.emailInput, email);
		await this.fillField(this.passwordInput, password);
		await this.clickElement(this.loginButton);
	}

	/**
	 * Fill email field only
	 */
	async fillEmail(email: string): Promise<void> {
		await this.fillField(this.emailInput, email);
	}

	/**
	 * Fill password field only
	 */
	async fillPassword(password: string): Promise<void> {
		await this.fillField(this.passwordInput, password);
	}

	/**
	 * Clear email field
	 */
	async clearEmail(): Promise<void> {
		await this.emailInput.clear();
	}

	/**
	 * Clear password field
	 */
	async clearPassword(): Promise<void> {
		await this.passwordInput.clear();
	}

	/**
	 * Get email field value
	 */
	async getEmailValue(): Promise<string | null> {
		return await this.emailInput.inputValue();
	}

	/**
	 * Get password field value
	 */
	async getPasswordValue(): Promise<string | null> {
		return await this.passwordInput.inputValue();
	}

	/**
	 * Click login button
	 */
	async clickLoginButton(): Promise<void> {
		await this.clickElement(this.loginButton);
	}

	/**
	 * Check if login button is enabled
	 */
	async isLoginButtonEnabled(): Promise<boolean> {
		return !(await this.loginButton.isDisabled());
	}

	/**
	 * Check if form is loading
	 */
	async isLoading(): Promise<boolean> {
		return await this.isVisible(this.loadingSpinner);
	}

	/**
	 * Wait for loading to complete
	 */
	async waitForLoadingComplete(): Promise<void> {
		const isLoading = await this.isLoading();
		if (isLoading) {
			await this.page.waitForFunction(
				() => {
					return !document.querySelector("[aria-busy='true']");
				},
				{ timeout: 10000 }
			);
		}
	}

	/**
	 * Check if error message is displayed
	 */
	async isErrorDisplayed(): Promise<boolean> {
		return await this.isVisible(this.errorMessage);
	}

	/**
	 * Get error message text
	 */
	async getErrorMessage(): Promise<string | null> {
		if (await this.isErrorDisplayed()) {
			return await this.getTextContent(this.errorMessage);
		}
		return null;
	}

	/**
	 * Get all validation error messages
	 */
	async getAllValidationErrors(): Promise<string[]> {
		const errors = await this.validationErrors.all();
		const errorTexts: string[] = [];

		for (const error of errors) {
			const text = await error.textContent();
			if (text) {
				errorTexts.push(text.trim());
			}
		}

		return errorTexts;
	}

	/**
	 * Check if success message is displayed
	 */
	async isSuccessDisplayed(): Promise<boolean> {
		return await this.isVisible(this.successMessage);
	}

	/**
	 * Get success message text
	 */
	async getSuccessMessage(): Promise<string | null> {
		if (await this.isSuccessDisplayed()) {
			return await this.getTextContent(this.successMessage);
		}
		return null;
	}

	/**
	 * Toggle remember me checkbox
	 */
	async toggleRememberMe(): Promise<void> {
		const isVisible = await this.isVisible(this.rememberMeCheckbox);
		if (isVisible) {
			await this.clickElement(this.rememberMeCheckbox);
		}
	}

	/**
	 * Check if remember me checkbox is checked
	 */
	async isRememberMeChecked(): Promise<boolean> {
		const isVisible = await this.isVisible(this.rememberMeCheckbox);
		if (isVisible) {
			return await this.rememberMeCheckbox.isChecked();
		}
		return false;
	}

	/**
	 * Check if forgot password link is visible
	 */
	async isForgotPasswordLinkVisible(): Promise<boolean> {
		return await this.isVisible(this.forgotPasswordLink);
	}

	/**
	 * Click forgot password link
	 */
	async clickForgotPassword(): Promise<void> {
		const isForgotVisible = await this.isForgotPasswordLinkVisible();
		if (isForgotVisible) {
			await this.clickElement(this.forgotPasswordLink);
		}
	}

	/**
	 * Check if register link is visible
	 */
	async isRegisterLinkVisible(): Promise<boolean> {
		return await this.isVisible(this.registerLink);
	}

	/**
	 * Click register link
	 */
	async goToRegister(): Promise<void> {
		const isRegisterVisible = await this.isRegisterLinkVisible();
		if (isRegisterVisible) {
			await this.clickElement(this.registerLink);
		}
	}

	/**
	 * Check if register text is visible
	 */
	async isRegisterTextVisible(): Promise<boolean> {
		return await this.isVisible(this.registerText);
	}

	/**
	 * Check if email field is visible
	 */
	async isEmailFieldVisible(): Promise<boolean> {
		return await this.isVisible(this.emailInput);
	}

	/**
	 * Check if password field is visible
	 */
	async isPasswordFieldVisible(): Promise<boolean> {
		return await this.isVisible(this.passwordInput);
	}

	/**
	 * Check if login button is visible
	 */
	async isLoginButtonVisible(): Promise<boolean> {
		return await this.isVisible(this.loginButton);
	}

	/**
	 * Verify all required form elements are visible
	 */
	async areAllFormElementsVisible(): Promise<boolean> {
		const emailVisible = await this.isEmailFieldVisible();
		const passwordVisible = await this.isPasswordFieldVisible();
		const loginBtnVisible = await this.isLoginButtonVisible();

		return emailVisible && passwordVisible && loginBtnVisible;
	}

	/**
	 * Verify login page loaded
	 */
	async verifyPageLoaded(): Promise<boolean> {
		await this.waitForElement(this.emailInput);
		await this.waitForElement(this.passwordInput);
		return true;
	}
}
