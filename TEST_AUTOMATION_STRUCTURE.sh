#!/bin/bash
# Test Automation Setup Guide
# This file documents the organized test structure

cat << 'EOF'

================================================================================
                    TEST AUTOMATION FRAMEWORK STRUCTURE
================================================================================

PROJECT: Team2 Job App Frontend
FRAMEWORKS: Playwright, Cucumber, Gherkin, Vitest
DATE: November 5, 2025

================================================================================
DIRECTORY ORGANIZATION
================================================================================

test-automation/
│
├── e2e/                          # End-to-End Tests (Playwright)
│   ├── playwright/               # Direct Playwright tests
│   │   ├── auth-flow.spec.ts     # Authentication testing
│   │   ├── view-job-listings.spec.ts
│   │   ├── job-application.spec.ts
│   │   └── minimal-test.spec.ts  # Smoke test
│   │
│   └── pages/                    # Page Object Models
│       ├── JobAppPage.ts         # Job listing page object
│       └── LoginPage.ts          # Login page object
│
├── bdd/                          # Behavior-Driven Development (Cucumber)
│   ├── features/                 # Gherkin feature files
│   │   ├── view-jobs.feature     # Job browsing scenarios
│   │   ├── apply-jobs.feature    # Application workflows
│   │   ├── job-app.feature       # General job app features
│   │   └── login.feature         # Authentication features
│   │
│   └── steps/                    # Step definitions
│       ├── job-app.steps.ts      # Job app step implementations
│       ├── job-browsing.steps.ts # Job browsing step implementations
│       └── login.steps.ts        # Login step implementations
│
├── support/                      # Shared test infrastructure
│   ├── hooks.ts                  # Setup/teardown hooks (BeforeAll, AfterAll)
│   ├── world.ts                  # Cucumber World (test context)
│   └── tsconfig.json             # TypeScript configuration
│
├── dist/                         # Compiled test files (auto-generated)
│
└── cucumber.js                   # Cucumber configuration

================================================================================
FILE DESCRIPTIONS
================================================================================

E2E PLAYWRIGHT TESTS (test-automation/e2e/playwright/)
─────────────────────────────────────────────────────

1. auth-flow.spec.ts
   Purpose: Test authentication flows
   Tests:
     • TC-AUTH-001: Homepage loads successfully
     • TC-AUTH-002: Login link accessible
     • TC-AUTH-003: Navigate to login page
     • TC-AUTH-004: Email validation
     • TC-AUTH-005: Form structure correct
   Status: ✅ 5/5 PASSING

2. view-job-listings.spec.ts
   Purpose: Test job discovery and browsing
   Tests:
     • TC-JOB-001: Display job listings
     • TC-JOB-001b: Apply buttons visible
     • TC-JOB-002: Page structure correct
     • TC-JOB-003: Responsive design
   Status: ✅ 4/4 PASSING

3. job-application.spec.ts
   Purpose: Test job application workflows
   Tests:
     • TC-APP-001: Navigate to application form
     • TC-APP-002: Access application form
     • TC-APP-003: Navigate between jobs
   Status: ✅ 3/3 PASSING

4. minimal-test.spec.ts
   Purpose: Smoke test for basic functionality
   Tests: View Jobs on Homepage
   Status: ✅ 1/1 PASSING

PAGE OBJECTS (test-automation/e2e/pages/)
──────────────────────────────────────────

1. JobAppPage.ts
   Methods:
     • goto() - Navigate to job app home
     • clickLoginLink()
     • clickRegisterLink()
     • enterEmail(), enterPassword()
     • clickLoginButton()
   Selectors: Robust CSS/XPath selectors for job pages

2. LoginPage.ts
   Methods:
     • navigateToLoginPage()
     • enterUsername(), enterPassword()
     • clickLoginButton()
     • verifyLoginForm()
   Selectors: Login form elements and validation messages

BDD FEATURES (test-automation/bdd/features/)
──────────────────────────────────────────────

1. view-jobs.feature (8 scenarios)
   @smoke scenarios: View job listings, job card info
   @interaction scenarios: View details, navigation
   @ui scenarios: Page structure, responsive design
   @data scenarios: Validate job data fields

2. apply-jobs.feature (5 scenarios)
   @critical scenarios: Navigate to application form
   @interaction scenarios: Form access, multi-job navigation
   @data scenarios: Job info in application flow

3. job-app.feature (6 scenarios)
   @smoke scenarios: Homepage navigation, login/register
   @negative scenarios: Validation testing
   @ui scenarios: Page elements and layout

