# Example Test Reports

This document shows example output from the test reporting system.

## Example 1: All Tests Passing

### Console Output

```
╔════════════════════════════════════════════════════════════════════╗
║                       TEST REPORT SUMMARY                          ║
╚════════════════════════════════════════════════════════════════════╝

Date: 11/6/2025, 10:30:15 AM
Build: #42

┌────────────────────────────────────────────────────────────────────┐
│ OVERALL STATUS                                                     │
└────────────────────────────────────────────────────────────────────┘
Status: ✅ PASSED

┌────────────────────────────────────────────────────────────────────┐
│ UNIT TESTS (Vitest)                                                │
└────────────────────────────────────────────────────────────────────┘
Status: ✅ PASSED
Total: 142 | Passed: 142 | Failed: 0 | Skipped: 1
Pass Rate: 99%
Duration: 45.2s

Coverage:
  Lines:      84.3%
  Branches:   81.2%
  Functions:  86.5%
  Statements: 84.1%

┌────────────────────────────────────────────────────────────────────┐
│ E2E TESTS (Playwright)                                             │
└────────────────────────────────────────────────────────────────────┘
Status: ✅ PASSED
Total: 25 | Passed: 25 | Failed: 0 | Skipped: 0
Pass Rate: 100%
Duration: 156.8s

╔════════════════════════════════════════════════════════════════════╗
║ For detailed reports:                                              ║
║   Unit Tests: open coverage/index.html                             ║
║   E2E Tests:  npm run test:e2e:report                              ║
╚════════════════════════════════════════════════════════════════════╝

✅ Reports saved to: reports/
   - test-report-2025-11-06T10-30-15-123Z.txt
   - test-report-2025-11-06T10-30-15-123Z.json
```

### Saved Text File: `reports/test-report-latest.txt`

```
╔════════════════════════════════════════════════════════════════════╗
║                       TEST REPORT SUMMARY                          ║
╚════════════════════════════════════════════════════════════════════╝

Date: 11/6/2025, 10:30:15 AM
Build: #42

┌────────────────────────────────────────────────────────────────────┐
│ OVERALL STATUS                                                     │
└────────────────────────────────────────────────────────────────────┘
Status: ✅ PASSED

┌────────────────────────────────────────────────────────────────────┐
│ UNIT TESTS (Vitest)                                                │
└────────────────────────────────────────────────────────────────────┘
Status: ✅ PASSED
Total: 142 | Passed: 142 | Failed: 0 | Skipped: 1
Pass Rate: 99%
Duration: 45.2s

Coverage:
  Lines:      84.3%
  Branches:   81.2%
  Functions:  86.5%
  Statements: 84.1%

┌────────────────────────────────────────────────────────────────────┐
│ E2E TESTS (Playwright)                                             │
└────────────────────────────────────────────────────────────────────┘
Status: ✅ PASSED
Total: 25 | Passed: 25 | Failed: 0 | Skipped: 0
Pass Rate: 100%
Duration: 156.8s

╔════════════════════════════════════════════════════════════════════╗
║ For detailed reports:                                              ║
║   Unit Tests: open coverage/index.html                             ║
║   E2E Tests:  npm run test:e2e:report                              ║
╚════════════════════════════════════════════════════════════════════╝
```

### JSON File: `reports/test-report-latest.json`

```json
{
  "timestamp": "2025-11-06T10:30:15.123Z",
  "buildNumber": "42",
  "unitTests": {
    "total": 142,
    "passed": 142,
    "failed": 0,
    "skipped": 1,
    "duration": 45200,
    "results": [],
    "coverage": {
      "lines": 84,
      "branches": 81,
      "functions": 86,
      "statements": 84
    }
  },
  "e2eTests": {
    "total": 25,
    "passed": 25,
    "failed": 0,
    "skipped": 0,
    "duration": 156800,
    "results": []
  }
}
```

---

## Example 2: Some Tests Failing

### Console Output

