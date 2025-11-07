---
applyTo: '**'
---

# Testing Framework Instructions

## Overview
These instructions define the testing standards, technologies, and best practices for all test automation in this project. Follow these guidelines when writing or maintaining tests to ensure consistency, reliability, and maintainability.

## Testing Technologies Stack

### 1. Vitest (Unit Tests)
- **Purpose**: Component and service-level unit testing
- **Location**: Co-located with source files (`*.test.ts`)
- **Configuration**: `vitest.config.ts`
- **Coverage**: V8-based coverage reporting
- **Globals**: `describe`, `it`, `expect` available globally

### 2. Playwright (E2E Tests)
- **Purpose**: End-to-end browser automation testing
- **Location**: `test-automation/e2e/playwright/`
- **Configuration**: `playwright.config.ts`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome/Safari
- **Page Objects**: `test-automation/e2e/playwright/pages/`

### 3. Cucumber/Gherkin (BDD Tests)
- **Purpose**: Behavior-driven development with business-readable scenarios
- **Features**: `test-automation/bdd/features/*.feature`
- **Steps**: `test-automation/bdd/steps/*.steps.ts`
- **Configuration**: `cucumber.js`
- **Support**: `test-automation/support/` (hooks, world)

## Testing Architecture Principles

### Test Pyramid Approach
1. **Unit Tests (Base)**: Fast, numerous, focused on individual functions/components
2. **Integration Tests (Middle)**: Test interactions between components
3. **E2E Tests (Top)**: Fewer, slower, test complete user workflows

### Test Isolation
- Each test must be independent and stateless
- No shared state between tests
- Use `beforeEach` for setup, `afterEach` for cleanup
- Tests should pass in any order

### Test Naming Conventions
- **Descriptive Names**: Clearly state what is being tested
- **Format**: `describe('Component/Feature')` → `it('should do something when condition')`
- **BDD**: Use Given-When-Then structure in Gherkin scenarios

## Playwright Testing Standards

### Test Strategy: Realistic User Flows
E2E tests should be **small in number but large in scope**, each covering a complete realistic user journey:

✅ **Good E2E Tests:**
- User logs in → navigates to feature → completes action → verifies result
- Multiple features per test when part of one user journey
- Focus on critical paths that users actually take

❌ **Avoid:**
- Many small tests that test individual component interactions
- Tests that mock all interactions (defeats purpose of E2E)
- Tests that verify implementation details instead of user experience

**Example**: Instead of 10 tests for form features, write 2-3 tests covering:
1. "User can navigate to form and see all fields"
2. "User can fill and submit form successfully"
3. "User sees validation errors for invalid input"

### File Structure
```
test-automation/e2e/playwright/
├── pages/                    # Page Object Models
│   ├── login.page.ts
│   ├── job-role-details.page.ts
│   └── index.ts             # Export all page objects
├── *.spec.ts                # Test specifications (minimal number)
└── README.md                # Playwright-specific docs
```

### Locators: Best Practices & Common Issues

#### Locator Selection Priority (Best to Worst)
```typescript
// 1️⃣ BEST: Test IDs (most stable, explicit)
page.locator('[data-testid="submit-btn"]')

// 2️⃣ EXCELLENT: Role selectors (semantic, maintainable)
page.getByRole('button', { name: 'Submit' })
page.getByRole('textbox', { name: 'Email' })
page.getByRole('heading', { level: 1 })

// 3️⃣ GOOD: Label text (accessible, user-focused)
page.getByLabel('Email Address')
page.getByPlaceholder('Enter your name')

// 4️⃣ ACCEPTABLE: Text content (when above unavailable)
page.getByText('Submit')

// 5️⃣ AVOID: CSS/XPath selectors (brittle, implementation-dependent)
page.locator('div.form-container > button:nth-child(2)')  // ❌ DON'T DO THIS
page.locator('xpath=//button[@type="submit"]')             // ❌ DON'T DO THIS
```

#### Common Locator Issues & Solutions