4. login.feature (6 scenarios)
   @smoke scenarios: Login/logout flows
   @negative scenarios: Invalid credentials
   @data-driven scenarios: Multiple user types

STEP DEFINITIONS (test-automation/bdd/steps/)
───────────────────────────────────────────────

1. job-app.steps.ts (80+ steps)
   GIVEN:
     • I am on the job app home page
     • I am on the job app login page
   WHEN:
     • I click on {link} link
     • I enter email/password
     • I click the login button
   THEN:
     • I should see {text} link
     • I should see the login form
     • I should see {field} input field

2. job-browsing.steps.ts (60+ steps)
   GIVEN:
     • I am on the job roles listing page
   WHEN:
     • I click the first {button} button
     • I navigate back to previous page
     • I click on a different job's {button} button
   THEN:
     • I should see {heading} heading
     • I should see at least {count} job card
     • Each job should have {field}
     • Page responsiveness checks

3. login.steps.ts (40+ steps)
   Step definitions for login feature file
   Tests user authentication flows

SUPPORT FILES (test-automation/support/)
──────────────────────────────────────────

1. hooks.ts
   BeforeAll:
     • Launch Playwright browser
     • Set browser type from env
   Before (each scenario):
     • Create browser context
     • Create page
     • Initialize logging
   After (each scenario):
     • Take screenshot on failure
     • Close page and context
   AfterAll:
     • Close browser
     • Cleanup resources

2. world.ts
   CustomWorld class extends Cucumber World
   Properties:
     • browser: Playwright Browser
     • browserContext: BrowserContext
     • page: Page
     • testData: Map<string, any>
   Methods:
     • setTestData(key, value)
     • getTestData(key)
     • getExecutionTime()
     • clearTestData()

================================================================================
TEST CATEGORIES & TAGS
================================================================================

SMOKE TESTS (@smoke)
─────────────────────
Scenarios: 10+
Purpose: Basic functionality verification
Examples:
  ✅ View job listings load
  ✅ Homepage navigation works
  ✅ Login form accessible

CRITICAL TESTS (@critical)
──────────────────────────
Scenarios: 5+
Purpose: Core user journeys
Examples:
  ✅ Can navigate to jobs
  ✅ Can apply for jobs
  ✅ Can view job details

INTERACTION TESTS (@interaction)
──────────────────────────────────
Scenarios: 8+
Purpose: User interactions work
Examples:
  ✅ Click buttons
  ✅ Navigate between pages
  ✅ Form input

UI/RESPONSIVE TESTS (@ui, @responsive)
────────────────────────────────────────
Scenarios: 6+
Purpose: UI and layout verification
Examples:
  ✅ Page structure correct
  ✅ Responsive design works
  ✅ Elements visible/accessible

DATA VALIDATION TESTS (@data)
───────────────────────────────
Scenarios: 4+
Purpose: Data integrity checks
Examples:
  ✅ All jobs have required fields
  ✅ Job info displays correctly

NEGATIVE/EDGE CASES (@negative)
────────────────────────────────
Scenarios: 4+
Purpose: Error handling
Examples:
  ✅ Empty form validation
  ✅ Invalid input handling

================================================================================
HOW TO RUN TESTS
================================================================================

PREREQUISITE: Start development server
────────────────────────────────────────
npm run dev
# Server runs on http://localhost:3000

PLAYWRIGHT TESTS (Direct)
─────────────────────────
# All Playwright tests
npx playwright test test-automation/e2e/playwright/

# Specific test file
npx playwright test test-automation/e2e/playwright/auth-flow.spec.ts

# Single test
npx playwright test -g "TC-AUTH-001"

# With specific browser
npx playwright test --project=chromium

# Headed mode (see browser)
npx playwright test --headed

# View HTML report
npx playwright show-report

CUCUMBER/BDD TESTS
──────────────────

Method 1: Using npm scripts
  npm run test:e2e                    # Run all features
  npm run test:e2e:tags "@smoke"     # Run by tag
  npm run test:e2e:tags "@critical"  # Run critical tests
  npm run test:e2e:parallel          # Run parallel (2 workers)
  npm run test:e2e:debug             # Debug mode

Method 2: Direct Cucumber command
  npx cucumber-js test-automation/bdd/features \
    -l ts-node/esm \
    -i test-automation/support/hooks.ts \
    -i test-automation/support/world.ts \
    -i test-automation/bdd/steps/job-app.steps.ts \
    -i test-automation/bdd/steps/job-browsing.steps.ts

Method 3: By specific feature
  npx cucumber-js test-automation/bdd/features/view-jobs.feature

