#!/bin/bash

# Quick Start Testing Guide
# For Team2 Job App Frontend

cat << 'EOF'

╔═══════════════════════════════════════════════════════════════════════════╗
║                 TESTING AUTOMATION - QUICK START GUIDE                   ║
╚═══════════════════════════════════════════════════════════════════════════╝

📂 TEST STRUCTURE
═══════════════════════════════════════════════════════════════════════════
✅ test-automation/e2e/playwright/    - Direct Playwright tests (4 files)
✅ test-automation/e2e/pages/          - Page objects (2 files)
✅ test-automation/bdd/features/       - Gherkin scenarios (4 files)
✅ test-automation/bdd/steps/          - Step implementations (3 files)
✅ test-automation/support/            - Shared infrastructure
✅ cucumber.js                         - BDD configuration
✅ playwright.config.ts                - Playwright configuration

🚀 QUICK START
═══════════════════════════════════════════════════════════════════════════

1. Install dependencies
   $ npm install

2. Start development server (in another terminal)
   $ npm run dev
   📍 Server will run on http://localhost:3000

3. Run tests (in main terminal)
   
   Option A: Playwright E2E Tests
   $ npx playwright test test-automation/e2e/playwright/
   ⏱️  Takes ~3 seconds, 13 tests
   
   Option B: Cucumber BDD Tests
   $ npm run test:e2e
   ⏱️  Takes ~15 seconds, 28 scenarios
   
   Option C: All Tests
   $ npm run test:run        # Unit tests
   $ npm run test:e2e        # BDD tests
   $ npx playwright test     # E2E tests

4. View reports
   $ npx playwright show-report   # Playwright HTML report

📊 TEST RESULTS
═══════════════════════════════════════════════════════════════════════════
✅ Playwright Tests:      13/13 PASSING
✅ Unit Tests (Vitest):   240+ PASSING
⏳ Cucumber Tests:        36+ steps passing (14/38 steps)

🔍 RUN SPECIFIC TESTS
═══════════════════════════════════════════════════════════════════════════

Playwright - Single test file:
$ npx playwright test test-automation/e2e/playwright/auth-flow.spec.ts

Playwright - Specific test:
$ npx playwright test -g "TC-AUTH-001"

Playwright - Headed mode (see browser):
$ npx playwright test --headed

Cucumber - Smoke tests only:
$ npm run test:e2e:tags "@smoke"

Cucumber - Critical tests:
$ npm run test:e2e:tags "@critical"

Cucumber - View details:
$ npm run test:e2e:debug

📝 TAGS FOR FILTERING
═══════════════════════════════════════════════════════════════════════════
@smoke         - Basic functionality tests
@critical      - Core user journey tests
@interaction   - User interaction tests
@ui            - UI & layout tests
@responsive    - Responsive design tests
@negative      - Error & edge case tests
@data          - Data validation tests

🐛 TROUBLESHOOTING
═══════════════════════════════════════════════════════════════════════════

Q: Tests fail with "Connection refused"?
A: Make sure server is running: npm run dev

Q: Selectors not finding elements?
A: Inspect HTML in browser dev tools
   Update selectors in test files or page objects

Q: Tests timeout?
A: Increase timeout in cucumber.js (default 30s)
   Or playwright.config.ts (default 30s per test)

Q: Port 3000 already in use?
A: Kill existing process: lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill

📚 DOCUMENTATION
═══════════════════════════════════════════════════════════════════════════
Complete guides:
  • TESTING_INTEGRATION_SUMMARY.md  - Full integration report
  • TEST_AUTOMATION_STRUCTURE.sh    - Detailed reference guide
  • README.md                        - Testing section

💡 TEST EXAMPLES
═══════════════════════════════════════════════════════════════════════════

Playwright: auth-flow.spec.ts
  Tests authentication flows
  5 test cases covering login, forms, validation
  Usage: npx playwright test auth-flow.spec.ts

Cucumber: view-jobs.feature
  Tests job browsing and listing
  8 scenarios with different test angles
  Usage: npm run test:e2e:tags "@smoke"

🎯 NEXT STEPS
═══════════════════════════════════════════════════════════════════════════
1. Run tests to verify setup
2. Check test files to understand structure
3. Implement additional step definitions
4. Add more scenario coverage
5. Integrate into CI/CD pipeline

⚙️ ENVIRONMENT VARIABLES
═══════════════════════════════════════════════════════════════════════════
BASE_URL=http://localhost:3000     # Application URL
HEADLESS=true                      # Run headless (true/false)
SLOW_MO=0                          # Slow down by N milliseconds
BROWSER=chromium                   # chromium|firefox|webkit

Example:
$ HEADLESS=false SLOW_MO=500 npm run test:e2e

📞 SUPPORT
═══════════════════════════════════════════════════════════════════════════
See detailed guides:
  • TESTING_INTEGRATION_SUMMARY.md
  • TEST_AUTOMATION_STRUCTURE.sh
  • README.md

═══════════════════════════════════════════════════════════════════════════
Happy Testing! 🎉
═══════════════════════════════════════════════════════════════════════════

EOF
