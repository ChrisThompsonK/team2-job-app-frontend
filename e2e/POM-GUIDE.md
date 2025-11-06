# Page Object Model (POM) - Complete Guide

## Table of Contents
1. [What is POM?](#what-is-pom)
2. [Why Use POM?](#why-use-pom)
3. [Core Concepts](#core-concepts)
4. [Architecture](#architecture)
5. [Implementation](#implementation)
6. [Examples](#examples)
7. [Best Practices](#best-practices)
8. [Common Mistakes](#common-mistakes)

---

## What is POM?

**Page Object Model** is a design pattern that creates an object-oriented representation of web pages. It encapsulates all the interactions with a page (element locators, actions, and verifications) into a dedicated page class.

### Simple Definition
> Instead of writing test code directly against web elements, you write against methods that represent user actions on a page.

---

## Why Use POM?

### The Problem Without POM

Imagine you're writing tests without POM. You might have code like this scattered across multiple test files:

```typescript
// Test 1: login.spec.ts
await page.locator('input[name="email"]').fill("user@test.com");
await page.locator('input[name="password"]').fill("password123");
await page.locator('button[type="submit"]').click();

// Test 2: profile.spec.ts
await page.locator('input[name="email"]').fill("user@test.com");
await page.locator('input[name="password"]').fill("password123");
await page.locator('button[type="submit"]').click();

// Test 3: settings.spec.ts
await page.locator('input[name="email"]').fill("user@test.com");
await page.locator('input[name="password"]').fill("password123");
await page.locator('button[type="submit"]').click();
```

**Problems:**
- ❌ **Duplication**: Same code repeated in 3+ places
- ❌ **Hard to Maintain**: Change one selector → must update 10+ tests
- ❌ **Unreadable**: Tests are full of technical selectors, not business logic
- ❌ **Brittle**: One HTML change breaks all tests using that element
- ❌ **Error-prone**: Copy-paste mistakes when reusing code
- ❌ **Not scalable**: Becomes unmanageable with 100+ tests

### The Solution With POM

With POM, you write:

```typescript
// Create page object once
const loginPage = new LoginPage(page);

// Use in multiple tests (simple and clear)
await loginPage.login("user@test.com", "password123");
await loginPage.login("admin@test.com", "admin123");
await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
```

**Benefits:**
- ✅ **DRY Principle**: Define selectors once, use everywhere
- ✅ **Maintainability**: Change selector in one place → all tests updated
- ✅ **Readability**: Tests read like English, not HTML selectors
- ✅ **Robustness**: One HTML change → update one page object
- ✅ **Reusability**: Share page methods across all tests
- ✅ **Scalability**: Easy to maintain 100+ tests

---

## Core Concepts

### 1. Encapsulation
Hide implementation details (how the page works) from users (test writers).

```typescript
// What tests see (the interface)
async login(email: string, password: string): Promise<void>

// What's hidden inside (implementation)
private readonly emailInput: Locator = page.locator('input[name="email"]');
private readonly passwordInput: Locator = page.locator('input[name="password"]');
private readonly loginButton: Locator = page.locator('button[type="submit"]');

async login(email: string, password: string): Promise<void> {
  await this.fillField(this.emailInput, email);
  await this.fillField(this.passwordInput, password);
  await this.clickElement(this.loginButton);
}
```

**Benefits:**
- Tests don't need to know HTML structure
- Selectors are implementation details
- Easy to refactor HTML without changing tests

### 2. Locators (Element Selectors)
Defined once as private properties in the page object.

```typescript
export class LoginPage extends BasePage {
  // Private locators - not accessible outside this class
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    // Initialize locators once
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
  }
}
```

**Why Private?**
- Prevents accidental direct access from tests
- Forces tests to use public methods
- Makes refactoring safer

### 3. Page Methods (Actions)
Public methods that represent user interactions.

```typescript
export class LoginPage extends BasePage {
  // User action methods
  async navigate(): Promise<void> { }
  async login(email: string, password: string): Promise<void> { }
  async goToRegister(): Promise<void> { }
  async isErrorDisplayed(): Promise<boolean> { }
  async getErrorMessage(): Promise<string | null> { }
}
```

**Good Method Names:**
```typescript
✅ async login(email: string, password: string): Promise<void>
✅ async goToRegister(): Promise<void>
✅ async isErrorDisplayed(): Promise<boolean>

❌ async fillEmailAndPassword(email: string, password: string): Promise<void>
❌ async clickLogin(): Promise<void>
❌ async checkError(): Promise<boolean>
```

Why? Methods should describe **what** the user wants to do, not **how** (implementation details).

### 4. Verification Methods
Methods to check page state and retrieve information.

```typescript
async verifyPageLoaded(): Promise<boolean>
async isErrorDisplayed(): Promise<boolean>
async getErrorMessage(): Promise<string | null>
async getTitle(): Promise<string>
async getFieldValue(field: Locator): Promise<string | null>
```

---

## Architecture

### Three-Layer Architecture

```
┌─────────────────────────────────────┐
│       TEST SPECIFICATIONS           │  ← Tests (login.spec.ts)
│   (Readable, business-focused)      │     "should login successfully"
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│      PAGE OBJECT MODELS             │  ← Page Objects (LoginPage)
│  (Encapsulates page interactions)   │    "login(email, password)"
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│        BASE PAGE CLASS              │  ← Base (BasePage)
│   (Common functionality)            │    "fillField, clickElement"
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│       PLAYWRIGHT / BROWSER          │  ← Browser API
│     (Low-level interactions)        │    "locator().fill()"
└─────────────────────────────────────┘
```

### Layer Responsibilities

#### Layer 1: Tests
- **What**: Define test scenarios
- **Concern**: Business logic, test flow
- **Focus**: "Given, When, Then"

```typescript
test("should login successfully", async () => {
  // Navigate to login
  // Enter credentials
  // Click login
  // Verify success
});
```

#### Layer 2: Page Objects
- **What**: Define page interactions
- **Concern**: How to interact with a specific page
- **Focus**: Page-specific methods

```typescript
async login(email: string, password: string): Promise<void> {
  await this.fillField(this.emailInput, email);
  await this.fillField(this.passwordInput, password);
  await this.clickElement(this.loginButton);
}
```

#### Layer 3: Base Page
- **What**: Common functionality
- **Concern**: Reusable methods for all pages
- **Focus**: Generic interactions

```typescript
async fillField(locator: Locator, value: string): Promise<void>
async clickElement(locator: Locator): Promise<void>
async waitForElement(locator: Locator): Promise<void>
```

---

## Implementation

### Step 1: Create Base Page Class

```typescript
// e2e/pages/BasePage.ts
import type { Page, Locator } from "@playwright/test";

export class BasePage {
  protected page: Page;
  protected baseURL: string = "http://localhost:3000";

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async goto(path: string = ""): Promise<void> {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  // Wait for page to load
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  // Element interactions
  async fillField(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  // Verification
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async getTextContent(locator: Locator): Promise<string | null> {
    return await locator.textContent();
  }

  // Get page info
  async getTitle(): Promise<string> {
    return await this.page.title();
  }
}
```

### Step 2: Create Specific Page Objects

```typescript
// e2e/pages/LoginPage.ts
import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  // Define locators once
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize all locators
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator(".alert-error");
  }

  // Page-specific actions
  async navigate(): Promise<void> {
    await this.goto("/login");
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillField(this.emailInput, email);
    await this.fillField(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async goToRegister(): Promise<void> {
    await this.page.click('a[href="/register"]');
  }

  // Verification methods
  async verifyPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.emailInput);
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  async getErrorMessage(): Promise<string | null> {
    return await this.getTextContent(this.errorMessage);
  }
}
```

### Step 3: Write Tests Using Page Objects

```typescript
// e2e/tests/login.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { testUsers } from "../fixtures/testData";

test.describe("Login Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test("should load login page", async () => {
    const isLoaded = await loginPage.verifyPageLoaded();
    expect(isLoaded).toBe(true);
  });

  test("should login successfully with valid credentials", async () => {
    await loginPage.login(
      testUsers.validUser.email,
      testUsers.validUser.password
    );
    await loginPage.waitForPageLoad();

    // Verify successful login (not on login page anymore)
    const currentUrl = loginPage["page"].url();
    expect(currentUrl).not.toContain("/login");
  });

  test("should show error for invalid email", async () => {
    await loginPage.login("invalid-email", testUsers.validUser.password);
    await loginPage.waitForPageLoad();

    const isErrorDisplayed = await loginPage.isErrorDisplayed();
    expect(isErrorDisplayed).toBe(true);
  });
});
```

---

## Examples

### Example 1: Simple Page Object

```typescript
// e2e/pages/HomePage.ts
import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly resultsList: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[placeholder="Search"]');
    this.searchButton = page.locator('button[aria-label="Search"]');
    this.resultsList = page.locator('[data-testid="results"]');
  }

  async navigate(): Promise<void> {
    await this.goto("/");
  }

  async search(query: string): Promise<void> {
    await this.fillField(this.searchInput, query);
    await this.clickElement(this.searchButton);
    await this.waitForPageLoad();
  }

  async getResultsCount(): Promise<number> {
    return await this.resultsList.count();
  }

  async verifyPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.searchInput);
  }
}
```

**Usage:**
```typescript
test("should search successfully", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  await homePage.search("typescript");
  
  const resultsCount = await homePage.getResultsCount();
  expect(resultsCount).toBeGreaterThan(0);
});
```

### Example 2: Complex Page Object with Forms

```typescript
// e2e/pages/ApplicationFormPage.ts
import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export class ApplicationFormPage extends BasePage {
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly emailField: Locator;
  private readonly phoneField: Locator;
  private readonly messageField: Locator;
  private readonly submitButton: Locator;
  private readonly successMessage: Locator;
  private readonly errorMessages: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameField = page.locator('input[name="firstName"]');
    this.lastNameField = page.locator('input[name="lastName"]');
    this.emailField = page.locator('input[name="email"]');
    this.phoneField = page.locator('input[name="phone"]');
    this.messageField = page.locator('textarea[name="message"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.successMessage = page.locator('[role="alert"].success');
    this.errorMessages = page.locator('[role="alert"].error');
  }

  async navigate(jobId: number): Promise<void> {
    await this.goto(`/jobs/${jobId}/apply`);
  }

  async fillApplicationForm(data: ApplicationData): Promise<void> {
    await this.fillField(this.firstNameField, data.firstName);
    await this.fillField(this.lastNameField, data.lastName);
    await this.fillField(this.emailField, data.email);
    await this.fillField(this.phoneField, data.phone);
    await this.fillField(this.messageField, data.message);
  }

  async submitForm(): Promise<void> {
    await this.clickElement(this.submitButton);
    await this.waitForPageLoad();
  }

  async submitApplication(data: ApplicationData): Promise<void> {
    await this.fillApplicationForm(data);
    await this.submitForm();
  }

  async isSuccessDisplayed(): Promise<boolean> {
    return await this.isVisible(this.successMessage);
  }

  async getErrorCount(): Promise<number> {
    return await this.errorMessages.count();
  }

  async verifyPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.firstNameField);
  }
}
```

**Usage:**
```typescript
test("should submit application successfully", async ({ page }) => {
  const applicationPage = new ApplicationFormPage(page);
  await applicationPage.navigate(1);

  const testData: ApplicationData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+44 7700 900000",
    message: "I am very interested in this position..."
  };

  await applicationPage.submitApplication(testData);
  
  const isSuccess = await applicationPage.isSuccessDisplayed();
  expect(isSuccess).toBe(true);
});
```

---

## Best Practices

### 1. One Page Object Per Page
Each page object should represent one logical page or section.

```typescript
✅ LoginPage (login page)
✅ JobRolesListPage (job listing page)
✅ JobApplicationPage (application form)

❌ UserPage (mixing multiple pages)
❌ MegaPage (everything in one class)
```

### 2. Private Locators, Public Methods
Hide implementation, expose interface.

```typescript
export class MyPage extends BasePage {
  // Private - implementation detail
  private readonly myButton: Locator;

  // Public - part of the interface
  async doSomething(): Promise<void> {
    await this.clickElement(this.myButton);
  }
}
```

### 3. Descriptive Method Names
Methods should reflect user actions, not HTML details.

```typescript
✅ async login(email: string, password: string): Promise<void>
✅ async goToRegister(): Promise<void>
✅ async isErrorDisplayed(): Promise<boolean>

❌ async fillEmailAndClickSubmit(): Promise<void>
❌ async clickLoginButton(): Promise<void>
❌ async checkForErrorDiv(): Promise<boolean>
```

### 4. Use Test Data Fixtures
Store test data in fixtures, not hardcoded in tests.

```typescript
// ✅ GOOD: Using fixtures
import { testUsers } from "../fixtures/testData";
await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);

// ❌ BAD: Hardcoded values
await loginPage.login("test@example.com", "password123");
```

### 5. Meaningful Assertions
Assertions should be clear about what's being tested.

```typescript
✅ expect(loginPage["page"].url()).not.toContain("/login");
✅ expect(await applicationPage.isSuccessDisplayed()).toBe(true);

❌ expect(true).toBe(true);
❌ expect(result).toBeTruthy();
```

### 6. Handle Waits in Page Objects
Hide wait logic from tests.

```typescript
// Inside page object
async submitForm(): Promise<void> {
  await this.clickElement(this.submitButton);
  await this.waitForPageLoad();  // ← Hidden in page object
}

// In tests (simple and clear)
await applicationPage.submitForm();
```

### 7. Group Related Locators
Organize locators logically.

```typescript
export class ApplicationFormPage extends BasePage {
  // Form fields
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly emailField: Locator;

  // Buttons
  private readonly submitButton: Locator;
  private readonly cancelButton: Locator;

  // Feedback
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;
}
```

---

## Common Mistakes

### ❌ Mistake 1: Tests Using Playwright Directly

```typescript
// ❌ WRONG: Selectors hardcoded in test
test("should login", async ({ page }) => {
  await page.locator('input[name="email"]').fill("user@test.com");
  await page.locator('input[name="password"]').fill("password");
  await page.locator('button[type="submit"]').click();
});

// ✅ RIGHT: Use page object
test("should login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login("user@test.com", "password");
});
```

### ❌ Mistake 2: Page Objects Doing Too Much

```typescript
// ❌ WRONG: Page object mixing multiple pages
export class MegaPage extends BasePage {
  async login() { }
  async register() { }
  async searchJobs() { }
  async applyJob() { }
  async viewProfile() { }
  async editProfile() { }
  // ... 20 more methods
}

// ✅ RIGHT: Separate page objects
export class LoginPage extends BasePage { async login() { } }
export class RegisterPage extends BasePage { async register() { } }
export class JobSearchPage extends BasePage { async searchJobs() { } }
export class ApplicationPage extends BasePage { async applyJob() { } }
```

### ❌ Mistake 3: Public Locators

```typescript
// ❌ WRONG: Exposing locators
export class LoginPage extends BasePage {
  public readonly emailInput: Locator;  // ← Can be accessed directly
  public readonly passwordInput: Locator;

  // Tests can now do this (bad!)
  // await page.emailInput.fill("...");
}

// ✅ RIGHT: Private locators
export class LoginPage extends BasePage {
  private readonly emailInput: Locator;  // ← Hidden
  private readonly passwordInput: Locator;

  async login(email: string, password: string) { }  // ← Use this instead
}
```

### ❌ Mistake 4: Overly Specific Locators

```typescript
// ❌ WRONG: Fragile selectors
private readonly emailInput: Locator = 
  page.locator('div.container div.form div.field input[type="email"]');

// ✅ RIGHT: Specific and stable
private readonly emailInput: Locator = 
  page.locator('input[name="email"]');
```

### ❌ Mistake 5: No Wait Handling

```typescript
// ❌ WRONG: No waits, tests fail randomly
async submitForm(): Promise<void> {
  await this.clickElement(this.submitButton);
}

// ✅ RIGHT: Proper waits
async submitForm(): Promise<void> {
  await this.clickElement(this.submitButton);
  await this.waitForPageLoad();
}
```

### ❌ Mistake 6: Hardcoded Test Data

```typescript
// ❌ WRONG: Hardcoded values
test("should login", async () => {
  await loginPage.login("test@example.com", "Test123!");
});

// ✅ RIGHT: Use fixtures
test("should login", async () => {
  await loginPage.login(
    testUsers.validUser.email,
    testUsers.validUser.password
  );
});
```

---

## Summary

| Aspect | Benefit |
|--------|---------|
| **Maintainability** | One selector change → one location to update |
| **Readability** | Tests read like business scenarios, not code |
| **Reusability** | Same methods used across all tests |
| **Scalability** | Easy to add new tests without duplication |
| **Reliability** | Fewer brittle tests, easier to debug failures |
| **Team Collaboration** | Clear separation of concerns |

### Remember
> **POM is about creating a clear boundary between test logic and implementation details.**
> 
> Tests should focus on **what** to test, not **how** to interact with the UI.

---

## Further Reading

- [Selenium POM Best Practices](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Design Patterns in Testing](https://martinfowler.com/bliki/PageObject.html)
