# Quick Start: Using the POM Framework

## For Test Developers

### 1. Basic Test Structure

```typescript
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { testData } from "../fixtures/testData";

test.describe("Feature Name", () => {
  let page: LoginPage;

  test.beforeEach(async ({ page: playwrightPage }) => {
    page = new LoginPage(playwrightPage);
    await page.navigate();
  });

  test("should do something", async () => {
    // Arrange: Set up test data
    const testUser = testData.validUser;

    // Act: Perform actions using page object
    await page.login(testUser.email, testUser.password);
    
    // Assert: Verify results
    const isLoaded = await page.verifyPageLoaded();
    expect(isLoaded).toBe(true);
  });
});
```

### 2. Creating a New Page Object

```typescript
import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MyPage extends BasePage {
  // 1. Define private locators
  private readonly element1: Locator;
  private readonly element2: Locator;

  // 2. Initialize in constructor
  constructor(page: Page) {
    super(page);
    this.element1 = page.locator("selector1");
    this.element2 = page.locator("selector2");
  }

  // 3. Create public methods
  async navigate(): Promise<void> {
    await this.goto("/path");
    await this.waitForPageLoad();
  }

  async doSomething(): Promise<void> {
    await this.clickElement(this.element1);
    await this.fillField(this.element2, "value");
  }

  async verifyPageLoaded(): Promise<boolean> {
    await this.waitForElement(this.element1);
    return true;
  }
}
```

### 3. Available Page Objects

#### LoginPage
```typescript
const loginPage = new LoginPage(page);

await loginPage.navigate();
await loginPage.login(email, password);
await loginPage.fillEmail(email);
await loginPage.fillPassword(password);
await loginPage.clickLoginButton();
await loginPage.goToRegister();
await loginPage.getErrorMessage();
await loginPage.isErrorDisplayed();
await loginPage.isLoginButtonEnabled();
```

#### JobRolesListPage
```typescript
const jobRoles = new JobRolesListPage(page);

await jobRoles.navigate();
await jobRoles.getJobRolesCount();
await jobRoles.getAllJobRoleTitles();
await jobRoles.searchJobRoles("Software");
await jobRoles.filterByCapability("Engineering");
await jobRoles.clickApplyForJobRole(0);
await jobRoles.clickApplyForJobRoleByTitle("Engineer");
await jobRoles.goToNextPage();
await jobRoles.goToPreviousPage();
```

#### JobApplicationPage
```typescript
const appPage = new JobApplicationPage(page);

await appPage.navigate(jobRoleId);
await appPage.fillApplicationForm(data);
await appPage.fillName("John Doe");
await appPage.fillEmail("john@example.com");
await appPage.uploadCV("./path/to/cv.pdf");
await appPage.submitApplication();
await appPage.isSuccessDisplayed();
await appPage.getErrorMessage();
await appPage.completeApplication(data, cvPath);
```

### 4. Using BasePage Methods

All page objects inherit these methods:

```typescript
// Navigation
await page.goto("/path");
await page.waitForPageLoad();

// Interaction
await page.fillField(locator, "value");
await page.clickElement(locator);
await page.selectOption(locator, "value");
await page.uploadFile(locator, "path/file");

// Verification
await page.isVisible(locator);
await page.getTextContent(locator);
await page.waitForElement(locator);

// Utilities
await page.getTitle();
await page.takeScreenshot("name");
```

### 5. Test Data Usage

```typescript
import { testUsers, testApplications, testFiles } from "../fixtures/testData";

// Valid user
await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);

// Invalid user
await loginPage.login(testUsers.invalidUser.email, testUsers.invalidUser.password);

// Application data
await appPage.fillApplicationForm(testApplications.validApplication);

// File paths
await appPage.uploadCV(testFiles.validCV);
```

### 6. Common Test Patterns

#### Testing Error Handling
```typescript
test("should show error on invalid input", async () => {
  await loginPage.navigate();
  await loginPage.login("invalid@", "password");
  
  const hasError = await loginPage.isErrorDisplayed();
  const errorMsg = await loginPage.getErrorMessage();
  
  expect(hasError).toBe(true);
  expect(errorMsg).toBeTruthy();
});
```

