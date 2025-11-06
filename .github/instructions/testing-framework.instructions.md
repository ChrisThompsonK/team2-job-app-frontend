---
applyTo: '**'
---

# Testing Framework Instructions

## Overview
This document provides comprehensive best practices and standards for creating tests in the team2-job-app-frontend project. All tests MUST follow these guidelines to ensure consistency, maintainability, and reliable test coverage.

## Testing Stack

### Current Testing Technologies
- **Unit Testing**: Vitest 3.2+ with global test functions
- **E2E Testing**: Playwright with Page Object Model (POM) pattern
- **Coverage Reporting**: V8 coverage with HTML output
- **Assertion Library**: Vitest's built-in `expect`
- **TypeScript**: Full TypeScript support for type-safe tests

## Unit Testing Best Practices (Vitest)

### File Naming and Location
- Test files use `.test.ts` suffix (e.g., `user-controller.test.ts`)
- Test files live alongside source files they test
- One test file per source file (except for complex utilities)
- Pattern: `src/[layer]/[name].test.ts`

### Test Structure

#### Global Functions (No Imports Needed)
```typescript
// ✅ CORRECT: Using global Vitest functions
describe("UserController", () => {
  let controller: UserController;
  let mockService: UserService;

  beforeEach(() => {
    mockService = {
      getUser: vi.fn(),
    };
    controller = new UserController(mockService);
  });

  it("should return user data", async () => {
    // Test implementation
  });
});
```

```typescript
// ❌ WRONG: Importing test functions
import { describe, it, expect, beforeEach } from "vitest";
describe("UserController", () => {
  // Don't do this - use globals
});
```

### Test Naming Conventions
- Use descriptive test names that explain what is being tested
- Start with "should" to describe the expected behavior
- Include context about input and output
- Make tests readable as documentation

```typescript
// ✅ GOOD
describe("JobRoleService", () => {
  it("should return all job roles with empty filters", async () => {});
  it("should filter job roles by department when provided", async () => {});
  it("should throw error when database connection fails", async () => {});
  it("should handle pagination correctly with offset and limit", async () => {});
});

// ❌ POOR
describe("JobRoleService", () => {
  it("works", async () => {});
  it("test get", async () => {});
  it("error handling", async () => {});
});
```

### Test Organization with beforeEach/afterEach

```typescript
describe("ApplicationController", () => {
  let controller: ApplicationController;
  let mockService: ApplicationService;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    // Reset all mocks before each test
    mockService = {
      createApplication: vi.fn(),
      getApplications: vi.fn(),
    };
    
    controller = new ApplicationController(mockService);
    
    // Setup request/response mocks
    mockReq = {
      body: {},
      params: {},
    };
    
    mockRes = {
      render: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create application with valid data", async () => {
    // Test code
  });
});
```

### Mocking Patterns

#### Service Mocking
```typescript
// ✅ CORRECT: Mock service dependencies
const mockJobRoleService: JobRoleService = {
  getJobRoles: vi.fn().mockResolvedValue([
    { id: 1, title: "Engineer", department: "Tech" },
    { id: 2, title: "Designer", department: "Design" },
  ]),
  getJobRoleById: vi.fn(),
  createJobRole: vi.fn(),
};

const controller = new JobRoleController(mockJobRoleService);
```

#### Express Request/Response Mocking
```typescript
// ✅ CORRECT: Mock Express objects
const mockReq = {
  body: { name: "Test", email: "test@example.com" },
  params: { id: "123" },
  query: { page: "1" },
  user: { id: "user123", role: "admin" },
} as Partial<Request>;

const mockRes = {
  render: vi.fn().mockReturnThis(),
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
  send: vi.fn().mockReturnThis(),
} as Partial<Response>;
```

#### Async Function Mocking
```typescript
// ✅ CORRECT: Mock async operations
vi.spyOn(global, "fetch").mockResolvedValue(
  new Response(JSON.stringify({ id: 1, name: "Test" }))
);

// Reset after test
vi.restoreAllMocks();
```

### Test Coverage Requirements

