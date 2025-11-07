# Test Report Documentation

## Overview

The Test Report feature automatically generates a comprehensive HTML report after every test run, aggregating results from all testing frameworks:
- **Playwright** (E2E tests)
- **Vitest** (Unit tests)
- **Cucumber** (BDD scenarios)

## Report Contents

### 1. **Executive Summary**
- **Total Tests**: Combined count across all frameworks
- **Pass Rate**: Percentage of tests that passed
- **Passed Tests**: Green highlighted count
- **Failed Tests**: Red highlighted count
- **Skipped Tests**: Yellow highlighted count
- **Generated Timestamp**: When the report was created

### 2. **Playwright E2E Tests Section**
Detailed breakdown of browser automation tests:
- Test name and suite
- Execution status (Passed/Failed/Skipped)
- Duration in seconds
- Browser used (Chromium, Firefox, WebKit, Mobile)
- Error messages for failed tests (if available)

**Key Metrics:**
- Number of tests per suite
- Pass rate for E2E tests
- Total execution time

### 3. **Vitest Unit Tests Section**
Comprehensive unit test details:
- Test name and source file
- Execution status (Passed/Failed/Skipped)
- Duration in seconds
- Error stack traces for failures

**Key Metrics:**
- Number of unit tests
- Coverage statistics
- File-level pass rates

### 4. **Cucumber BDD Section**
Business-readable scenario results:
- Feature name
- Scenario name
- Status (Passed/Failed/Skipped)
- Step execution count (Passed/Total)
- Scenario duration
- Step failure details

**Key Metrics:**
- Scenarios by feature
- Step pass rate
- Scenario duration

### 5. **Visual Design**
- Color-coded status badges (green, red, yellow)
- Responsive grid layout (mobile-friendly)
- Professional gradient header
- Easy-to-scan data tables
- Interactive error message expansion

## Usage

### Generate Report After Tests

```bash
# Run all unit tests and generate report
npm run test:all

# Run tests in watch mode with report generation
npm run test:all:watch

# Just generate report from existing results
npm run test:report

# Run specific test type then report
npm run test:run       # Run vitest once
npm run test:report    # Generate report

# Run Playwright tests then report
npx playwright test
npm run test:report
```

### Report Output

**Location**: `test-results/test-report.html`

**Open in Browser**:
```bash
open test-results/test-report.html     # macOS
xdg-open test-results/test-report.html # Linux
start test-results/test-report.html    # Windows
```

## Report Data Sources

The report automatically aggregates data from:

| Framework | Result File | Format |
|-----------|------------|--------|
| Playwright | `test-results/results.json` | JSON (Playwright format) |
| Vitest | `test-results/vitest-results.json` | JUnit/JSON (if configured) |
| Cucumber | `test-results/cucumber-results.json` | JSON (Cucumber format) |

**Note**: If any result files don't exist, that section is skipped in the report.

## Report Features

### ✅ Per-Test Information
- **Test Name**: Descriptive test identifier
- **Status**: Passed/Failed/Skipped with color coding
- **Duration**: Execution time in seconds
- **Error Details**: Stack trace or error message
- **Additional Context**: Browser, file, suite, feature

### ✅ Summary Statistics
- **Pass Rate**: Percentage calculation
- **Test Counts**: By status and framework
- **Execution Time**: Total duration across all tests
- **Framework Breakdown**: Separate stats for each testing tool

### ✅ User Experience
- **Responsive Design**: Works on mobile, tablet, desktop
- **Color Coded**: Red for failures, green for passes, yellow for skips
- **Sortable Data**: View all test details in organized tables
- **Error Expansion**: Click to see full error messages
- **Export Ready**: Standard HTML format (can be archived or emailed)

## Sample Report Structure