**Issue 1: Element not visible/clickable**
```typescript
// ❌ BAD: Direct click fails on mobile/responsive layouts
await page.locator('a[href="/jobs"]').click();

// ✅ GOOD: Force click when element exists but not in viewport
await page.locator('a[href="/jobs"]').click({ force: true });

// ✅ BETTER: Scroll element into view first
await page.locator('a[href="/jobs"]').scrollIntoViewIfNeeded();
await page.locator('a[href="/jobs"]').click();
```

**Issue 2: Brittle selectors after UI changes**
```typescript
// ❌ BAD: Breaks if button position changes
await page.locator('div:nth-child(3) button').click();

// ✅ GOOD: Semantic, survives UI changes
await page.getByRole('button', { name: 'Delete' }).click();
```

**Issue 3: Finding elements by partial text**
```typescript
// ❌ BAD: Exact match fails with extra whitespace/formatting
await page.locator('text="Click Here"').click();

// ✅ GOOD: Flexible text matching
await page.getByText(/click here/i).click();  // Case-insensitive

// ✅ EXCELLENT: Role-based when possible
await page.getByRole('button', { name: /click here/i }).click();
```

**Issue 4: Selecting from multiple similar elements**
```typescript
// ❌ BAD: Gets first match, fragile
await page.locator('button').first().click();

// ✅ GOOD: Contextual selection
await page.locator('[data-testid="job-row"]').first().locator('button[title="Delete"]').click();

// ✅ EXCELLENT: Combine with parent context
await page.getByText('Important Job').locator('..').getByRole('button', { name: 'Delete' }).click();
```

### Page Object Model (POM)
**MANDATORY**: All Playwright tests MUST use the Page Object Model with proper locator definitions.

#### Page Object Structure with Locators
```typescript
import { Page, Locator } from '@playwright/test';

export class ExamplePage {
  readonly page: Page;
  
  // Define locators as readonly properties
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Use best practices for locators
    this.emailInput = page.getByLabel('Email');  // ✅ Uses semantic label
    this.submitButton = page.getByRole('button', { name: 'Submit' });  // ✅ Role-based
    this.successMessage = page.locator('[data-testid="success-msg"]');  // ✅ Test ID
  }

  async goto(): Promise<void> {
    await this.page.goto('/example');
    await this.page.waitForLoadState('load');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.clear({ force: true });
    await this.emailInput.fill(email, { force: true });
  }

  async submit(): Promise<void> {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }
  
  async isSuccessful(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }
}
```

#### Test Spec Structure with Hooks
```typescript
import { test, expect } from '@playwright/test';
import { ExamplePage } from './pages/example.page.js';

test.describe('Example Feature', () => {
  let page: ExamplePage;

  // BEFORE HOOK: Setup before each test
  test.beforeEach(async ({ page: pwPage }) => {
    page = new ExamplePage(pwPage);
    await page.goto();
    // Additional setup if needed
  });

  // AFTER HOOK: Cleanup and diagnostics after each test
  test.afterEach(async ({ page: pwPage }, testInfo) => {
    // Capture screenshot on failure
    if (testInfo.status !== 'passed') {
      await pwPage.screenshot({ 
        path: `test-results/failure-${testInfo.title}.png` 
      });
    }
    
    // Take a final screenshot for debugging
    if (process.env.DEBUG) {
      await pwPage.screenshot({ 
        path: `test-results/debug-${testInfo.title}.png` 
      });
    }
  });

  // REALISTIC USER FLOW TEST
  test('User can fill and submit form successfully', async () => {
    // User fills out form
    await page.fillEmail('test@example.com');
    
    // User submits
    await page.submit();
    
    // User sees success
    expect(await page.isSuccessful()).toBe(true);
    await expect(pwPage).toHaveURL(/success/);
  });
});
```