```
╔════════════════════════════════════════════════════════════════════╗
║                       TEST REPORT SUMMARY                          ║
╚════════════════════════════════════════════════════════════════════╝

Date: 11/6/2025, 11:15:32 AM
Build: #43

┌────────────────────────────────────────────────────────────────────┐
│ OVERALL STATUS                                                     │
└────────────────────────────────────────────────────────────────────┘
Status: ❌ FAILED

┌────────────────────────────────────────────────────────────────────┐
│ UNIT TESTS (Vitest)                                                │
└────────────────────────────────────────────────────────────────────┘
Status: ❌ FAILED
Total: 145 | Passed: 142 | Failed: 2 | Skipped: 1
Pass Rate: 97%
Duration: 47.8s

Coverage:
  Lines:      82.1%
  Branches:   79.5%
  Functions:  84.2%
  Statements: 82.0%

┌────────────────────────────────────────────────────────────────────┐
│ FAILED UNIT TESTS (2)                                              │
└────────────────────────────────────────────────────────────────────┘

1. JobRoleController.updateJobRole()
   Location: src/controllers/job-role-controller.test.ts:156
   Duration: 234ms
   Error: Expected 200, got 500

2. LoginValidator.validateEmail()
   Location: src/validators/login-validator.test.ts:89
   Duration: 5012ms
   Error: Assertion timeout after 5000ms

┌────────────────────────────────────────────────────────────────────┐
│ E2E TESTS (Playwright)                                             │
└────────────────────────────────────────────────────────────────────┘
Status: ✅ PASSED
Total: 24 | Passed: 24 | Failed: 0 | Skipped: 1
Pass Rate: 100%
Duration: 152.3s

╔════════════════════════════════════════════════════════════════════╗
║ For detailed reports:                                              ║
║   Unit Tests: open coverage/index.html                             ║
║   E2E Tests:  npm run test:e2e:report                              ║
╚════════════════════════════════════════════════════════════════════╝

⚠️  Reports saved to: reports/
   - test-report-2025-11-06T11-15-32-456Z.txt
   - test-report-2025-11-06T11-15-32-456Z.json
```

### JSON File Showing Failures

```json
{
  "timestamp": "2025-11-06T11:15:32.456Z",
  "buildNumber": "43",
  "unitTests": {
    "total": 145,
    "passed": 142,
    "failed": 2,
    "skipped": 1,
    "duration": 47800,
    "coverage": {
      "lines": 82,
      "branches": 79,
      "functions": 84,
      "statements": 82
    },
    "results": [
      {
        "name": "JobRoleController.updateJobRole()",
        "state": "failed",
        "duration": 234,
        "location": "src/controllers/job-role-controller.test.ts:156",
        "error": "Expected 200, got 500"
      },
      {
        "name": "LoginValidator.validateEmail()",
        "state": "failed",
        "duration": 5012,
        "location": "src/validators/login-validator.test.ts:89",
        "error": "Assertion timeout after 5000ms"
      }
    ]
  },
  "e2eTests": {
    "total": 24,
    "passed": 24,
    "failed": 0,
    "skipped": 1,
    "duration": 152300,
    "results": []
  }
}
```

---

## Example 3: Coverage Declining

### Comparing Two Reports

#### Build #42 (Previous - ✅ Good)
```json
"coverage": {
  "lines": 84,
  "branches": 81,
  "functions": 86,
  "statements": 84
}
```

#### Build #44 (Current - ⚠️ Declining)
```json
"coverage": {
  "lines": 78,
  "branches": 76,
  "functions": 81,
  "statements": 78
}
```

**Trend Analysis:**
- Lines coverage: 84% → 78% (⬇️ -6%)
- Branches coverage: 81% → 76% (⬇️ -5%)
- Functions coverage: 86% → 81% (⬇️ -5%)
- Statements coverage: 84% → 78% (⬇️ -6%)

**Action Required:** Coverage has dropped significantly. New code added without proper test coverage.

---

## Example 4: Performance Regression

### Build #50 Report

```
Duration: 67.3s  (Previous: 45.2s)  [⬆️ +22.1s slower]

E2E Tests:
  Total: 25 | Duration: 189.2s  (Previous: 156.8s)  [⬆️ +32.4s slower]
```

**Indicators:**
- Tests are taking 22 seconds longer than before
- E2E tests specifically are 32 seconds slower
- Likely causes:
  - New tests added
  - Tests with increased setup/teardown
  - Timeout waiting for resources
  - Performance regression in code

---

## Example 5: CSV Export from JSON