```
┌─────────────────────────────────────┐
│     🧪 Test Report Header           │
│  Generated: 2025-11-06T10:30:00Z   │
└─────────────────────────────────────┘

┌─ Summary Cards ────────────────────┐
│ Passed: 45  │ Failed: 2  │ Pass: 96% │
└────────────────────────────────────┘

┌─ Playwright E2E Tests ─────────────┐
│ ✓ Admin can delete job role        │
│ ✓ Admin can navigate to form       │
│ ⏭ Form fill test (skipped)        │
│ ✗ Submit form test (failed)        │
└────────────────────────────────────┘

┌─ Vitest Unit Tests ────────────────┐
│ ✓ calculateTotal returns correct   │
│ ✓ validateEmail works              │
│ ✗ parseDate handles invalid input  │
└────────────────────────────────────┘

┌─ Cucumber BDD Tests ───────────────┐
│ ✓ User can login successfully      │
│ ✓ Admin can manage users           │
└────────────────────────────────────┘
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests with Report

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - run: npm install
      - run: npm run test:all
      
      - name: Upload Test Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-report
          path: test-results/test-report.html
```

### Jenkins Example

```groovy
pipeline {
  stages {
    stage('Test') {
      steps {
        sh 'npm install'
        sh 'npm run test:all'
      }
    }
    
    stage('Archive Report') {
      always {
        archiveArtifacts artifacts: 'test-results/test-report.html'
      }
    }
  }
}
```

## Report Customization

### Modify Report Style

Edit `scripts/generate-test-report.js`:

```javascript
// In generateHTMLReport function, modify CSS
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  // Change these colors to your brand
}
```

### Add Custom Sections

```javascript
// Add new framework section
function generateCustomSection(results) {
  return `
    <div class="section">
      <h2>🔧 Custom Tests</h2>
      <!-- Your HTML here -->
    </div>
  `;
}

// In generateHTMLReport, add:
${generateCustomSection(results)}
```

### Extend Data Collection

```javascript
// In loadTestResults function
results.custom = {
  tests: [],
  summary: { passed: 0, failed: 0, skipped: 0, total: 0 }
};

// Load from custom results file
if (fs.existsSync(CUSTOM_RESULTS)) {
  // Parse and load results
}
```

## Troubleshooting

### Report Not Generating

```bash
# Check if result files exist
ls -la test-results/

# Check if scripts directory exists
ls -la scripts/

# Run with verbose output
node scripts/generate-test-report.js
```

### Missing Test Results

1. Ensure tests are run first: `npm run test:run`
2. Check result file format matches expected JSON structure
3. Verify file paths in `generate-test-report.js`

### Report Not Opening

```bash
# Try different methods
open test-results/test-report.html
python -m http.server 8000  # Serve and open http://localhost:8000/test-results/test-report.html
```

## Best Practices

### 1. **Run Report Generation After All Tests**
```bash
npm run test:all  # Runs tests, then generates report
```

### 2. **Archive Reports for History**
```bash
# Create timestamped backup
cp test-results/test-report.html test-results/report-$(date +%Y%m%d-%H%M%S).html
```

### 3. **Include in CI/CD Pipeline**
- Generate report on every PR
- Archive and display results
- Compare with previous runs

### 4. **Regular Review**
- Check pass rates daily
- Identify flaky tests
- Monitor performance trends

### 5. **Share Results**
- Email HTML report to team
- Host reports on artifact server
- Display in project dashboard

## Performance Impact

- **Report Generation Time**: < 500ms for typical test runs
- **Report File Size**: 150-300KB (HTML with embedded CSS)
- **Minimal Overhead**: No impact on test execution itself

## Future Enhancements

Planned features for the test report:
- [ ] Trend analysis over multiple runs
- [ ] Performance regression detection
- [ ] Test flakiness detection
- [ ] Screenshots/videos for failed tests
- [ ] Team notifications
- [ ] Custom report templates
- [ ] PDF export
- [ ] Historical comparison

## Related Documentation

- [Playwright Testing Guide](../instructions/testing.instructions.md#playwright-testing-standards)
- [Vitest Unit Tests](../instructions/testing.instructions.md#unit-testing-standards)
- [Cucumber BDD Tests](../instructions/testing.instructions.md#cucumberbdd-testing-standards)
- [README Test Documentation](../../README.md#-testing-framework)
