# Adding New Page Objects - Checklist

## Step-by-Step Guide to Create a New Page Object

### Phase 1: Preparation

- [ ] Identify the page/feature that needs testing
- [ ] List all user interactions (fill form, click buttons, navigate, etc.)
- [ ] Identify all elements that need to be interacted with (inputs, buttons, messages)
- [ ] Plan test scenarios you want to cover
- [ ] Review existing page objects for patterns

### Phase 2: File Setup

- [ ] Create `pages/NewPage.ts` file
- [ ] Import required types: `import type { Page, Locator } from "@playwright/test"`
- [ ] Import BasePage: `import { BasePage } from "./BasePage"`
- [ ] Export class: `export class NewPage extends BasePage { ... }`

### Phase 3: Locator Definition

```typescript
export class RegisterPage extends BasePage {
  // 1. Organize locators by category
  
  // Page structure
  private readonly formContainer: Locator;
  private readonly pageHeading: Locator;

  // Form fields
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;

  // Form actions
  private readonly submitButton: Locator;
  private readonly backButton: Locator;

  // Status messages
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;
  private readonly validationErrors: Locator;

  // Optional elements
  private readonly termsCheckbox: Locator;
  private readonly loginLink: Locator;
}
```

### Phase 4: Constructor

```typescript
constructor(page: Page) {
  super(page);
  
  // Initialize all locators
  this.formContainer = page.locator("form, .register-container");
  this.pageHeading = page.locator("h1");
  
  // Form fields
  this.firstNameInput = page.locator('input[name="firstName"]');
  this.lastNameInput = page.locator('input[name="lastName"]');
  this.emailInput = page.locator('input[name="email"]');
  this.passwordInput = page.locator('input[name="password"]');
  this.confirmPasswordInput = page.locator('input[name="confirmPassword"]');
  
  // Form actions
  this.submitButton = page.locator('button[type="submit"]');
  this.backButton = page.locator('button:has-text("Back"), a.btn-back');
  
  // Status messages
  this.successMessage = page.locator(".alert-success");
  this.errorMessage = page.locator(".alert-error");
  this.validationErrors = page.locator(".field-error");
  
  // Optional
  this.termsCheckbox = page.locator('input[type="checkbox"][name="terms"]');
  this.loginLink = page.locator('a[href="/login"]');
}
```

### Phase 5: Core Navigation Method

```typescript
/**
 * Navigate to registration page
 */
async navigate(): Promise<void> {
  await this.goto("/register");
  await this.waitForPageLoad();
}
```

### Phase 6: User Action Methods

```typescript
/**
 * Fill registration form with data
 */
async fillRegistrationForm(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<void> {
  await this.fillField(this.firstNameInput, data.firstName);
  await this.fillField(this.lastNameInput, data.lastName);
  await this.fillField(this.emailInput, data.email);
  await this.fillField(this.passwordInput, data.password);
  await this.fillField(this.confirmPasswordInput, data.confirmPassword);
}

/**
 * Fill individual fields
 */
async fillFirstName(name: string): Promise<void> {
  await this.fillField(this.firstNameInput, name);
}

async fillLastName(name: string): Promise<void> {
  await this.fillField(this.lastNameInput, name);
}

async fillEmail(email: string): Promise<void> {
  await this.fillField(this.emailInput, email);
}

async fillPassword(password: string): Promise<void> {
  await this.fillField(this.passwordInput, password);
}

async fillConfirmPassword(password: string): Promise<void> {
  await this.fillField(this.confirmPasswordInput, password);
}

/**
 * Clear individual fields
 */
async clearEmail(): Promise<void> {
  await this.emailInput.clear();
}

/**
 * Get field values
 */
async getEmailValue(): Promise<string | null> {
  return await this.emailInput.inputValue();
}

/**
 * Submit registration
 */
async submitRegistration(): Promise<void> {
  await this.clickElement(this.submitButton);
}

/**
 * Toggle terms checkbox
 */
async acceptTerms(): Promise<void> {
  if (!(await this.termsCheckbox.isChecked())) {
    await this.clickElement(this.termsCheckbox);
  }
}

/**
 * Go back or login
 */
async goBack(): Promise<void> {
  const visible = await this.isVisible(this.backButton);
  if (visible) {
    await this.clickElement(this.backButton);
  } else {
    await this.page.goBack();
  }
}

async goToLogin(): Promise<void> {
  await this.clickElement(this.loginLink);
}
```

