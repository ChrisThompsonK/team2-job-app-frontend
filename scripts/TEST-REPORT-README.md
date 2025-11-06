# Test Report Generation System

## Overview

This system automatically generates detailed test reports after every test run. Reports are created in both human-readable text format and machine-readable JSON format.

## Features

- ✅ Automatic report generation after unit tests
- ✅ Automatic report generation after E2E tests
- ✅ Comprehensive coverage metrics
- ✅ Failed test details with error messages
- ✅ Formatted, easy-to-read output
- ✅ JSON reports for CI/CD integration
- ✅ Latest report always available for quick access

## Usage

### Run Tests with Automatic Report Generation

```bash
# Unit tests (with report)
npm run test:run

# Unit tests with coverage (with report)
npm run test:coverage

# E2E tests (with report)
npm run test:e2e

# E2E tests in headed mode (with report)
npm run test:e2e:headed

# View the latest report
npm run report:view

# Generate report manually
npm run report:generate
```

## Report Contents

### Text Report Format

The text report includes:

```
╔════════════════════════════════════════════════════════════════════╗
║                       TEST REPORT SUMMARY                          ║
╚════════════════════════════════════════════════════════════════════╝

Date: [Timestamp]
Build: #[Build Number]

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

  [Failed test details if any]
```

### JSON Report Format

Complete structured data:

```json
{
  "timestamp": "2025-11-06T10:30:00.000Z",
  "buildNumber": "42",
  "unitTests": {
    "total": 142,
    "passed": 142,
    "failed": 0,
    "skipped": 1,
    "duration": 45200,
    "coverage": {
      "lines": 84,
      "branches": 81,
      "functions": 86,
      "statements": 84
    },
    "results": []
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

## Report Files Location

All reports are saved to the `reports/` directory:

```
reports/
├── test-report-latest.txt          # Latest text report (always current)
├── test-report-latest.json         # Latest JSON report (always current)
├── test-report-2025-11-06T10-30-00-000Z.txt   # Timestamped text report
└── test-report-2025-11-06T10-30-00-000Z.json  # Timestamped JSON report
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Unit Tests
  run: npm run test:run

- name: Run E2E Tests
  run: npm run test:e2e

- name: Upload Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: test-reports
    path: reports/

- name: View Report
  if: always()
  run: npm run report:view
```

### Using Environment Variables

Set `BUILD_NUMBER` to track builds:

```bash
export BUILD_NUMBER=42
npm run test:run
# Report will show: Build: #42
```

## Understanding the Metrics

### Coverage Metrics

- **Lines**: Percentage of code lines executed
- **Branches**: Percentage of if/else paths tested
- **Functions**: Percentage of functions called during tests
- **Statements**: Percentage of statements executed

> Aim for 80%+ coverage for new code

### Test Status Indicators

- ✅ **PASSED**: All tests passed successfully
- ❌ **FAILED**: One or more tests failed
- ⚠️ **PARTIAL**: Some tests failed but others passed

### Pass Rate Calculation

```
Pass Rate = (Passed Tests / Total Tests) × 100
```

## Troubleshooting

### No Report Generated

**Problem**: Report wasn't created after running tests

**Solutions**:
1. Ensure test-results and coverage directories exist
2. Check that test runners actually executed
3. Try running `npm run report:generate` manually
4. Verify `scripts/generate-test-report.ts` exists

### Missing Coverage Data

**Problem**: Coverage shows 0% for all metrics

**Solutions**:
1. Run `npm run test:coverage` instead of `npm run test:run`
2. Ensure coverage configuration is correct in `vitest.config.ts`
3. Check `coverage/coverage-final.json` exists
4. Verify source files are being instrumented

### Incomplete Test Results

**Problem**: Report shows fewer tests than actually ran

**Solutions**:
1. Check test output files exist:
   - `test-results/summary.json` (unit tests)
   - `test-results/results.json` (E2E tests)
2. Verify test runners are configured to output JSON
3. Check file permissions in test-results directory

## Customization

### Modify Report Format

Edit `scripts/generate-test-report.ts`:

1. **Change output styling**: Modify the `generateReport()` function
2. **Add new metrics**: Update the `ReportData` interface
3. **Change report directory**: Modify the `reportsDir` path

### Add Custom Metrics

Example: Add performance warnings

```typescript
const isPerformanceIssue = unitData.duration > 60000; // > 60 seconds
if (isPerformanceIssue) {
  report += "\n⚠️  PERFORMANCE WARNING: Tests took longer than 60 seconds\n";
}
```

### Change Report Frequency

Modify `package.json` scripts:

```json
"test:run": "vitest run"  // No automatic report
"test:run": "vitest run && npm run report:generate"  // Auto-generate report
```

## Best Practices

1. **Check reports regularly**: Review test trends over time
2. **Act on failures**: Don't ignore failing tests in reports
3. **Monitor coverage**: Ensure coverage doesn't decrease
4. **Archive reports**: Keep historical reports for trend analysis
5. **Share reports**: Include in PR reviews and release notes

## Script Reference

### generate-test-report.ts

**Purpose**: Reads test results and generates formatted reports

**Input Files**:
- `coverage/coverage-final.json` - Coverage metrics
- `test-results/results.json` - Playwright test results
- `test-results/summary.json` - Unit test summary (if available)

**Output Files**:
- `reports/test-report-latest.txt` - Latest text report
- `reports/test-report-latest.json` - Latest JSON report
- `reports/test-report-[timestamp].txt` - Timestamped text report
- `reports/test-report-[timestamp].json` - Timestamped JSON report

**Exit Codes**:
- `0` - All tests passed
- `1` - One or more tests failed

## Future Enhancements

Potential improvements to the reporting system:

- [ ] HTML report generation with charts
- [ ] Historical trend tracking
- [ ] Performance regression detection
- [ ] Email notifications for failures
- [ ] Slack/Teams integration
- [ ] Custom report templates
- [ ] Report archival system
- [ ] Coverage comparison with baseline

---

**Remember**: Good test reports are key to maintaining code quality. Review them regularly and act on the insights they provide.