### Built-in Playwright Hooks for E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin Features', () => {
  // Before all tests in this describe block
  test.beforeAll(async () => {
    console.log('Starting admin test suite');
  });

  // After all tests in this describe block
  test.afterAll(async () => {
    console.log('Completed admin test suite');
  });

  // Before each individual test
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:3000');
    // Additional setup
  });

  // After each individual test (IMPORTANT FOR DIAGNOSTICS)
  test.afterEach(async ({ page }, testInfo) => {
    // Capture screenshot on any failure
    if (testInfo.status !== 'passed') {
      const fileName = `failure-${Date.now()}.png`;
      await page.screenshot({ path: `test-results/${fileName}` });
      console.error(`Screenshot saved: ${fileName}`);
    }
    
    // Optionally capture page HTML for debugging
    if (process.env.DEBUG) {
      const html = await page.content();
      const htmlFile = `debug-${Date.now()}.html`;
      require('fs').writeFileSync(`test-results/${htmlFile}`, html);
    }
    
    // Always close page to prevent resource leaks
    await page.close().catch(() => {});
  });

  test('realistic user journey', async ({ page }) => {
    // Test body
  });
});
```

### Playwright Best Practices

#### Selectors - General Guidelines
- Use semantic selectors (role-based) whenever possible
- Prefer `getByRole()`, `getByLabel()`, `getByText()` over raw locators
- Use `data-testid` only when semantic selectors aren't available
- Never use nth-child or index-based selectors (brittle)
- Combine multiple locators for complex scenarios

#### Assertions
- Use Playwright's built-in assertions (auto-retry)
- Prefer `expect(locator).toBeVisible()` over `expect(await locator.isVisible()).toBe(true)`
- Use `toHaveURL()`, `toHaveTitle()`, `toContainText()` for common checks

#### Waits and Timeouts
- **Avoid hard waits**: Never use `page.waitForTimeout()` unless absolutely necessary
- **Auto-waiting**: Playwright auto-waits for elements; trust it
- **Explicit waits**: Use `waitForLoadState()`, `waitForSelector()` when needed
- **Timeouts**: Set reasonable timeouts in config, not in individual tests

#### Error Handling
- Let tests fail naturally; Playwright captures screenshots/videos automatically
- Use `test.fail()` for known failures
- Use `test.fixme()` for broken tests that need fixing

#### Test Organization
- Keep E2E tests focused on realistic user flows
- Group related tests with `test.describe()`
- Use meaningful test names that describe user actions, not implementation
- Tag critical tests with `@smoke`, `@critical`

## Cucumber/BDD Testing Standards

### Gherkin Feature Files

#### Feature File Structure
```gherkin
Feature: Feature Name
  As a [role]
  I want to [action]
  So that [benefit]

  Background:
    Given I am on the starting page

  @smoke @critical
  Scenario: Descriptive scenario name
    Given I have some precondition
    When I perform some action
    Then I should see expected result
    And I should see another result
```

#### Gherkin Best Practices
- **Business Language**: Write for non-technical stakeholders
- **Declarative, Not Imperative**: Focus on WHAT, not HOW
  - ✅ Good: `Given I am logged in as admin`
  - ❌ Bad: `Given I click login button and enter username and password`
- **Single Responsibility**: One scenario tests one behavior
- **Reusable Steps**: Write steps that can be reused across scenarios
- **Tags**: Use tags for categorization (`@smoke`, `@critical`, `@regression`)

### Step Definitions

#### Step File Structure
```typescript
import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world.js';
import { PageObject } from '../../e2e/pages/page-object.js';

let pageObject: PageObject;

Before(async function (this: CustomWorld) {
  pageObject = new PageObject(this.page);
});

Given('I am on the homepage', async function (this: CustomWorld) {
  await pageObject.goto();
});

When('I click the {string} button', async function (this: CustomWorld, buttonText: string) {
  await this.page.click(`button:has-text("${buttonText}")`);
});