#### Minimum Coverage Standards
- **New Code**: 80% coverage required
- **Controllers**: 100% branch coverage for happy path + error cases
- **Services**: 100% branch coverage including edge cases
- **Utilities**: 100% coverage for all functions
- **Models/Types**: No test coverage required (they're not executable)

#### Coverage Commands
```bash
# Run tests with coverage report
npm run test:coverage

# View HTML coverage report
open coverage/index.html
```

#### Coverage Analysis
- Focus on **branch coverage** (if/else paths), not just line coverage
- Test both success and failure scenarios
- Cover edge cases and boundary conditions
- Aim for >80% overall, but prioritize critical paths

### Happy Path vs Error Case Testing

#### Happy Path (Positive Testing)
```typescript
it("should successfully create a job role", async () => {
  mockJobRoleService.createJobRole.mockResolvedValue({
    id: 1,
    title: "Senior Engineer",
    department: "Engineering",
  });

  const result = await controller.createJobRole(mockReq as Request, mockRes as Response);

  expect(mockJobRoleService.createJobRole).toHaveBeenCalledWith(mockReq.body);
  expect(mockRes.status).toHaveBeenCalledWith(201);
});
```

#### Error Case Testing
```typescript
it("should handle validation error when creating job role", async () => {
  const validationError = new Error("Invalid job role data");
  mockJobRoleService.createJobRole.mockRejectedValue(validationError);

  await controller.createJobRole(mockReq as Request, mockRes as Response);

  expect(mockRes.status).toHaveBeenCalledWith(400);
  expect(mockRes.render).toHaveBeenCalledWith("error.njk", expect.objectContaining({
    message: "Invalid job role data",
  }));
});

it("should handle database error when creating job role", async () => {
  const dbError = new Error("Database connection failed");
  mockJobRoleService.createJobRole.mockRejectedValue(dbError);

  await controller.createJobRole(mockReq as Request, mockRes as Response);

  expect(mockRes.status).toHaveBeenCalledWith(500);
});
```

### Assertion Best Practices

```typescript
// ✅ GOOD: Specific assertions
expect(result).toEqual({ id: 1, name: "Test" });
expect(mockService.getUser).toHaveBeenCalledWith("user123");
expect(mockRes.status).toHaveBeenCalledWith(200);
expect(items).toHaveLength(3);

// ✅ GOOD: Use matchers for flexibility
expect(mockService.createUser).toHaveBeenCalledWith(
  expect.objectContaining({ email: "test@example.com" })
);
expect(result).toEqual(expect.arrayContaining([
  expect.objectContaining({ id: 1 })
]));

// ❌ POOR: Vague assertions
expect(result).toBeTruthy();
expect(error).toBeDefined();
expect(list.length > 0).toBe(true);
```

### Async/Await Testing

```typescript
// ✅ CORRECT: Always await async operations
it("should fetch user data asynchronously", async () => {
  const user = { id: 1, name: "John" };
  mockService.getUser.mockResolvedValue(user);

  const result = await controller.getUser(mockReq as Request, mockRes as Response);

  expect(mockService.getUser).toHaveBeenCalled();
  expect(result).toEqual(user);
});

// ✅ CORRECT: Test promise rejection
it("should handle async errors", async () => {
  mockService.getUser.mockRejectedValue(new Error("Network error"));

  await expect(controller.getUser(mockReq as Request, mockRes as Response))
    .rejects.toThrow("Network error");
});
```

## E2E Testing Best Practices (Playwright)

### File Organization
- Feature files: `e2e/features/*.feature` (Gherkin syntax)
- Step definitions: `e2e/stepDefinitions/*Steps.ts`
- Page objects: `e2e/pages/*.ts`
- Tests: `e2e/tests/*.spec.ts`
- Test data: `e2e/fixtures/testData.ts`

### Gherkin Syntax (Feature Files)

```gherkin
Feature: User Login
  As a user
  I want to log in to the application
  So that I can access my dashboard

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter username "testuser"
    And I enter password "password123"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see "Welcome, Test User"

  Scenario: Login fails with invalid password
    Given I am on the login page
    When I enter username "testuser"
    And I enter password "wrongpassword"
    And I click the login button
    Then I should see an error message "Invalid credentials"
```

### Page Object Model (POM) Pattern

```typescript
// ✅ CORRECT: BasePage for common functionality
import { Page, Locator } from "@playwright/test";

export class BasePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForElement(selector: string, timeout = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async clickElement(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async fillInput(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  async getText(selector: string): Promise<string> {
    return this.page.textContent(selector) || "";
  }

  async isElementVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}

// ✅ CORRECT: Specific page extending BasePage
export class LoginPage extends BasePage {
  private readonly usernameInput = 'input[name="username"]';
  private readonly passwordInput = 'input[name="password"]';
  private readonly loginButton = 'button[type="submit"]';
  private readonly errorMessage = ".alert-error";

  async navigateTo(): Promise<void> {
    await this.page.goto("/login");
    await this.page.waitForLoadState("networkidle");
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
    await this.page.waitForNavigation();
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isElementVisible(this.errorMessage);
  }
}
```

### Step Definition Implementation

```typescript
// ✅ CORRECT: Using step definitions with POM
import { Given, When, Then, Before } from "@cucumber/cucumber";
import { expect, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

let page: Page;
let loginPage: LoginPage;

Before(async () => {
  // Initialize page before each scenario
  page = browser.newPage();
  loginPage = new LoginPage(page);
});

Given("I am on the login page", async () => {
  await loginPage.navigateTo();
  await expect(loginPage.page).toHaveURL(/.*login/);
});

When("I enter username {string}", async (username: string) => {
  await loginPage.fillInput('input[name="username"]', username);
});

When("I enter password {string}", async (password: string) => {
  await loginPage.fillInput('input[name="password"]', password);
});

When("I click the login button", async () => {
  await loginPage.clickElement('button[type="submit"]');
});

Then("I should be redirected to the dashboard", async () => {
  await expect(loginPage.page).toHaveURL(/.*dashboard/);
});

Then("I should see an error message {string}", async (message: string) => {
  const error = await loginPage.getErrorMessage();
  expect(error).toContain(message);
});
```

### E2E Test Specifications

```typescript
// ✅ CORRECT: Using POM in test files
import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { testData } from "../fixtures/testData";

test.describe("Login Feature", () => {
  let page: Page;
  let loginPage: LoginPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    await loginPage.navigateTo();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test("should successfully login with valid credentials", async () => {
    await loginPage.login(testData.validUser.username, testData.validUser.password);
    
    await expect(page).toHaveURL(/.*dashboard/);
    const welcomeText = await page.textContent(".welcome-message");
    expect(welcomeText).toContain("Welcome");
  });

  test("should display error with invalid credentials", async () => {
    await loginPage.login("testuser", "wrongpassword");
    
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBe(true);
    
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain("Invalid credentials");
  });
});
```

### E2E Testing Best Practices

#### Timeouts and Waits
```typescript
// ✅ GOOD: Explicit waits
await page.waitForSelector(".data-loaded", { timeout: 5000 });
await page.waitForNavigation();
await page.waitForLoadState("networkidle");

// ✅ GOOD: Using locators (preferred in Playwright)
const button = page.locator("button:has-text('Login')");
await button.waitFor({ state: "visible" });
await button.click();

// ❌ POOR: Arbitrary waits
await page.waitForTimeout(1000); // Flaky!
```

#### Selectors
```typescript
// ✅ GOOD: Semantic selectors
const loginButton = page.locator("button[type='submit']");
const userInput = page.locator("input[name='username']");
const errorAlert = page.locator(".alert-error");

// ✅ GOOD: Using data-testid
// In component: <button data-testid="login-button">Login</button>
const loginButton = page.locator('[data-testid="login-button"]');

// ❌ POOR: Brittle XPath selectors
const button = page.locator("/html/body/div[1]/form/button[2]");

// ❌ POOR: Class-based selectors (change with styling)
const button = page.locator(".btn.btn-primary.w-full");
```

#### Test Data
```typescript
// fixtures/testData.ts - Centralized test data
export const testData = {
  validUser: {
    username: "testuser",
    password: "password123",
    email: "test@example.com",
  },
  invalidUser: {
    username: "nonexistent",
    password: "wrong",
  },
  jobRoles: [
    { id: 1, title: "Engineer", department: "Tech" },
    { id: 2, title: "Designer", department: "Design" },
  ],
};
```

#### Screenshot and Video on Failure
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
});
```

## Testing Commands and Execution

### Vitest Commands
```bash
# Run all unit tests
npm run test:run

