import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Job Application Form Page Object
 * Handles interactions with the job application form
 *
 * This page manages:
 * - Form field interactions (text inputs, file upload)
 * - Form validation
 * - Application submission
 * - Success/error message handling
 */
export class JobApplicationPage extends BasePage {
	// Locators - Form Container
	private readonly formContainer: Locator;
	private readonly formHeading: Locator;

	// Locators - Form Fields
	private readonly applicantNameInput: Locator;
	private readonly applicantEmailInput: Locator;
	private readonly phoneInput: Locator;
	private readonly cvUpload: Locator;
	private readonly coverLetterTextarea: Locator;

	// Locators - Form Actions
	private readonly submitButton: Locator;
	private readonly resetButton: Locator;
	private readonly backButton: Locator;

	// Locators - Validation Messages
	private readonly validationErrors: Locator;
	private readonly fieldErrorMessages: Locator;

	// Locators - Status Messages
	private readonly successMessage: Locator;
	private readonly errorMessage: Locator;
	private readonly loadingSpinner: Locator;

	constructor(page: Page) {
		super(page);
		// Form structure
		this.formContainer = page.locator("form, .form-container, [role='main'] form");
		this.formHeading = page.locator("h1, h2");

		// Form fields - matching actual field names
		this.applicantNameInput = page.locator('input[name="applicantName"]');
		this.applicantEmailInput = page.locator('input[name="applicantEmail"]');
		this.phoneInput = page.locator('input[name="phone"]');
		this.cvUpload = page.locator('input[type="file"][name="cv"]');
		this.coverLetterTextarea = page.locator('textarea[name="coverLetter"]');

		// Form actions
		this.submitButton = page.locator('button[type="submit"]');
		this.resetButton = page.locator('button[type="reset"]');
		this.backButton = page.locator('a.btn-back, button:has-text("Back")');

		// Validation
		this.validationErrors = page.locator(".alert-error, .validation-error");
		this.fieldErrorMessages = page.locator(".field-error, .error-text, .help-text.error");

		// Status messages
		this.successMessage = page.locator(
			".alert-success, .success-message, .toast-success, .alert[role='status']"
		);
		this.errorMessage = page.locator(".alert-error, .error-message, .toast-error");
		this.loadingSpinner = page.locator(".spinner, .loading, [aria-busy='true']");
	}

	/**
	 * Navigate to job application form
	 */
	async navigate(jobRoleId: number): Promise<void> {
		await this.goto(`/job-roles/${jobRoleId}/apply`);
		await this.waitForPageLoad();
	}

	/**
	 * Fill application form with data
	 */
	async fillApplicationForm(applicationData: {
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		coverLetter?: string;
	}): Promise<void> {
		// Combine firstName and lastName into full name for the applicantName field
		const fullName = `${applicationData.firstName} ${applicationData.lastName}`;
		await this.fillField(this.applicantNameInput, fullName);
		await this.fillField(this.applicantEmailInput, applicationData.email);
		await this.fillField(this.phoneInput, applicationData.phone);

		if (applicationData.coverLetter) {
			await this.fillField(this.coverLetterTextarea, applicationData.coverLetter);
		}
	}

	/**
	 * Fill only the name field
	 */
	async fillName(name: string): Promise<void> {
		await this.fillField(this.applicantNameInput, name);
	}

	/**
	 * Fill only the email field
	 */
	async fillEmail(email: string): Promise<void> {
		await this.fillField(this.applicantEmailInput, email);
	}

	/**
	 * Fill only the phone field
	 */
	async fillPhone(phone: string): Promise<void> {
		await this.fillField(this.phoneInput, phone);
	}

	/**
	 * Fill only the cover letter field
	 */
	async fillCoverLetter(coverLetter: string): Promise<void> {
		await this.fillField(this.coverLetterTextarea, coverLetter);
	}

	/**
	 * Get the value of a form field
	 */
	async getFieldValue(field: "name" | "email" | "phone"): Promise<string | null> {
		switch (field) {
			case "name":
				return await this.applicantNameInput.inputValue();
			case "email":
				return await this.applicantEmailInput.inputValue();
			case "phone":
				return await this.phoneInput.inputValue();
		}
	}

	/**
	 * Upload CV file
	 */
	async uploadCV(filePath: string): Promise<void> {
		await this.uploadFile(this.cvUpload, filePath);
	}

	/**
	 * Submit application
	 */
	async submitApplication(): Promise<void> {
		await this.clickElement(this.submitButton);
		// Wait for loading to complete or success message to appear
		await this.page.waitForTimeout(500);
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
	 * Check if submit button is enabled
	 */
	async isSubmitButtonEnabled(): Promise<boolean> {
		return !(await this.submitButton.isDisabled());
	}

	/**
	 * Reset form to initial state
	 */
	async resetForm(): Promise<void> {
		const resetBtnVisible = await this.isVisible(this.resetButton);
		if (resetBtnVisible) {
			await this.clickElement(this.resetButton);
		} else {
			// Manual reset by clearing fields
			await this.applicantNameInput.clear();
			await this.applicantEmailInput.clear();
			await this.phoneInput.clear();
			await this.coverLetterTextarea.clear();
		}
	}

	/**
	 * Go back to job roles page
	 */
	async goBack(): Promise<void> {
		const backBtnVisible = await this.isVisible(this.backButton);
		if (backBtnVisible) {
			await this.clickElement(this.backButton);
		} else {
			await this.page.goBack();
		}
	}

	/**
	 * Complete full application flow
	 */
	async completeApplication(
		applicationData: {
			firstName: string;
			lastName: string;
			email: string;
			phone: string;
			coverLetter?: string;
		},
		cvPath: string
	): Promise<void> {
		await this.fillApplicationForm(applicationData);
		await this.uploadCV(cvPath);
		await this.submitApplication();
		await this.waitForLoadingComplete();
	}

	/**
	 * Verify application form loaded
	 */
	async verifyPageLoaded(): Promise<boolean> {
		await this.waitForElement(this.applicantNameInput);
		await this.waitForElement(this.submitButton);
		return true;
	}

	/**
	 * Check if specific field is visible
	 */
	async isFieldVisible(
		field: "name" | "email" | "phone" | "coverLetter" | "cv"
	): Promise<boolean> {
		switch (field) {
			case "name":
				return await this.isVisible(this.applicantNameInput);
			case "email":
				return await this.isVisible(this.applicantEmailInput);
			case "phone":
				return await this.isVisible(this.phoneInput);
			case "coverLetter":
				return await this.isVisible(this.coverLetterTextarea);
			case "cv":
				return await this.isVisible(this.cvUpload);
		}
	}

	/**
	 * Check if all required fields are visible
	 */
	async areAllRequiredFieldsVisible(): Promise<boolean> {
		const nameVisible = await this.isFieldVisible("name");
		const emailVisible = await this.isFieldVisible("email");
		const phoneVisible = await this.isFieldVisible("phone");
		const cvVisible = await this.isFieldVisible("cv");

		return nameVisible && emailVisible && phoneVisible && cvVisible;
	}
}