### Processing Reports Programmatically

```bash
# Extract key metrics from JSON reports
jq '.unitTests | {timestamp, passed, failed, lines: .coverage.lines, branches: .coverage.branches}' \
  reports/test-report-latest.json

# Output:
# {
#   "timestamp": "2025-11-06T10:30:15.123Z",
#   "passed": 142,
#   "failed": 0,
#   "lines": 84,
#   "branches": 81
# }
```

### Tracking Trends Over Time

```bash
# Create CSV from multiple reports
echo "timestamp,passed,failed,coverage_lines" > coverage-trend.csv

for report in reports/test-report-*.json; do
  jq -r '[.timestamp, .unitTests.passed, .unitTests.failed, .unitTests.coverage.lines] | @csv' "$report" \
    >> coverage-trend.csv
done

# Result:
# timestamp,passed,failed,coverage_lines
# "2025-11-06T10:30:15.123Z",142,0,84
# "2025-11-06T11:15:32.456Z",142,2,82
# "2025-11-06T12:00:00.789Z",145,0,85
```

---

## Example 6: CI/CD Integration

### GitHub Actions Artifact

```yaml
- name: Upload Test Reports
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: test-reports-${{ github.run_number }}
    path: reports/
```

### Accessing Reports

The report files become available as downloadable artifacts:
```
test-reports-123/
├── test-report-latest.txt
├── test-report-latest.json
├── test-report-2025-11-06T10-30-15-123Z.txt
└── test-report-2025-11-06T10-30-15-123Z.json
```

---

## Example 7: Full Report with Details

### With Failed Tests Details

```
╔════════════════════════════════════════════════════════════════════╗
║                       TEST REPORT SUMMARY                          ║
╚════════════════════════════════════════════════════════════════════╝

Date: 11/7/2025, 09:45:22 AM
Build: #445

OVERALL STATUS: ❌ FAILED

UNIT TESTS (Vitest):
  Status: ❌ FAILED
  Total: 150 | Passed: 147 | Failed: 3 | Skipped: 0
  Pass Rate: 98%
  Duration: 52.3s
  Coverage: Lines: 83%, Branches: 80%, Functions: 85%, Statements: 83%

FAILED TESTS (3):

1. ApplicationController.submitApplication()
   Location: src/controllers/application-controller.test.ts:234
   Duration: 145ms
   Error: AssertionError: expected Promise to be resolved, got rejection
   
2. JobRoleService.filterByDepartment()
   Location: src/services/job-role-service.test.ts:89
   Duration: 1230ms
   Error: TypeError: Cannot read property 'id' of undefined
   
3. UserValidator.validatePhoneNumber()
   Location: src/validators/user-validator.test.ts:156
   Duration: 5123ms
   Error: Timeout: test did not complete within 5000ms

E2E TESTS (Playwright):
  Status: ✅ PASSED
  Total: 26 | Passed: 26 | Failed: 0 | Skipped: 0
  Pass Rate: 100%
  Duration: 168.9s

RECOMMENDATIONS:
- 🔧 Fix ApplicationController rejection handling (HIGH PRIORITY)
- 🔧 Check JobRoleService for null reference issue (HIGH PRIORITY)
- 🐢 Investigate UserValidator performance (MEDIUM PRIORITY)
```

---

## Report Usage Examples

### View Latest Report
```bash
npm run report:view
```

### Check If Tests Passed
```bash
if [ -f "reports/test-report-latest.json" ]; then
  status=$(jq -r '.unitTests' reports/test-report-latest.json)
  if [ "$status.failed" -gt 0 ]; then
    echo "❌ Tests failed"
    exit 1
  fi
fi
```

### Send Report to Slack
```bash
# Extract summary and send to Slack webhook
cat reports/test-report-latest.txt | \
  curl -X POST -H 'Content-type: application/json' \
  --data-binary @- $SLACK_WEBHOOK_URL
```

### Archive Report
```bash
# Save report to archive
mkdir -p archive/$(date +%Y-%m-%d)
cp reports/test-report-latest.* archive/$(date +%Y-%m-%d)/
```

---

These examples show the variety of report outputs and how they can be used in different scenarios. The reports provide actionable insights into test status, coverage, and performance!
