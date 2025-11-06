# POM Quick Reference

## One-Minute Explanation

**Page Object Model (POM)** encapsulates web page interactions into reusable classes.

### Without POM (❌ Bad)
```typescript
// Selectors repeated everywhere
await page.locator('input[name="email"]').fill("test@example.com");
await page.locator('button[type="submit"]').click();
```

### With POM (✅ Good)
```typescript
const loginPage = new LoginPage(page);
await loginPage.login("test@example.com", "password");
```

---

## Basic Structure

```typescript
import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MyPage extends BasePage {
  // 1. Private locators (hidden from tests)
  private readonly emailInput: Locator;
  private readonly submitButton: Locator;

  // 2. Constructor - initialize locators
  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  // 3. Public methods (what tests use)
  async navigate(): Promise<void> {
    await this.goto("/path");
  }

  async doSomething(value: string): Promise<void> {
    await this.fillField(this.emailInput, value);
    await this.clickElement(this.submitButton);
  }

  // 4. Verification methods
  async isLoaded(): Promise<boolean> {
    return await this.isVisible(this.emailInput);
  }
}
```

---

## Test Structure

```typescript
import { test, expect } from "@playwright/test";
import { MyPage } from "../pages/MyPage";
import { testData } from "../fixtures/testData";

test.describe("Feature Tests", () => {
  let myPage: MyPage;

  // Setup - runs before each test
  test.beforeEach(async ({ page }) => {
    myPage = new MyPage(page);
    await myPage.navigate();
  });

  // Simple test using page object
  test("should do something", async () => {
    await myPage.doSomething(testData.value);
    
    const isLoaded = await myPage.isLoaded();
    expect(isLoaded).toBe(true);
  });
});
```

---

## Common Page Object Methods

### From BasePage (Available to All Pages)

```typescript
// Navigation
await page.goto(path)
await page.waitForPageLoad()

// Element Interactions
await page.fillField(locator, value)
await page.clickElement(locator)
await page.selectOption(locator, value)
await page.uploadFile(locator, filePath)

// Verification
await page.isVisible(locator): boolean
await page.getTextContent(locator): string | null

// Utils
await page.waitForElement(locator)
await page.takeScreenshot(name)
await page.getTitle(): string
```

### Create in Your Page Object

```typescript
// Navigation
async navigate(): Promise<void>

// Actions
async doSomething(): Promise<void>
async fillForm(data: FormData): Promise<void>

// Verification
async isLoaded(): Promise<boolean>
async getErrorMessage(): Promise<string | null>
```

---

## Naming Conventions

### ✅ Good Names
- `async login(email, password)` - User action
- `async goToRegister()` - Navigation
- `async isErrorDisplayed()` - Verification
- `async fillApplicationForm(data)` - Complex action

### ❌ Bad Names
- `async fillEmailAndClickSubmit()` - Too specific
- `async clickLoginButton()` - Says HOW, not WHAT
- `async checkError()` - Unclear
- `async handleForm()` - Too vague

---

## Locator Strategies

### Finding Elements

```typescript
// By name
page.locator('input[name="email"]')

// By type
page.locator('input[type="password"]')

// By id
page.locator('#loginForm')

// By class
page.locator('.btn-primary')

// By test id (recommended)
page.locator('[data-testid="submit-btn"]')

// By text
page.locator('button:has-text("Login")')

// By role (accessible)
page.locator('button[role="submit"]')
```

### Best Practices for Selectors

| Strategy | Pros | Cons |
|----------|------|------|
| `[data-testid="..."]` | Stable, explicit | Requires HTML changes |
| `[name="..."]` | Stable, semantic | Limited use |
| `.class` | Fast | Can change |
| `#id` | Unique | Can change |
| Text matching | Accessible | Fragile (UI changes) |

---

## Common Patterns

### Login Page Pattern

```typescript
export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async navigate(): Promise<void> {
    await this.goto("/login");
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillField(this.emailInput, email);
    await this.fillField(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async verifyPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.emailInput);
  }
}
```

### Form Page Pattern