Then('I should see {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page.locator(`text=${text}`)).toBeVisible();
});
```

#### Step Definition Best Practices
- **Use CustomWorld**: Access `this.page` for Playwright interactions
- **Initialize Page Objects**: Use `Before` hook to create page objects
- **Parameters**: Use Cucumber expressions for dynamic values
- **Async/Await**: All step functions must be async
- **Assertions**: Use Playwright's `expect()` for auto-retry
- **Logging**: Add console.log for debugging (remove in production)

### Hooks and World

#### Hooks (`test-automation/support/hooks.ts`)
- **BeforeAll**: Launch browser once for all tests
- **AfterAll**: Close browser and cleanup
- **Before**: Create fresh context and page for each scenario
- **After**: Capture screenshots on failure, close page/context

#### Custom World (`test-automation/support/world.ts`)
- Provides `page`, `browser`, `browserContext` to all steps
- Stores scenario metadata and test data
- Methods: `setTestData()`, `getTestData()`, `clearTestData()`

## Unit Testing Standards (Vitest)

### Test File Structure
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServiceClass } from './service-class.js';

describe('ServiceClass', () => {
  let service: ServiceClass;

  beforeEach(() => {
    service = new ServiceClass();
  });

  describe('methodName', () => {
    it('should return expected result when given valid input', () => {
      const result = service.methodName('valid');
      expect(result).toBe('expected');
    });

    it('should throw error when given invalid input', () => {
      expect(() => service.methodName('')).toThrow('Invalid input');
    });
  });
});
```

### Unit Testing Best Practices
- **AAA Pattern**: Arrange, Act, Assert
- **One Assertion Per Test**: Focus on single behavior
- **Mock External Dependencies**: Use `vi.fn()`, `vi.mock()`
- **Test Edge Cases**: Null, undefined, empty strings, boundaries
- **Coverage Target**: Aim for 80%+ coverage on new code

## Test Execution Commands

### Playwright
```bash
npx playwright test                    # Run all Playwright tests
npx playwright test --headed           # Run with browser visible
npx playwright test --debug            # Debug mode with inspector
npx playwright test path/to/file.spec.ts  # Run single file
npx playwright show-report             # View HTML report
```

### Cucumber
```bash
npm run test:e2e                       # Run all BDD tests
npm run test:e2e:tags "@smoke"         # Run tests with specific tag
npm run test:e2e:parallel              # Run in parallel
HEADLESS=false npm run test:e2e        # Run with browser visible
```

### Vitest
```bash
npm run test                           # Watch mode
npm run test:run                       # Run once
npm run test:coverage                  # With coverage report
npm run test -- path/to/file.test.ts   # Run single file
```

## Test Artifacts and Debugging

### Artifacts Locations
- **Playwright**: `test-results/playwright/` (screenshots, videos, traces)
- **Cucumber**: `test-results/screenshots/` (failure screenshots + HTML)
- **Coverage**: `coverage/` (HTML coverage reports)
- **Reports**: `playwright-report/` (HTML test reports)

### Debugging Failed Tests
1. **Check Screenshots**: Failure screenshots in `test-results/`
2. **Review HTML**: Page HTML saved alongside screenshots
3. **View Videos**: Playwright records videos for all tests
4. **Traces**: Use `npx playwright show-trace trace.zip` for detailed debugging
5. **Console Logs**: Check test output for error messages

## Quality Gates

### Pre-Commit Requirements
- All unit tests pass: `npm run test:run`
- Type checking passes: `npm run type-check`
- Linting/formatting passes: `npm run check`

### Pre-Merge Requirements
- All unit tests pass
- All E2E tests pass (Playwright + Cucumber)
- Code coverage ≥ 80% for new code
- No TypeScript errors
- No linting errors

## Common Patterns and Anti-Patterns

### ✅ Good Practices
- Use Page Object Model for all E2E tests
- Write declarative Gherkin scenarios
- Keep tests independent and isolated
- Use descriptive test names
- Mock external dependencies in unit tests
- Capture artifacts on failure
- Run tests in CI/CD pipeline
- Tag tests for selective execution

### ❌ Anti-Patterns
- Hardcoded waits (`page.waitForTimeout(5000)`)
- Shared state between tests
- Testing implementation details instead of behavior
- Overly complex test setup
- Brittle CSS selectors (prefer data-testid)
- No assertions in tests
- Skipping tests without good reason
- Copy-pasting test code (use helpers/page objects)

## Test Maintenance

### Keeping Tests Healthy
- **Regular Review**: Review and refactor tests quarterly
- **Remove Flaky Tests**: Fix or remove unreliable tests
- **Update Selectors**: Keep selectors up-to-date with UI changes
- **Refactor Page Objects**: Extract common patterns
- **Update Documentation**: Keep README and instructions current