# Run tests in watch mode
npm run test

# Run specific test file
npm run test -- src/controllers/user-controller.test.ts

# Run with coverage
npm run test:coverage

# Run tests matching pattern
npm run test -- --grep "should create user"
```

### Playwright Commands
```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test e2e/tests/login.spec.ts

# Run with specific browser
npx playwright test --project=chromium

# Run in debug mode
npx playwright test --debug

# Run with headed mode (see browser)
npx playwright test --headed

# Generate test report
npx playwright test --reporter=html
```

## Common Testing Pitfalls to Avoid

### ❌ Anti-patterns

1. **Testing Implementation Details**
   ```typescript
   // ❌ WRONG: Testing private methods
   expect(controller['privateMethod']).toHaveBeenCalled();
   
   // ✅ CORRECT: Test public interface and behavior
   expect(result).toEqual(expectedOutput);
   ```

2. **Flaky Tests**
   ```typescript
   // ❌ WRONG: Arbitrary waits
   await new Promise(r => setTimeout(r, 500));
   
   // ✅ CORRECT: Wait for specific conditions
   await expect(page.locator(".data")).toBeVisible();
   ```

3. **Shared State Between Tests**
   ```typescript
   // ❌ WRONG: Global variables modified during tests
   let sharedData = [];
   it("test 1", () => {
     sharedData.push(1); // Affects other tests
   });
   
   // ✅ CORRECT: Setup fresh state in beforeEach
   let data: number[];
   beforeEach(() => {
     data = []; // Fresh state each test
   });
   ```

4. **Over-mocking**
   ```typescript
   // ❌ WRONG: Mocking everything
   const mockEverything = vi.fn();
   
   // ✅ CORRECT: Mock only external dependencies
   const mockHttpClient = { get: vi.fn() };
   ```

5. **Testing Too Much in One Test**
   ```typescript
   // ❌ WRONG: Multiple assertions testing different things
   it("does everything", async () => {
     // Create user, login, update profile, logout
   });
   
   // ✅ CORRECT: Single focused test
   it("should create a user with valid data", async () => {
     // Just test user creation
   });
   ```

## Test-Driven Development (TDD) Workflow

### When to Write Tests

1. **Before Implementation** (Preferred)
   - Write failing test first
   - Implement code to make test pass
   - Refactor while keeping tests green

2. **Alongside Implementation**
   - Write test while writing code
   - Keeps code testable and focused

3. **After Implementation** (Last resort)
   - Only for legacy code or hotfixes
   - Add tests as you understand behavior

### TDD Red-Green-Refactor Cycle
```
1. RED: Write failing test
   it("should filter job roles by department", () => {
     // Test that will fail
   });

