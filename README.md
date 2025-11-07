# Team 2 Job App Frontend

[![Code Quality](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/code-quality.yml/badge.svg)](https://github.com/ChrisThompsonK/team2-job-app-frontend/actions/workflows/code-quality.yml) [![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

A modern, accessible job application portal built with Node.js, TypeScript, Express, Nunjucks, Tailwind CSS, and DaisyUI.

## 🚀 Features
- **Authentication & Authorization** - Login, registration, session management, admin role controls
- **Job Management** - Browse, create, edit, delete job roles with status badges
- **Applications** - Submit with file uploads, track applicants, CSV export
- **Responsive UI** - Mobile-optimized design with accessibility features
- **Modern Stack** - TypeScript strict mode, Express, Nunjucks, Tailwind CSS, Axios
- **Quality** - 242 passing tests, Biome formatting/linting, 80%+ coverage

## 📦 Project Structure
```
src/
├── controllers/        # HTTP handlers (job roles, auth, applications)
├── services/          # Business logic & API calls (Axios)
├── middleware/        # Auth middleware & role checking
├── models/            # TypeScript interfaces & types
├── utils/             # Validators, CSV export, URL builders
├── views/             # Nunjucks templates
└── styles/            # Tailwind CSS input

test-automation/
└── integration/       # Integration tests (Vitest + API)

public/css/           # Compiled CSS output
dist/                 # Compiled TypeScript
```

## 🛠️ Available Scripts

### Development
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot reload on port 3000 |
| `npm run build` | Production build (TypeScript + CSS) |
| `npm run start` | Start production server from `/dist` |
| `npm run serve` | Full build + start sequence |
| `npm run css:watch` | Watch Tailwind CSS changes |
| `npm run type-check` | TypeScript validation (no compilation) |

### Code Quality
| Command | Purpose |
|---------|---------|
| `npm run check` | ✅ **Run before commits!** Biome format + lint |
| `npm run check:fix` | Auto-fix formatting and linting issues |
| `npm run format` | Format code with Biome |
| `npm run lint` | Lint code with Biome |

### Testing - Unit & Integration
| Command | Purpose |
|---------|---------|
| `npm run test` | Run unit tests in watch mode |
| `npm run test:run` | **Run all unit tests once** (271 tests) |
| `npm run test:coverage` | Generate coverage report (80%+ coverage) |
| `npm run test:integration` | **Run integration tests** (14 tests) |

### Testing - Reports & All Tests
| Command | Purpose |
|---------|---------|
| `npm run test:all` | **Run unit tests + generate combined report** |
| `npm run test:report` | Generate aggregated HTML test report |

---

### 🎯 **Quick Test Commands**

```bash
# 1. Unit Tests (fastest - 1-2 seconds)
npm run test:run

# 2. Integration Tests (API tests - 1-2 seconds)
npm run test:integration

# 3. View Combined Report
npm run test:report
open test-results/test-report.html
```

## 🔧 Quick Start
```bash
npm install
npm run dev           # Start local server
npm run test          # Run tests
npm run check         # Pre-commit checks
```

## 🏗️ Tech Stack

**Runtime & Language**: Node.js 18+, TypeScript 5.9+ (strict mode)
**Framework**: Express 5.1+, Nunjucks templates
**Frontend**: Tailwind CSS 4, DaisyUI 5.1, Lucide icons
**API**: Axios 1.12, Express Session
**Testing**: Vitest (242 tests, 80%+ coverage)
**Quality**: Biome (formatter/linter), ES Modules

## 📋 Key Features by Section

### Authentication
- Email/password login and registration
- Session-based role management (Admin/Applicant)
- Personalized success messages
- Password strength validation
- Secure HTTP-only cookies

### Job Roles (Public)
- Browse job listings with status badges
- View role details with requirements
- Apply for open positions
- Responsive card layout with animations

### Job Roles (Admin)
- Create, edit, delete job roles
- Manage role status (Open/Closed)
- CSV export for reports
- Form validation with clear errors

### Applications & Applicants
- Submit applications with file uploads (PDF, DOC, DOCX)
- View applicant list with pagination
- Download resumes and read cover letters
- Status tracking with color-coded badges

## ✅ Testing Framework

### Test Suite
The project uses **Vitest** for both unit and integration testing with comprehensive coverage:

#### 1. **Unit Tests** (TypeScript/Vitest)
- Component and function-level testing
- Fast, isolated, focused on logic
- 257 tests covering controllers, services, and utilities
- Coverage tracking via V8
- Run: `npm run test:run`

#### 2. **Integration Tests** (TypeScript/Vitest)
- Real HTTP request testing against running server
- Login workflow validation (valid/invalid/validation scenarios)
- Health checks and error handling
- 14 tests covering critical API flows
- Run: `npm run test:integration`

### 📊 **Test Summary**

| Test Type | Count | Speed | Command |
|-----------|-------|-------|---------|
| **Unit Tests** | 257 ✅ | ~1s | `npm run test:run` |
| **Integration Tests** | 14 ✅ | ~1s | `npm run test:run` |
| **TOTAL** | **271** | ~2s | `npm run test:run` |

**Pass Rate: 100%** 🎉

### ✅ Code Quality

### Pre-Commit Checklist
- `npm run type-check` → No TypeScript errors
- `npm run check` → Biome formatting & linting passes
- `npm run test:run` → All tests pass

### Guidelines
- MVC architecture (Controllers → Services → Models)
- Dependency injection for testability
- Named exports (ES modules)
- No `any` types (TypeScript strict mode)
- Try/catch error handling in controllers
- 80%+ coverage target for new code

## 📚 Documentation
- `.github/instructions/` - Project standards & guidelines
  - `testing.instructions.md` - Comprehensive testing framework guide
  - `feature-implementation.instructions.md` - Feature development standards
  - `code_quality.instructions.md` - Code quality requirements
  - `dependency_management.instructions.md` - Dependency troubleshooting
- `docs/axios-usage-example.md` - API integration examples
- `spec/` - Feature specification documents

## 🔐 Environment Setup

Backend API runs on `http://localhost:8000/api`
Frontend dev server runs on `http://localhost:3000`

Add `.env` if needed for custom API endpoints:
```
API_BASE_URL=http://localhost:8000
```

## 📝 License
Kainos 2025


---

### 1. 🧪 **Unit Tests (Vitest)**
Fast, isolated component and service testing with 80%+ code coverage.

```bash
# Run all unit tests once
npm run test:run

# Run tests in watch mode (auto-rerun on changes)
npm run test

# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/index.html
```

**Coverage**: 271 tests passing | 80%+ code coverage
**Speed**: ~2 seconds
**Location**: `src/**/*.test.ts`

---

### 2. 🔗 **Integration Tests (Vitest)**
API integration tests for backend communication and workflow validation.

```bash
# Run integration tests
npm run test:integration

# Run in watch mode
npm run test:integration:watch

# Run with UI dashboard
npm run test:integration:ui
```

**Coverage**: 14 tests passing
**Speed**: ~1-2 seconds
**Location**: `test-automation/integration/*.test.ts`

---

```bash
# Run all compatibility tests (all browsers)
npm run test:compatibility

# Run specific browser
npm run test:compatibility:chromium
npm run test:compatibility:firefox
npm run test:compatibility:webkit
```

**Coverage**: 11 tests across browsers, viewports, and features
**Tests include**:
- ✅ Desktop browsers (Chrome, Firefox, Safari)
- ✅ Mobile viewports (iPhone, Android, iPad)
- ✅ Screen resolutions (1366x768, 1920x1080, 2560x1440)
- ✅ JavaScript features compatibility
- ✅ Form input handling
- ✅ Navigation (back/forward)
- ✅ Performance (page load times)

**Location**: `test-automation/e2e/playwright/compatibility.spec.ts`

---

### 5. 🌐 **Compatibility Tests** (Playwright)
Cross-browser and multi-device compatibility validation with realistic tests.

```bash
# Run all compatibility tests (all browsers)
npm run test:compatibility

# Run specific browser
npm run test:compatibility:chromium
npm run test:compatibility:firefox
npm run test:compatibility:webkit
```

**Coverage**: 11 tests across browsers, viewports, and features
**Tests include**:
- ✅ Desktop browsers (Chrome, Firefox, Safari)
- ✅ Mobile viewports (iPhone, Android, iPad)
- ✅ Screen resolutions (1366x768, 1920x1080, 2560x1440)
- ✅ Navigation compatibility
- ✅ Performance (page load times)

**Location**: `test-automation/e2e/playwright/compatibility.spec.ts`

---

### 🎯 **All Tests at Once**

```bash
# Run unit tests + generate combined report
npm run test:all

# Generate test report from existing results
npm run test:report

# View the combined HTML report
open test-results/test-report.html
```

The test report aggregates results from **all test frameworks** (Playwright, Vitest, Cucumber) into a single HTML dashboard.

---

### 📊 **Test Summary**

| Test Type | Count | Speed | Command |
|-----------|-------|-------|---------|
| **Unit** | 271 ✅ | ~2s | `npm run test:run` |
| **Integration** | 14 ✅ | ~1.3s | `npm run test:integration` |
| **E2E (Playwright)** | 6 ✅ | ~20s | `npm run test:playwright` |
| **BDD (Cucumber)** | 13 ✅ | ~8s | `npm run test:e2e` |
| **Compatibility** | 11 ✅ | ~1min | `npm run test:compatibility` |
| **TOTAL** | **315+** | ~3min | Various |

**Pass Rate: 100%** 🎉

---

### 🛠️ **Testing Best Practices**

#### Page Object Model (POM)
All E2E and BDD tests use POM for maintainability:

```typescript
// Page Object Example
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email'); // Semantic!
  }
  
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

#### Locator Priority (Best → Worst)
```typescript
// 1️⃣ BEST: Test IDs
page.locator('[data-testid="submit"]')

// 2️⃣ EXCELLENT: Semantic roles
page.getByRole('button', { name: 'Submit' })
page.getByLabel('Email')

// 3️⃣ GOOD: Text content
page.getByText('Submit')

// 4️⃣ AVOID: CSS selectors
page.locator('div > button:nth-child(2)') // ❌ Brittle!
```

#### Before/After Hooks
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    await page.screenshot({ 
      path: `test-results/failure-${testInfo.title}.png` 
    });
  }
});
```

---

### 🐛 **Troubleshooting**

| Issue | Solution |
|-------|----------|
| Browsers missing | `npm run install-browsers` |
| Tests timing out | Check server running on port 3000 |
| Cucumber steps undefined | Check imports use `.ts` extension |
| Element not clickable | Use `scrollIntoViewIfNeeded()` or `{ force: true }` |
| Flaky tests | Add proper waits (`waitForLoadState`, `waitForSelector`) |
| Screenshots missing | Check `test-results/` directory |

---

### 📁 **Test Artifacts** (Gitignored)

All test outputs are automatically ignored:
```
test-results/          # Test reports, screenshots, videos
playwright-report/     # Playwright HTML reports
coverage/              # Coverage reports
e2e/                   # Temporary E2E artifacts
*.png, *.webm, *.mp4   # Screenshots and videos
```

---
- `job-app.feature` - General app features
- `login.feature` - Authentication scenarios

#### 4. **Integration Tests** (TypeScript/Vitest)
- Real HTTP request testing against running server
- Login workflow validation (valid/invalid/validation scenarios)
- Health checks and error handling
- Run: `npm run test:integration`

**Quick Start:**
```bash
# Run all integration tests once
npm run test:integration

# Run in watch mode (auto-rerun on changes)
npm run test:integration:watch

# Run with UI dashboard
npm run test:integration:ui

# Run specific test file
vitest run test-automation/integration/login.integration.test.ts
```

**Test Files** (`test-automation/integration/`):
- `login.integration.test.ts` - Comprehensive login testing
  - Health checks and server connectivity
  - Valid login with correct credentials
  - Invalid login rejection
  - Input validation (empty fields, invalid email)
  - Response format and status code verification

**Test Coverage:**
- ✅ Health check validation
- ✅ Valid login with real credentials
- ✅ Invalid credentials rejection
- ✅ Empty field validation
- ✅ Email format validation
- ✅ Status code verification (2xx, 3xx, 4xx)
- ✅ Response time performance

**Prerequisites:**
- Frontend server running: `npm run dev`
- Valid test user in backend: `jimbob@example.com` / `JimBob123!`
- Backend API running (recommended)

**Configuration:**
Edit test file to customize:
- `BASE_URL`: http://localhost:3000
- `VALID_EMAIL`: jimbob@example.com
- `VALID_PASSWORD`: JimBob123!

**Documentation:** See [`test-automation/integration/README.md`](test-automation/integration/README.md) for detailed usage

### 📊 Test Reports

Automatic test reports are generated after every test run, aggregating results from all frameworks.

**Generate Report:**
```bash
# Run all tests and generate report
npm run test:all

# Generate report from existing results
npm run test:report

# Open report in browser
open test-results/test-report.html
```

**Report Contents:**
- ✅ **Executive Summary**: Total tests, pass rate, failures at a glance
- 🎭 **Playwright Results**: E2E tests with browser type, duration, and errors
- ⚡ **Vitest Results**: Unit test details by file with stack traces
- 🥒 **Cucumber Results**: BDD scenarios with step-level breakdowns
- 📈 **Performance Metrics**: Test duration, execution times per framework
- 🎨 **Visual Design**: Color-coded status, responsive layout, professional formatting

**Report Location**: `test-results/test-report.html`

**Features:**
- Automatically aggregates results from Playwright, Vitest, and Cucumber
- Color-coded status badges (green ✓, red ✗, yellow ⏭)
- Sortable test tables with error messages
- Pass rate calculation and trend tracking
- Mobile-responsive design
- No external dependencies (pure HTML/CSS)

**CI/CD Integration:**
Archive and display reports in your pipeline:
```yaml
- run: npm run test:all
- uses: actions/upload-artifact@v3
  with:
    name: test-report
    path: test-results/test-report.html
```

See [TEST_REPORT.md](docs/TEST_REPORT.md) for detailed documentation.

### Test Directory Structure
```
test-automation/
├── e2e/                        # End-to-End Tests
│   ├── playwright/             # Direct Playwright tests
│   │   ├── auth-flow.spec.ts
│   │   ├── view-job-listings.spec.ts
│   │   ├── job-application.spec.ts
│   │   └── minimal-test.spec.ts
│   └── pages/                  # Page Object Models
│       ├── JobAppPage.ts
│       └── LoginPage.ts
│
├── bdd/                        # Behavior-Driven Development
│   ├── features/               # Gherkin scenarios
│   │   ├── view-jobs.feature
│   │   ├── apply-jobs.feature
│   │   ├── job-app.feature
│   │   └── login.feature
│   └── steps/                  # Step implementations
│       ├── job-app.steps.ts
│       ├── job-browsing.steps.ts
│       └── login.steps.ts
│
└── support/                    # Shared infrastructure
    ├── hooks.ts                # Setup/teardown
    └── world.ts                # Cucumber context
```

### How to Run Tests

**Prerequisites:** Start dev server first
```bash
npm run dev    # Runs on http://localhost:3000
```

**Playwright Tests**
```bash
# All Playwright tests
npx playwright test test-automation/e2e/playwright/

# Single test file
npx playwright test test-automation/e2e/playwright/auth-flow.spec.ts

# Headed mode (see browser)
npx playwright test --headed

# View HTML report
npx playwright show-report
```

**Cucumber/BDD Tests**
```bash
# All scenarios
npm run test:e2e

# By tag (smoke tests)
npm run test:e2e:tags "@smoke"

# Critical path tests
npm run test:e2e:tags "@critical"

# Parallel execution
npm run test:e2e:parallel
```

**Unit Tests**
```bash
npm run test         # Interactive watch mode
npm run test:run     # Run once
npm run test:coverage  # With coverage report
```

### Test Tags
Tests are organized with tags for easy filtering:
- `@smoke` - Basic functionality
- `@critical` - Core user journeys
- `@interaction` - User interactions
- `@ui` - UI/layout verification
- `@responsive` - Responsive design
- `@negative` - Error scenarios
- `@data` - Data validation

### Test Results
```
Playwright Tests:    13/13 PASSING ✅
Cucumber Tests:      14/38 PASSING (36%)
Unit Tests:          240+ PASSING ✅
Overall Coverage:    ~70% of critical paths
```

## ✅ Code Quality

### Pre-Commit Checklist
- `npm run type-check` → No TypeScript errors
- `npm run check` → Biome formatting & linting passes
- `npm run test:run` → All tests pass

### Guidelines
- MVC architecture (Controllers → Services → Models)
- Dependency injection for testability
- Named exports (ES modules)
- No `any` types (TypeScript strict mode)
- Try/catch error handling in controllers
- 80%+ coverage target for new code

## 📚 Documentation
- `.github/instructions/` - Project standards & guidelines
  - `testing.instructions.md` - Comprehensive testing framework guide
  - `feature-implementation.instructions.md` - Feature development standards
  - `code_quality.instructions.md` - Code quality requirements
  - `dependency_management.instructions.md` - Dependency troubleshooting
- `docs/axios-usage-example.md` - API integration examples
- `spec/` - Feature specification documents
- `TEST_AUTOMATION_STRUCTURE.sh` - Detailed testing guide

## 🔐 Environment Setup

Backend API runs on `http://localhost:8000/api`
Frontend dev server runs on `http://localhost:3000`

Add `.env` if needed for custom API endpoints:
```
API_BASE_URL=http://localhost:8000
```

## 📝 License
Kainos 2025
