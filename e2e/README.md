# E2E Test Framework Documentation

## Overview
This is a Playwright-based end-to-end testing framework for the Job Application system. It uses TypeScript and follows the Page Object Model (POM) design pattern for maintainable and scalable tests.

## 📚 What is Page Object Model (POM)?

### Definition
The **Page Object Model** is a design pattern in test automation that creates an object-oriented representation of web pages. Instead of scattering page elements and interactions throughout test files, POM encapsulates them in dedicated page classes.

### Why POM?

#### Problems Without POM (❌ Anti-pattern)
```typescript
// ❌ BAD: Selectors scattered throughout tests
test("should login", async ({ page }) => {
  await page.locator('input[name="email"]').fill("user@test.com");
  await page.locator('input[name="password"]').fill("password123");
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(1000);
});

test("should logout", async ({ page }) => {
  await page.locator('input[name="email"]').fill("user@test.com");  // Duplicated!
  await page.locator('input[name="password"]').fill("password123"); // Duplicated!
  // More tests with duplicated selectors...
});
```

**Issues:**
- Selectors duplicated across many tests
- One selector change breaks all tests using it
- Tests are hard to read and understand
- Logic mixed with test framework code
- Difficult to reuse common workflows

#### Benefits With POM (✅ Best Practice)
```typescript
// ✅ GOOD: Encapsulated page logic
const loginPage = new LoginPage(page);
await loginPage.login("user@test.com", "password123");
```

**Benefits:**
- **Maintainability**: Change selector in one place → all tests updated
- **Readability**: Tests read like English, not code
- **Reusability**: Use same page methods across multiple tests
- **Scalability**: Easy to add new features
- **Abstraction**: Tests don't need to know HTML structure

### POM Core Concepts

#### 1. **Encapsulation**
Hide implementation details (HTML selectors) inside page classes.

```typescript
// What tests see (simple, clear)
await loginPage.login(email, password);

// What's hidden inside LoginPage (complex selectors)
private readonly emailInput = page.locator('input[name="email"]');
private readonly passwordInput = page.locator('input[name="password"]');
```

#### 2. **Page Methods (Actions)**
Methods that represent user actions on the page.

```typescript
// User-friendly method names matching real actions
async login(email: string, password: string): Promise<void>
async goToRegister(): Promise<void>
async isErrorDisplayed(): Promise<boolean>
```

#### 3. **Locators (Selectors)**
Elements on the page defined once, reused everywhere.

```typescript
private readonly emailInput: Locator = page.locator('input[name="email"]');
private readonly loginButton: Locator = page.locator('button[type="submit"]');
```

#### 4. **Verification Methods**
Methods to verify page state and conditions.

```typescript
async verifyPageLoaded(): Promise<boolean>
async getErrorMessage(): Promise<string | null>
async isVisible(element: Locator): Promise<boolean>
```

## Framework Structure

```
e2e/
├── fixtures/          # Test data and fixtures
│   ├── files/        # Test files (CVs, documents)
│   └── testData.ts   # Reusable test data
├── pages/            # Page Object Models
│   ├── BasePage.ts           # Base class for all pages
│   ├── LoginPage.ts          # Login page POM
│   ├── JobRolesListPage.ts   # Job roles listing POM
│   └── JobApplicationPage.ts # Application form POM
└── tests/            # Test specifications
    ├── login.spec.ts
    ├── jobRolesList.spec.ts
    └── jobApplication.spec.ts
```

## Architecture

### BasePage (Foundation Layer)
The base class that all page objects inherit from. Provides common functionality.

```typescript
export class BasePage {
  protected page: Page;
  
  async goto(path: string): Promise<void>           // Navigate to page
  async waitForPageLoad(): Promise<void>            // Wait for DOM
  async fillField(locator: Locator, value: string)  // Fill input
  async clickElement(locator: Locator): Promise<void>
  async isVisible(locator: Locator): Promise<boolean>
  // ... more common methods
}
```

### Page Objects (Feature Layer)
Specific pages extending BasePage with their own locators and methods.