2. GREEN: Write minimal code to pass
   public filter(dept: string) {
     return this.roles.filter(r => r.dept === dept);
   }

3. REFACTOR: Improve code while keeping test green
   - Extract methods
   - Improve names
   - Optimize logic
```

## Continuous Integration (CI) Testing

### Running Tests in CI Pipeline
```bash
# Format check (fails if code not formatted)
npm run check

# Type check (fails if TypeScript errors)
npm run type-check

# Unit tests with coverage (fails if coverage below threshold)
npm run test:run --coverage

# E2E tests (fails if any test fails)
npx playwright test
```

### Coverage Thresholds
- **Global**: Minimum 70% coverage
- **New Code**: Minimum 80% coverage
- **Critical Paths**: 100% coverage required
- **Controllers**: 100% branch coverage
- **Services**: 100% branch coverage

## Documentation and Maintenance

### Test Documentation
- Write descriptive test names that explain the scenario
- Add comments explaining complex test logic
- Use JSDoc for test utilities
- Keep README updated with testing instructions

### Regular Test Maintenance
- Review failing tests regularly
- Remove obsolete tests
- Refactor duplicate test logic
- Update tests when requirements change
- Keep dependencies up to date

## Summary: Testing Checklist

Before writing tests, ensure:
- [ ] You understand what needs to be tested
- [ ] You know the difference between unit and E2E tests
- [ ] You have identified all edge cases and error scenarios
- [ ] You plan to test both happy path and error cases
- [ ] You know what data you need (fixtures/mocks)
- [ ] You have setup/teardown logic planned (beforeEach/afterEach)
- [ ] You understand the existing patterns in the codebase
- [ ] Your tests will provide 80%+ coverage
- [ ] Your test names clearly explain what they test
- [ ] You can run tests locally before committing

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/)
- [Jest Matchers (similar to Vitest)](https://jestjs.io/docs/expect)

---

**Remember**: Good tests are investments. They make code more maintainable, catch bugs early, and give confidence in refactoring. Write tests that would make future developers thank you.