#### Testing Form Submission
```typescript
test("should submit form successfully", async () => {
  await appPage.navigate(jobRoleId);
  await appPage.fillApplicationForm(testApplications.validApplication);
  await appPage.uploadCV(testFiles.validCV);
  await appPage.submitApplication();
  
  await appPage.waitForLoadingComplete();
  const isSuccess = await appPage.isSuccessDisplayed();
  
  expect(isSuccess).toBe(true);
});
```

#### Testing Navigation
```typescript
test("should navigate to register page", async () => {
  await loginPage.navigate();
  await loginPage.goToRegister();
  
  const url = loginPage["page"].url();
  expect(url).toContain("/register");
});
```

#### Testing Search/Filter
```typescript
test("should filter job roles", async () => {
  await jobRoles.navigate();
  
  const countBefore = await jobRoles.getJobRolesCount();
  
  await jobRoles.searchJobRoles("Software");
  await jobRoles.waitForPageLoad();
  
  const countAfter = await jobRoles.getJobRolesCount();
  
  expect(countAfter).toBeLessThanOrEqual(countBefore);
});
```

#### Testing Pagination
```typescript
test("should navigate through pages", async ({ page }) => {
  await jobRoles.navigate();
  
  const url1 = page.url();
  
  await jobRoles.goToNextPage();
  const url2 = page.url();
  
  expect(url1).not.toBe(url2);
});
```

### 7. Naming Conventions

**✅ Good Method Names:**
- `async login(email, password)`
- `async fillApplicationForm(data)`
- `async clickApplyForJobRole(index)`
- `async isErrorDisplayed()`
- `async getErrorMessage()`
- `async goToNextPage()`

**❌ Avoid:**
- `async performLogin()` - Too vague
- `async clickLoginButton()` - Says HOW not WHAT
- `async validateForm()` - Unclear action
- `async e()` - Not descriptive

### 8. Locator Strategies

```typescript
// By name attribute
private readonly emailInput = page.locator('input[name="email"]');

// By type
private readonly submitButton = page.locator('button[type="submit"]');

// By text content
private readonly registerLink = page.locator('text=/sign up|register/i');

// By CSS class
private readonly errorBox = page.locator('.alert-error');

// By ARIA role
private readonly heading = page.locator('[role="heading"]');

// By href
private readonly link = page.locator('a[href="/register"]');

// Combination (most flexible)
private readonly input = page.locator('input[name="email"][type="text"]');
```

### 9. Running Tests

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test e2e/tests/login.spec.ts

# Run specific test
npx playwright test --grep "should login"

# Run in UI mode (interactive)
npx playwright test --ui

# Run with debug
npx playwright test --debug

# Generate report
npx playwright test && npx playwright show-report

# Run with specific browser
npx playwright test --project=chromium
```

### 10. Debugging Tips

```typescript
// Pause execution
await page.pause();

// Screenshot at specific point
await page.takeScreenshot("debug-point");

// Print element text
console.log(await element.textContent());

// Wait for element with timeout
await page.waitForElement(locator, { timeout: 5000 });

// Check if element exists without throwing
const exists = await locator.isVisible().catch(() => false);
```

## Common Mistakes to Avoid

### ❌ Don't:
- Scatter selectors in test files
- Use hard waits: `await page.waitForTimeout(1000)`
- Test HTML structure instead of functionality
- Skip verification of success/failure
- Duplicate test data

### ✅ Do:
- Encapsulate selectors in page objects
- Use proper wait strategies: `waitForElement()`, `waitForPageLoad()`
- Test user behavior and outcomes
- Always verify test results
- Use centralized test data from fixtures

## Quick Reference

| Task | Method | Example |
|------|--------|---------|
| Navigate | `await page.navigate()` | `await loginPage.navigate()` |
| Fill Input | `await page.fillField()` | `await page.fillEmail("user@example.com")` |
| Click Button | `await page.clickElement()` | `await page.clickLoginButton()` |
| Check Visibility | `await page.isVisible()` | `await page.isErrorDisplayed()` |
| Get Text | `await page.getTextContent()` | `await page.getErrorMessage()` |
| Select Option | `await page.selectOption()` | `await page.filterByCapability("Engineering")` |
| Upload File | `await page.uploadFile()` | `await page.uploadCV("./cv.pdf")` |
| Wait Element | `await page.waitForElement()` | `await page.waitForElement(errorMsg)` |
| Submit Form | `await page.clickElement()` | `await page.submitApplication()` |

---

**Happy Testing! 🎉**

For more details, see `e2e/README.md` and `POM-IMPLEMENTATION-SUMMARY.md`
