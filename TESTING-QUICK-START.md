# Test Report System - Setup & Quick Start Guide

## What Is This System?

The **Test Report System** automatically generates detailed, professional test reports after every test run. It provides:

- 📊 **Coverage metrics** (lines, branches, functions, statements)
- ✅ **Pass/fail statistics** with trends
- ⏱️ **Performance metrics** (test duration)
- 🐛 **Failed test details** with error messages
- 📄 **Multiple formats**: Human-readable text + machine-readable JSON

## Quick Start (5 Minutes)

### 1. Initialize the System

```bash
npm run report:init
```

This creates the necessary directories:
- `test-results/` - Stores test execution data
- `reports/` - Stores generated reports

### 2. Run Tests and Generate Report

```bash
# Unit tests with report
npm run test:run

# Or with coverage
npm run test:coverage
```

### 3. View the Report

```bash
npm run report:view
```

Or open the file directly:
```bash
cat reports/test-report-latest.txt
```

## What You'll See

After running tests, you'll see output like:

```
╔════════════════════════════════════════════════════════════════════╗
║                       TEST REPORT SUMMARY                          ║
╚════════════════════════════════════════════════════════════════════╝

Date: 11/6/2025, 10:30:00 AM
Build: #42

OVERALL STATUS: ✅ PASSED

UNIT TESTS (Vitest):
  Status: ✅ PASSED
  Total: 142 | Passed: 142 | Failed: 0 | Skipped: 1
  Pass Rate: 99%
  Duration: 45.2s

  Coverage:
    Lines:      84.3%
    Branches:   81.2%
    Functions:  86.5%
    Statements: 84.1%

E2E TESTS (Playwright):
  Status: ✅ PASSED
  Total: 25 | Passed: 25 | Failed: 0 | Skipped: 0
  Pass Rate: 100%
  Duration: 156.8s

✅ Reports saved to: reports/
```

## Key Scripts

### Test Commands (with auto-report)

```bash
npm run test:run              # Unit tests + report
npm run test:coverage        # Unit tests + coverage + report
npm run test:e2e             # E2E tests + report
npm run test:e2e:headed      # E2E tests (headed mode) + report
npm run test:e2e:chrome      # E2E tests (Chrome only) + report
```

### Report Commands

```bash
npm run report:generate      # Generate report manually
npm run report:view          # View latest report in terminal
npm run report:init          # Initialize reporting system
```

## Report Files

All reports are saved to `reports/`:

```
reports/
├── test-report-latest.txt           # Latest text report (always current)
├── test-report-latest.json          # Latest JSON report (always current)
├── test-report-2025-11-06T10-30-00.txt    # Timestamped text report
└── test-report-2025-11-06T10-30-00.json   # Timestamped JSON report
```

**Always check `test-report-latest.*` for the most recent results.**

## Understanding the Report

### Status Indicators

- ✅ **PASSED** - All tests passed
- ❌ **FAILED** - One or more tests failed
- ⚠️ **PARTIAL** - Some tests failed

### Coverage Breakdown

| Metric | What It Means | Target |
|--------|--------------|--------|
| **Lines** | % of code lines executed | 80%+ |
| **Branches** | % of if/else paths tested | 80%+ |
| **Functions** | % of functions called | 80%+ |
| **Statements** | % of statements executed | 80%+ |

> Higher coverage = more confidence in tests

### Pass Rate

```
Pass Rate = (Passed Tests ÷ Total Tests) × 100%
```

Example:
- 142 passed, 0 failed, 1 skipped = **142/143 = 99%**

## Troubleshooting

### "Reports directory not found"

**Solution:**
```bash
npm run report:init
```

### "No test results found"

**Make sure:**
1. Tests actually ran (no compile errors)
2. You used `npm run test:run` (not just `npm test`)
3. Check terminal output for test errors

### "Coverage shows 0%"

**Solution:**
```bash
npm run test:coverage    # Must use :coverage variant
```

### "Report won't generate"

**Checklist:**
- [ ] `scripts/generate-test-report.ts` exists
- [ ] `test-results/` directory exists
- [ ] `reports/` directory exists
- [ ] Tests completed without crashing

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests & Reports
on: [push, pull_request]

jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run report:init
      - run: npm run test:coverage
      - run: npm run test:e2e
      
      - name: Upload Reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: reports/
```

### Using Build Numbers

Track builds by setting an environment variable:

```bash
export BUILD_NUMBER=42
npm run test:run
# Report will show: Build: #42
```

Or in CI/CD:

```bash
npm run test:run  # Uses CI's build number if available
```

## Advanced Usage

### View JSON Report Programmatically

```bash
cat reports/test-report-latest.json | jq .
```

### Create Custom Scripts

Example: Fail CI if coverage drops below 80%

```bash
#!/bin/bash
COVERAGE=$(jq '.unitTests.coverage.lines' reports/test-report-latest.json)
if [ "$COVERAGE" -lt 80 ]; then
  echo "Coverage too low: $COVERAGE%"
  exit 1
fi
```

### Archive Reports

```bash
# Save reports by date
cp reports/test-report-latest.* archive/reports-$(date +%Y-%m-%d)/
```

## Best Practices

1. ✅ **Always check reports after tests** - Don't ignore failures
2. ✅ **Monitor coverage trends** - Ensure coverage doesn't decrease
3. ✅ **Archive important reports** - Keep historical data
4. ✅ **Share reports in PRs** - Help reviewers understand test status
5. ✅ **Act on failures** - Fix failing tests immediately

## Example Workflow

### Before Committing:

```bash
# 1. Run all tests
npm run test:coverage

# 2. Check report
npm run report:view

# 3. If all pass, commit
git add .
git commit -m "Add feature X with full test coverage"
```

### In a PR:

1. Tests run automatically via CI
2. Reports are generated and uploaded as artifacts
3. Reviewers can download reports to verify test status
4. Approval requires all tests passing

## File Structure

```
project-root/
├── scripts/
│   ├── generate-test-report.ts    # Report generator
│   ├── init-reporting.ts          # Setup script
│   └── TEST-REPORT-README.md      # Full documentation
├── test-results/                  # Test data (auto-generated)
│   └── .gitkeep
├── reports/                       # Generated reports
│   ├── .gitkeep
│   ├── test-report-latest.txt
│   ├── test-report-latest.json
│   └── test-report-[timestamp].*
├── vitest.config.ts              # Unit test config
├── playwright.config.ts          # E2E test config
└── package.json                  # Scripts defined here
```

## Customization

### Change Report Location

Edit `scripts/generate-test-report.ts`:

```typescript
const reportsDir = path.join(__dirname, "../my-custom-reports");
```

### Add Custom Metrics

Add to the `generateReport()` function:

```typescript
const avgTestDuration = unitData.duration / unitData.total;
report += `\nAverage test duration: ${avgTestDuration.toFixed(0)}ms\n`;
```

### Modify Report Format

Edit the report template in `generateReport()` function.

## Support & Documentation

- **Full documentation**: `scripts/TEST-REPORT-README.md`
- **Testing best practices**: `.github/instructions/testing-framework.instructions.md`
- **Report structure**: This guide

## Next Steps

1. ✅ Run `npm run report:init` to set up
2. ✅ Run `npm run test:run` to generate first report
3. ✅ Run `npm run report:view` to see results
4. ✅ Read `scripts/TEST-REPORT-README.md` for full docs
5. ✅ Integrate into your CI/CD pipeline

---

**Happy testing! 🚀**