### Test Data Management
- Use fixtures or factories for test data
- Clean up test data after execution
- Use unique identifiers to avoid conflicts
- Mock external services where possible

## Using Playwright with MCP (Model Context Protocol)

### What is Playwright MCP?
Playwright MCP enables AI assistants and automated tools to interact with browser automation tasks through a standardized interface. This allows better integration with development workflows and testing automation.

### When to Use Playwright MCP
- **Automated Test Generation**: AI-assisted test creation with proper structure
- **Test Maintenance**: Keeping tests synchronized with UI changes
- **Debugging**: AI-assisted analysis of test failures
- **Documentation**: Auto-generating test documentation from specs

### MCP Integration Benefits
- Consistent test code structure across the project
- Better error handling and diagnostics
- AI-assisted locator selection (prioritizes best practices)
- Automated Page Object Model generation
- Intelligent hook management (beforeEach, afterEach setup)

### Example: AI-Assisted Test Creation with MCP
When asking AI to generate Playwright tests:
1. Reference this instructions file for context
2. Specify realistic user flows (not isolated component tests)
3. Request Page Object Model pattern
4. Ask for proper hooks (before/after)
5. Ensure semantic locators are used

**Good Prompt Example:**
> "Create a Playwright test for the admin delete job role workflow. The user logs in, navigates to job roles list, finds the job, and clicks delete. Use Page Object Model, realistic user flow, and include beforeEach/afterEach hooks with screenshots on failure. Follow the testing.instructions.md patterns."

**Result**: AI generates tests with:
- ✅ Proper Page Object Model structure
- ✅ Role-based semantic locators
- ✅ Before/after hooks with diagnostics
- ✅ Error handling with screenshots
- ✅ Realistic user flow focus

## Accessibility Testing

### Adding Accessibility Checks
- Consider integrating `@axe-core/playwright` for automated a11y testing
- Test keyboard navigation in E2E tests
- Verify ARIA labels and roles
- Check color contrast and focus indicators

## Continuous Integration

### CI Test Execution
- Run all test types on every PR
- Fail builds on test failures
- Upload test artifacts for failed runs
- Generate and publish coverage reports
- Run E2E tests in headless mode for speed

## Test Reporting

### Automatic Report Generation

After every test run, an HTML report is automatically generated aggregating results from all frameworks.

**Generate Report:**
```bash
# Run all tests and generate report
npm run test:all

# Generate report from existing test results
npm run test:report

# View report in browser
open test-results/test-report.html
```

### Report Contents

#### Executive Summary Section
- **Total Tests**: Combined count across Playwright, Vitest, and Cucumber
- **Pass Rate**: Percentage of tests that passed
- **Status Breakdown**: 
  - ✅ Passed tests (green)
  - ❌ Failed tests (red)
  - ⏭️ Skipped tests (yellow)

#### Playwright E2E Tests Section
- Test name and suite hierarchy
- Execution status with color coding
- Duration in milliseconds/seconds
- Browser used (Chromium, Firefox, WebKit, Mobile)
- Error messages for failed tests
- Screenshot links (if captured)

#### Vitest Unit Tests Section
- Test name and source file
- Pass/Fail/Skip status
- Execution duration
- Stack traces and error messages
- File-level grouping

#### Cucumber BDD Tests Section
- Feature name
- Scenario name and description
- Status (Passed/Failed/Skipped)
- Step execution breakdown (e.g., "6/7 steps passed")
- Step-level error messages
- Scenario duration

### Report Features

**Visual Design:**
- Professional gradient header with timestamp
- Color-coded status cards (passed, failed, skipped, pass rate)
- Responsive grid layout (mobile, tablet, desktop)
- Interactive tables with sort capability
- Error message expansion on hover
- Footer with framework links

**Data Included:**
- Framework-specific metrics
- Per-test execution details
- Error stack traces
- Execution timestamps
- Test durations
- Browser information