```typescript
export class LoginPage extends BasePage {
  private emailInput: Locator
  private passwordInput: Locator
  private loginButton: Locator
  
  async navigate(): Promise<void>
  async login(email: string, password: string): Promise<void>
  async isErrorDisplayed(): Promise<boolean>
}
```

### Tests (Test Layer)
Use page objects to write clear, maintainable tests.

```typescript
test("should login successfully", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login("user@test.com", "password");
  // Verify...
});
```

## POM Implementation Guide

### Step 1: Create BasePage
All pages extend this base class for common functionality.

```typescript
// e2e/pages/BasePage.ts
import type { Page, Locator } from "@playwright/test";

export class BasePage {
  protected page: Page;
  protected baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = "http://localhost:3000";
  }

  async goto(path: string = ""): Promise<void> {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  async fillField(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }
}
```

### Step 2: Create Specific Page Objects
Extend BasePage and add page-specific locators and methods.

```typescript
// e2e/pages/LoginPage.ts
import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  // Locators defined once, reused everywhere
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
  }

  // Page-specific actions
  async navigate(): Promise<void> {
    await this.goto("/login");
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillField(this.emailInput, email);
    await this.fillField(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  // Verification methods
  async verifyPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.emailInput);
  }
}
```

### Step 3: Write Tests Using Page Objects
Tests become simple, readable, and maintainable.

```typescript
// e2e/tests/login.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { testUsers } from "../fixtures/testData";

test.describe("Login Form Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test("should login successfully", async () => {
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    expect(loginPage["page"].url()).not.toContain("/login");
  });

  test("should show error for invalid email", async () => {
    await loginPage.login("invalid-email", testUsers.validUser.password);
    // Page should remain on login
  });
});
```

## Key Components Explained

### 1. **Page Objects** (e2e/pages/)
Define the interface to a page or part of a page:
- Store locators as private properties
- Provide public methods for user interactions
- Hide implementation details

**Example: LoginPage**
```typescript
export class LoginPage extends BasePage {
  private readonly emailInput: Locator;      // Hidden selector
  private readonly loginButton: Locator;     // Hidden selector
  
  // Public method that tests use
  async login(email: string, password: string): Promise<void> {
    await this.fillField(this.emailInput, email);
    await this.clickElement(this.loginButton);
  }
}
```

### 2. **Test Fixtures** (e2e/fixtures/)
Centralized test data for reuse across tests:
```typescript
export const testUsers = {
  validUser: { email: "test@example.com", password: "Test123!" },
  adminUser: { email: "admin@example.com", password: "Admin123!" }
};
```

Tests use fixtures instead of hardcoding:
```typescript
// ✅ GOOD: Using fixtures
await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);

// ❌ BAD: Hardcoded values
await loginPage.login("test@example.com", "Test123!");
```

### 3. **Test Specs** (e2e/tests/)
The actual test files that use page objects:
```typescript
test.describe("Login Tests", () => {
  test("should login successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
  });
});
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests with UI mode (recommended for development)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
npm run test:e2e -- e2e/tests/login.spec.ts
```

### Run tests in Chrome only
```bash
npm run test:e2e:chrome
```

### View test report
```bash
npm run test:e2e:report
```

## Writing New Tests

### 1. Create a new Page Object

```typescript
// e2e/pages/MyNewPage.ts
import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MyNewPage extends BasePage {
  private readonly myElement: Locator;

  constructor(page: Page) {
    super(page);
    this.myElement = page.locator("#my-element");
  }

  async navigate(): Promise<void> {
    await this.goto("/my-path");
  }

  async doSomething(): Promise<void> {
    await this.clickElement(this.myElement);
  }
}
```

### 2. Create a Test Spec

```typescript
// e2e/tests/myNewFeature.spec.ts
import { test, expect } from "@playwright/test";
import { MyNewPage } from "../pages/MyNewPage";

test.describe("My New Feature", () => {
  let myPage: MyNewPage;

  test.beforeEach(async ({ page }) => {
    myPage = new MyNewPage(page);
    await myPage.navigate();
  });

  test("should do something", async () => {
    await myPage.doSomething();
    expect(true).toBe(true);
  });
});
```