### Phase 7: Verification Methods

```typescript
/**
 * Check if form element is visible
 */
async isFieldVisible(field: "firstName" | "email" | "password"): Promise<boolean> {
  switch (field) {
    case "firstName":
      return await this.isVisible(this.firstNameInput);
    case "email":
      return await this.isVisible(this.emailInput);
    case "password":
      return await this.isVisible(this.passwordInput);
  }
}

/**
 * Check if all required fields are visible
 */
async areAllRequiredFieldsVisible(): Promise<boolean> {
  const firstName = await this.isVisible(this.firstNameInput);
  const lastName = await this.isVisible(this.lastNameInput);
  const email = await this.isVisible(this.emailInput);
  const password = await this.isVisible(this.passwordInput);

  return firstName && lastName && email && password;
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
 * Get all validation errors
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
 * Verify page loaded
 */
async verifyPageLoaded(): Promise<boolean> {
  await this.waitForElement(this.formContainer);
  await this.waitForElement(this.submitButton);
  return true;
}
```

### Phase 8: Create Test File

Create `tests/register.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { testData } from "../fixtures/testData";

test.describe("Registration Form", () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.navigate();
  });

  test.describe("Page Load", () => {
    test("should load registration page", async () => {
      const isLoaded = await registerPage.verifyPageLoaded();
      expect(isLoaded).toBe(true);
    });

    test("should display all required fields", async () => {
      const allVisible = await registerPage.areAllRequiredFieldsVisible();
      expect(allVisible).toBe(true);
    });
  });

  test.describe("Form Submission", () => {
    test("should submit valid registration", async () => {
      await registerPage.fillRegistrationForm({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "Password123!",
        confirmPassword: "Password123!"
      });
      
      await registerPage.acceptTerms();
      await registerPage.submitRegistration();

      const isSuccess = await registerPage.isSuccessDisplayed();
      expect(isSuccess).toBe(true);
    });
  });

  test.describe("Validation", () => {
    test("should show error on password mismatch", async () => {
      await registerPage.fillPassword("Password123!");
      await registerPage.fillConfirmPassword("DifferentPassword");
      await registerPage.submitRegistration();

      const hasError = await registerPage.isErrorDisplayed();
      expect(hasError).toBe(true);
    });
  });
});
```

### Phase 9: Update Test Data

Add to `fixtures/testData.ts`:

```typescript
export const testRegistrations = {
  validRegistration: {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    password: "SecurePass123!",
    confirmPassword: "SecurePass123!",
  },
  passwordMismatch: {
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    password: "Password123!",
    confirmPassword: "DifferentPass123!",
  },
  invalidEmail: {
    firstName: "Alice",
    lastName: "Brown",
    email: "invalid-email",
    password: "Password123!",
    confirmPassword: "Password123!",
  },
};
```

### Phase 10: Verification Checklist

- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Selectors are correct for target page
- [ ] All public methods have JSDoc comments
- [ ] Private locators are properly initialized
- [ ] Methods follow naming conventions
- [ ] Tests can successfully navigate to page
- [ ] Tests can perform basic interactions
- [ ] Error handling is implemented
- [ ] Verify methods are comprehensive
- [ ] Code is formatted consistently

### Phase 11: Documentation

- [ ] Add page object to `e2e/README.md`
- [ ] Include method examples in documentation
- [ ] Add test examples to developer guide
- [ ] Update this checklist with lessons learned

## Template (Copy & Paste)

```typescript
import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * [PageName] Page Object
 * Handles all interactions with the [page/feature]
 */
export class [PageName] extends BasePage {
  // Locators - Page Structure
  private readonly container: Locator;

  // Locators - Form Fields
  private readonly input1: Locator;

  // Locators - Buttons
  private readonly submitButton: Locator;

  // Locators - Messages
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.container = page.locator("form, .container");
    this.input1 = page.locator('input[name="field1"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.successMessage = page.locator(".alert-success");
    this.errorMessage = page.locator(".alert-error");
  }

  /**
   * Navigate to page
   */
  async navigate(): Promise<void> {
    await this.goto("/path");
    await this.waitForPageLoad();
  }

  /**
   * Verify page loaded
   */
  async verifyPageLoaded(): Promise<boolean> {
    await this.waitForElement(this.container);
    return true;
  }
}
```

---

**Following this checklist ensures consistency and quality across all page objects!**