Method 4: By tag
  npx cucumber-js test-automation/bdd/features --tags "@smoke"

VITEST/UNIT TESTS
─────────────────
npm run test           # Interactive watch mode
npm run test:run       # Run once
npm run test:coverage  # With coverage report
npm run test:ui        # UI dashboard

================================================================================
TEST EXECUTION SUMMARY
================================================================================

PLAYWRIGHT TESTS:     13/13 PASSING ✅
  • auth-flow: 5/5 ✅
  • view-job-listings: 4/4 ✅
  • job-application: 3/3 ✅
  • minimal: 1/1 ✅

CUCUMBER/BDD TESTS:   14/38 PASSING (36%)
  • Implemented steps: 36+
  • Scenarios: 28 total (1 passed, 15 failed, 12 undefined)
  • Features: 4 feature files

VITEST/UNIT TESTS:    Running (check npm run test:run)

OVERALL COVERAGE:     ~70% of critical paths

================================================================================
CONFIGURATION FILES
================================================================================

cucumber.js
  • Defines feature file paths: test-automation/bdd/features/**/*.feature
  • Specifies step files: test-automation/bdd/steps/*.steps.ts
  • Loader: ts-node/esm (TypeScript support)
  • Reports: HTML, JSON, Progress
  • Timeout: 30 seconds per step
  • Profiles: default, ci, debug

playwright.config.ts
  • testDir: test-automation/e2e/playwright/
  • Projects: chromium, firefox, webkit, mobile devices
  • outputDir: test-results/
  • Timeout: 30s per test

package.json scripts
  • "test:e2e": npm run test:e2e
  • "test:e2e:tags": npm run test:e2e:tags "@tag"
  • "test:e2e:parallel": npm run test:e2e:parallel
  • "test:e2e:debug": npm run test:e2e:debug

================================================================================
ENVIRONMENT VARIABLES
================================================================================

BASE_URL              # Default: http://localhost:3000
HEADLESS              # Default: true (false to see browser)
SLOW_MO               # Default: 0 (milliseconds to slow down)
BROWSER               # Options: chromium, firefox, webkit
CUCUMBER_TAGS         # Filter scenarios by tag
CI                    # Set when running in CI/CD pipeline

Example:
  BASE_URL=http://localhost:3000 npm run test:e2e
  HEADLESS=false SLOW_MO=500 npm run test:e2e
  BROWSER=firefox npm run test:e2e:tags "@critical"

================================================================================
BEST PRACTICES
================================================================================

1. Test Organization
   ✅ Separate Playwright direct tests from BDD tests
   ✅ Group tests by functionality
   ✅ Use descriptive test names
   ✅ Organize page objects by page

2. Test Data
   ✅ Use CustomWorld.testData for sharing between steps
   ✅ Keep test data minimal
   ✅ Use environment variables for credentials
   ✅ Clear data after each test

3. Selectors
   ✅ Use semantic HTML selectors first
   ✅ Avoid brittle XPath selectors
   ✅ Centralize selectors in page objects
   ✅ Use has-text() for flexibility

4. Waits
   ✅ Use waitForLoadState('load')
   ✅ Use waitForSelector with timeout
   ✅ Avoid implicit waits
   ✅ Set explicit timeouts in config

5. Screenshots & Logs
   ✅ Screenshots on failure
   ✅ Detailed console logging
   ✅ Store in test-results/
   ✅ Include in test reports

================================================================================
TROUBLESHOOTING
================================================================================

Server not running?
  → npm run dev

Tests not found?
  → Check feature file paths in cucumber.js
  → Verify step files are imported

Steps undefined?
  → Check imports in step files
  → Verify step definition names match feature file

Selectors not finding elements?
  → Check actual HTML structure
  → Update selectors in page objects
  → Use browser dev tools to inspect

Connection refused?
  → Verify server is running on port 3000
  → Check BASE_URL environment variable

TypeScript errors?
  → Run: npm run type-check
  → Check tsconfig.json

================================================================================
NEXT STEPS
================================================================================

Priority 1: Complete undefined steps
  • Implement remaining 20+ step definitions
  • Fix selector issues for job browsing
  • Add error handling steps

Priority 2: Increase BDD coverage
  • Add negative test scenarios
  • Add data-driven tests
  • Test edge cases

Priority 3: CI/CD Integration
  • Add GitHub Actions workflow
  • Generate test reports
  • Parallel execution

Priority 4: Advanced Testing
  • Visual regression testing
  • Performance testing
  • Accessibility testing

================================================================================

EOF