## Best Practices

### 1. Use Page Objects
❌ Don't write selectors directly in tests
```typescript
await page.locator("#login-button").click();
```

✅ Use page object methods
```typescript
await loginPage.clickLoginButton();
```

### 2. Use Test Data Fixtures
❌ Don't hardcode test data
```typescript
await loginPage.login("test@example.com", "password123");
```

✅ Use fixtures
```typescript
await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
```

### 3. Wait Appropriately
❌ Don't use arbitrary waits
```typescript
await page.waitForTimeout(3000);
```

✅ Wait for specific conditions
```typescript
await page.waitForLoadState("domcontentloaded");
await loginPage.waitForElement(myElement);
```

### 4. Write Descriptive Test Names
```typescript
test("should show error message when submitting form with invalid email", async () => {
  // test code
});
```

### 5. Use beforeEach for Setup
```typescript
test.beforeEach(async ({ page }) => {
  // Common setup for all tests
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
});
```

### 6. Single Responsibility
Each page object should represent one page or logical section:
```typescript
✅ LoginPage (handles login page only)
✅ JobRolesListPage (handles job roles list)
✅ JobApplicationPage (handles application form)

❌ Don't create a MegaPage with everything
```

### 7. Private Locators, Public Methods
```typescript
export class MyPage extends BasePage {
  // Keep locators private - they're implementation details
  private readonly myElement: Locator;
  
  // Expose public methods that represent user actions
  public async doSomething(): Promise<void> {
    await this.clickElement(this.myElement);
  }
}
```

## Configuration

### Playwright Config (`playwright.config.ts`)
- **Base URL**: `http://localhost:3000`
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Browser**: Chromium (Chrome) by default
- **Reports**: HTML report, List, JSON

### Adjusting Configuration
Edit `playwright.config.ts` to:
- Change base URL
- Add more browsers (Firefox, WebKit)
- Modify timeouts
- Enable/disable video recording
- Configure mobile viewports

## Debugging Tests

### Method 1: UI Mode
```bash
npm run test:e2e:ui
```
- Interactive test runner
- Time-travel debugging
- See each step
- Inspect locators

### Method 2: Debug Mode
```bash
npm run test:e2e:debug
```
- Opens Playwright Inspector
- Step through tests
- Pause and inspect

### Method 3: Headed Mode
```bash
npm run test:e2e:headed
```
- See browser window
- Watch tests execute
- Useful for understanding failures

## CI/CD Integration

The framework is CI-ready:
- Automatic server startup with `webServer` config
- Retry mechanism for flaky tests
- Multiple report formats
- Screenshots and videos on failure

### Example GitHub Actions

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers
  run: npx playwright install --with-deps chromium

- name: Run E2E Tests
  run: npm run test:e2e

- name: Upload test report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Troubleshooting

### Tests can't find elements
- Check if selectors match your HTML
- Use Playwright Inspector to find correct selectors
- Ensure page is fully loaded before interaction

### Tests timeout
- Increase timeout in config
- Check if server is running properly
- Verify network conditions

### File upload fails
- Ensure file path is correct and relative to project root
| **Team Collaboration** | Confusing | Clear responsibilities |

## 📋 POM Implementation Status

### ✅ Completed Page Objects

#### **LoginPage** (`pages/LoginPage.ts`)
A comprehensive Page Object for the login page with:
- **Form Fields**: Email and password inputs
- **Actions**: Login, fill individual fields, clear fields, toggle remember me
- **Navigation**: Go to register, forgot password
- **Validation**: Error/success message handling, field validation
- **State Checks**: Login button enabled, form loading state
- **Methods**: 25+ methods for complete test coverage

**Key Methods:**
```typescript
await loginPage.navigate()
await loginPage.login(email, password)
await loginPage.fillEmail(email)
await loginPage.getErrorMessage()
await loginPage.isRememberMeChecked()
await loginPage.goToRegister()
```

