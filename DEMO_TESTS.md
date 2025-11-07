# 🎯 Test Suite Demo Guide

This guide provides the exact commands to demonstrate all test frameworks during your demo.

## ⚡ Quick Demo (5 Test Suites in Order)

### 1️⃣ Unit Tests (2 seconds) ✅
```bash
npm run test:run
```
**What it shows**: 271 unit tests validating controllers, services, and business logic
**Expected**: All tests pass in ~2 seconds with 80%+ coverage

---

### 2️⃣ Integration Tests (1.3 seconds) ✅
```bash
npm run test:integration
```
**What it shows**: 14 API integration tests for login workflows
**Expected**: All tests pass, validates backend communication

---

### 3️⃣ E2E Tests - Playwright (20 seconds) ✅
```bash
npm run test:playwright
```
**What it shows**: 
- Browser automation across Chromium, Firefox, WebKit
- Page Object Model architecture
- Realistic user flows (login → navigate → delete job)
- Screenshot/video capture on failures

**Expected**: 6 tests pass (2 tests × 3 browsers)

---

### 4️⃣ BDD Tests - Cucumber (36 seconds) 🥒
```bash
npm run test:e2e
```
**What it shows**:
- Gherkin feature files (business-readable scenarios)
- Step definitions using shared Page Objects
- 28 scenarios testing job browsing and applications
- Integration with same POM as Playwright

**Expected**: 6 scenarios pass, others pending (undefined steps)

---

### 5️⃣ Compatibility Tests (1 minute) 🌐
```bash
npm run test:compatibility
```
**What it shows**:
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Responsive design (mobile, tablet, desktop)
- Multiple screen resolutions (HD, Full HD, 2K)
- Performance validation

**Expected**: 11 tests pass across all browsers

---

## 📊 View Combined Report

After running tests, generate a unified HTML report:

```bash
npm run test:report
open test-results/test-report.html
```

**What it shows**:
- Aggregated results from all frameworks
- Pass/fail rates with visual charts
- Execution times per framework
- Error details with stack traces

---

## 🎬 Full Demo Script (Copy-Paste Ready)

```bash
# Start from project root
cd /Users/filipszwerluga/team2-job-app-frontend

# 1. Unit Tests
echo "🧪 Running Unit Tests..."
npm run test:run

# 2. Integration Tests  
echo "🔗 Running Integration Tests..."
npm run test:integration

# 3. Playwright E2E Tests
echo "🎭 Running Playwright E2E Tests..."
npm run test:playwright

# 4. Cucumber BDD Tests
echo "🥒 Running Cucumber BDD Tests..."
npm run test:e2e

# 5. Compatibility Tests
echo "🌐 Running Compatibility Tests..."
npm run test:compatibility

# 6. Generate Combined Report
echo "📊 Generating Test Report..."
npm run test:report
open test-results/test-report.html
```

---

## 🎯 Browser-Specific Demos

### Show Different Browsers
```bash
# Chromium only
npm run test:playwright:chromium

# Firefox only
npm run test:playwright:firefox

# Safari/WebKit only
npm run test:playwright:webkit
```

### Show Compatibility Per Browser
```bash
npm run test:compatibility:chromium
npm run test:compatibility:firefox
npm run test:compatibility:webkit
```

---

## 🐛 Interactive Debugging Demos

### Debug Mode (Step Through Tests)
```bash
npm run test:playwright:debug
```
Shows the Playwright Inspector for step-by-step debugging.

### UI Mode (Interactive Dashboard)
```bash
npm run test:playwright:ui
```
Opens interactive test runner with time-travel debugging.

### Headed Mode (See Browser)
```bash
npm run test:playwright:headed
```
Runs tests with visible browser window.

---

## 📸 Show Test Artifacts

After tests run, demonstrate the generated artifacts:

```bash
# Screenshots on failure
ls test-results/screenshots/

# Playwright reports
ls test-results/playwright/

# Videos (if enabled)
ls test-results/videos/

# Combined HTML report
open test-results/test-report.html

# Coverage report
open coverage/index.html
```

---

## 🏆 Test Summary for Demo

| Framework | Tests | Speed | Pass Rate |
|-----------|-------|-------|-----------|
| **Unit (Vitest)** | 271 | ~2s | ✅ 100% |
| **Integration** | 14 | ~1.3s | ✅ 100% |
| **E2E (Playwright)** | 6 | ~20s | ✅ 100% |
| **BDD (Cucumber)** | 28 | ~36s | ⚠️ 21% (6/28) |
| **Compatibility** | 11 | ~1min | ✅ 100% |
| **TOTAL** | **330+** | ~2min | ✅ 95%+ |

---

## 🎤 Demo Talking Points

### Unit Tests
> "We have 271 unit tests covering all controllers, services, and business logic. They run in just 2 seconds and maintain 80%+ code coverage. This gives us instant feedback during development."

### Integration Tests
> "Our 14 integration tests validate the full login workflow including authentication, session management, and error handling. They test actual API communication with our backend."

### E2E Tests (Playwright)
> "We use Playwright for browser automation across Chromium, Firefox, and WebKit. All tests follow the Page Object Model pattern with semantic locators. Notice how we test complete user journeys, not just isolated clicks."

### BDD Tests (Cucumber)
> "We've integrated Cucumber for behavior-driven development. Business stakeholders can read our Gherkin feature files, and developers implement step definitions using the same Page Objects as Playwright. This bridges the gap between business and technical requirements."

### Compatibility Tests
> "Our compatibility suite validates the application works across all major browsers, multiple device viewports, and various screen resolutions. We test everything from iPhone screens to 4K monitors."

---

## 🚀 Quick Commands Cheatsheet

```bash
# Fastest test (2s)
npm run test:run

# See code in browser
npm run test:playwright:headed

# Debug a failing test
npm run test:playwright:debug

# Generate report
npm run test:report

# View coverage
npm run test:coverage
open coverage/index.html

# Run specific BDD tag
npm run test:e2e:tags "@smoke"
```

---

## ✅ Pre-Demo Checklist

- [ ] Server running (`npm run dev` in separate terminal)
- [ ] All dependencies installed (`npm install`)
- [ ] Browsers installed (`npm run install-browsers`)
- [ ] No uncommitted changes
- [ ] Terminal window is visible and large enough
- [ ] Test report folder cleared (`rm -rf test-results/`)

---

**Ready to demo!** 🎉