**Accessibility:**
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigable tables
- High contrast colors
- Mobile-responsive design

### Report Generation Script

Located at: `scripts/generate-test-report.js`

**Capabilities:**
- Parses Playwright `results.json`
- Parses Vitest results (JUnit/JSON format)
- Parses Cucumber results JSON
- Generates self-contained HTML (no external dependencies)
- Handles missing result files gracefully
- Preserves error context and messages

**Usage:**
```bash
# Requires test result files to exist:
# - test-results/results.json (Playwright)
# - test-results/vitest-results.json (Vitest)
# - test-results/cucumber-results.json (Cucumber)

node scripts/generate-test-report.js
```

### Report Output

**File Location**: `test-results/test-report.html`

**File Size**: 150-300KB (includes all CSS/styling)

**Generation Time**: < 500ms

**Viewing Options:**
```bash
# macOS
open test-results/test-report.html

# Linux
xdg-open test-results/test-report.html

# Windows
start test-results/test-report.html

# Or serve locally
python -m http.server 8000
# Visit: http://localhost:8000/test-results/test-report.html
```

### CI/CD Integration Examples

**GitHub Actions:**
```yaml
- name: Run Tests and Generate Report
  run: npm run test:all

- name: Upload Test Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: test-report
    path: test-results/test-report.html
```

**Jenkins:**
```groovy
stage('Test & Report') {
  steps {
    sh 'npm run test:all'
    
    publishHTML([
      reportDir: 'test-results',
      reportFiles: 'test-report.html',
      reportName: 'Test Report'
    ])
  }
}
```

**GitLab CI:**
```yaml
test_and_report:
  script:
    - npm run test:all
  artifacts:
    paths:
      - test-results/test-report.html
    reports:
      junit: test-results/results.xml
```

### Customizing Reports

**Change Report Title/Branding:**
```javascript
// In scripts/generate-test-report.js
const html = `
  <h1>🧪 ${YOUR_COMPANY} Test Report</h1>
`;
```

**Modify Color Scheme:**
```css
/* In generateHTMLReport() CSS section */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Change these colors */
}
```

**Add Custom Metrics:**
```javascript
// Extend parsePlaywrightResults() or other parsers
// Add custom fields to test objects
test.customMetric = calculateCustomMetric(testData);
```

### Troubleshooting Reports

**Report Not Generating:**
```bash
# 1. Verify test result files exist
ls -la test-results/

# 2. Run tests first
npm run test:run
npx playwright test

# 3. Try generating manually
node scripts/generate-test-report.js
```

**Missing Data in Report:**
- Ensure tests have run and produced output
- Check file format matches expected JSON structure
- Verify file paths are correct in script

**Report Shows "No Tests Found":**
- Confirm test frameworks are configured correctly
- Verify `test-results/` directory exists
- Check that result files are being created

### Best Practices

1. **Run Report After Every Test Suite**
   ```bash
   npm run test:all  # Tests + Report
   ```

2. **Archive Reports for History**
   ```bash
   cp test-results/test-report.html \
     test-results/report-$(date +%Y%m%d-%H%M%S).html
   ```

3. **Include in CI/CD Pipeline**
   - Generate on every PR
   - Archive artifacts
   - Fail builds on test failures

4. **Share with Team**
   - Email HTML reports
   - Host on artifact server
   - Display in team dashboard

5. **Review Regularly**
   - Check pass rates daily
   - Identify flaky tests
   - Track performance trends

## Resources and Further Reading

### Official Documentation
- [Playwright Docs](https://playwright.dev)
- [Cucumber.js Docs](https://cucumber.io/docs/cucumber/)
- [Vitest Docs](https://vitest.dev)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

### Project-Specific Docs
- `README.md` - Project overview and test execution
- `docs/TEST_REPORT.md` - Detailed test report documentation
- `playwright.config.ts` - Playwright configuration
- `cucumber.js` - Cucumber configuration
- `vitest.config.ts` - Vitest configuration
- `.github/instructions/` - All project instruction files

---

**Remember**: Quality tests are as important as quality code. Invest time in writing maintainable, reliable tests that provide value and confidence.