#### **JobRolesListPage** (`pages/JobRolesListPage.ts`)
Comprehensive POM for job roles listing page with:
- **Display**: Get job roles count, retrieve all titles, get detailed info
- **Search**: Search by keyword, clear search
- **Filtering**: Filter by capability, clear filters
- **Pagination**: Navigate between pages, check pagination state
- **Empty States**: Detect and retrieve empty state messages
- **Methods**: 20+ methods for comprehensive testing

**Key Methods:**
```typescript
await jobRolesPage.navigate()
await jobRolesPage.getJobRolesCount()
await jobRolesPage.searchJobRoles(term)
await jobRolesPage.filterByCapability(capability)
await jobRolesPage.clickApplyForJobRoleByTitle(title)
await jobRolesPage.goToNextPage()
```

#### **JobApplicationPage** (`pages/JobApplicationPage.ts`)
Complete POM for job application form with:
- **Form Fields**: Name, email, phone, CV upload, cover letter
- **Form Actions**: Fill form, upload file, submit, reset
- **Validation**: Get validation errors, check required fields
- **Status**: Success/error message handling, loading state
- **Field Operations**: Get/clear individual fields, check visibility
- **Methods**: 25+ methods for form testing

**Key Methods:**
```typescript
await applicationPage.navigate(jobRoleId)
await applicationPage.fillApplicationForm(data)
await applicationPage.uploadCV(filePath)
await applicationPage.submitApplication()
await applicationPage.getErrorMessage()
await applicationPage.isSuccessDisplayed()
```

### ✅ Test Files with POM

#### **login.spec.ts**
Enhanced test suite with 20+ test cases organized into describe blocks:
- **Page Load & Display**: Title, form visibility, initial button state
- **Valid Credentials**: Successful login, navigation
- **Empty Fields**: Email, password, both fields
- **Email Format**: Invalid formats, missing domain, spaces
- **Invalid Credentials**: Non-existent user, error handling
- **Form Navigation**: Register link visibility and navigation
- **Error Messages**: Error display, message content

#### **jobRolesList.spec.ts**
Comprehensive test suite with:
- **Page Load**: Page loading verification
- **Display**: Job roles count and visibility
- **Search**: Search functionality with debounce
- **Filtering**: Filter by capability
- **Pagination**: Navigation between pages
- **Empty States**: Handle no results
- **Apply Buttons**: Apply button availability

#### **jobApplication.spec.ts**
Application form tests including:
- Form loading and visibility
- Valid application submission
- Minimal required fields
- Invalid field handling
- File upload validation
- Success/error message handling

### 🔧 Base Page (`pages/BasePage.ts`)
Foundation class providing:
- Navigation (`goto`, `waitForPageLoad`)
- Element Interactions (`fillField`, `clickElement`, `selectOption`)
- Visibility & Content (`isVisible`, `getTextContent`, `waitForElement`)
- File Operations (`uploadFile`)
- Utilities (`takeScreenshot`, `getTitle`)

All page objects extend BasePage and use its consistent API.

### 📊 Test Data (`fixtures/testData.ts`)
Centralized test data including:
- Valid and invalid user credentials
- Application test data (valid, minimal, invalid)
- Test file paths
- Test URLs
- Job role test data

## 🚀 Next Steps

1. **Run Full Test Suite**
   ```bash
   npx playwright test
   ```

2. **Run Specific Test File**
   ```bash
   npx playwright test e2e/tests/login.spec.ts
   ```

3. **Run Tests in UI Mode**
   ```bash
   npx playwright test --ui
   ```

4. **Generate HTML Report**
   ```bash
   npx playwright test && npx playwright show-report
   ```

5. **Extend with More Tests**
   - Add registration page tests
   - Add user profile tests
   - Add admin functionality tests
   - Add error recovery tests

## Summary: Why POM Matters

| Aspect | Without POM | With POM |
|--------|-------------|----------|
| **Maintainability** | Hard - change selector → update all tests | Easy - change in one page object |
| **Readability** | Complex - full of selectors | Clear - reads like English |
| **Reusability** | Low - code duplication | High - share methods across tests |
| **Scalability** | Hard to grow | Easy to add new tests |
| **Debugging** | Difficult - scattered logic | Easy - logic encapsulated |
| **Team Collaboration** | Confusing | Clear responsibilities |

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)