```typescript
export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

export class FormPage extends BasePage {
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly emailField: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameField = page.locator('input[name="firstName"]');
    this.lastNameField = page.locator('input[name="lastName"]');
    this.emailField = page.locator('input[name="email"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async fillForm(data: FormData): Promise<void> {
    await this.fillField(this.firstNameField, data.firstName);
    await this.fillField(this.lastNameField, data.lastName);
    await this.fillField(this.emailField, data.email);
  }

  async submit(): Promise<void> {
    await this.clickElement(this.submitButton);
    await this.waitForPageLoad();
  }
}
```

### List/Table Page Pattern

```typescript
export class ListPage extends BasePage {
  private readonly tableRows: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.tableRows = page.locator('tbody tr');
    this.searchInput = page.locator('input[placeholder="Search"]');
    this.searchButton = page.locator('button[aria-label="Search"]');
  }

  async search(term: string): Promise<void> {
    await this.fillField(this.searchInput, term);
    await this.clickElement(this.searchButton);
    await this.waitForPageLoad();
  }

  async getRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async getFirstRowText(): Promise<string | null> {
    const firstRow = this.tableRows.first();
    return await this.getTextContent(firstRow);
  }
}
```

---

## Testing Patterns

### Basic Test

```typescript
test("should do something", async ({ page }) => {
  const myPage = new MyPage(page);
  
  // Arrange
  await myPage.navigate();
  
  // Act
  await myPage.doSomething();
  
  // Assert
  const result = await myPage.getResult();
  expect(result).toBe(expected);
});
```

### With Fixtures

```typescript
test("should login with valid user", async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigate();
  await loginPage.login(
    testUsers.validUser.email,
    testUsers.validUser.password
  );
  
  expect(page.url()).not.toContain("/login");
});
```

### Multiple Pages

```typescript
test("should complete user journey", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
  
  const isLoaded = await dashboardPage.verifyPageLoaded();
  expect(isLoaded).toBe(true);
});
```

---

## Tips & Tricks

### 1. Use `beforeEach` for Common Setup
```typescript
test.beforeEach(async ({ page }) => {
  myPage = new MyPage(page);
  await myPage.navigate();
});
```

### 2. Store Data in Fixtures
```typescript
// fixtures/testData.ts
export const testUsers = {
  validUser: { email: "test@example.com", password: "Test123!" },
};

// In tests
await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
```

### 3. Chain Methods for Readability
```typescript
// Method chaining
async fillAndSubmit(data: FormData): Promise<void> {
  await this.fillForm(data);
  await this.submit();
}
```

### 4. Use Descriptive Variable Names
```typescript
const isErrorShown = await myPage.isErrorDisplayed();
expect(isErrorShown).toBe(true);
```

### 5. Separate Concerns
```typescript
// Navigation in navigate()
async navigate(): Promise<void> { }

// Interaction in action methods
async doSomething(): Promise<void> { }

// Verification in check methods
async isLoaded(): Promise<boolean> { }
```

---

## Anti-Patterns to Avoid

### ❌ Don't Mix Playwright in Tests
```typescript
// Bad
test("should login", async ({ page }) => {
  await page.locator('input').fill("test@example.com");
  await page.locator('button').click();
});

// Good
test("should login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login("test@example.com", "password");
});
```

### ❌ Don't Expose Internal Details
```typescript
// Bad - exposing locators
public emailInput: Locator;

// Good - private locators
private readonly emailInput: Locator;
```

### ❌ Don't Put Multiple Pages in One Object
```typescript
// Bad
export class MegaPage {
  async login() { }
  async applyJob() { }
  async viewProfile() { }
}

// Good
export class LoginPage { async login() { } }
export class ApplicationPage { async applyJob() { } }
export class ProfilePage { async viewProfile() { } }
```

### ❌ Don't Hardcode Test Data
```typescript
// Bad
await loginPage.login("test@example.com", "Test123!");

// Good
await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
```

---

## Debugging

### Run in UI Mode
```bash
npm run test:e2e:ui
```

### Run in Debug Mode
```bash
npm run test:e2e:debug
```

### Run in Headed Mode
```bash
npm run test:e2e:headed
```

### View Report
```bash
npm run test:e2e:report
```

---

## Key Takeaways

1. **Encapsulation**: Hide selectors, expose methods
2. **Reusability**: Define once, use everywhere
3. **Clarity**: Tests should read like English
4. **Maintainability**: Change selectors in one place
5. **Scalability**: Easy to add new tests
6. **Separation**: Tests ≠ Implementation
