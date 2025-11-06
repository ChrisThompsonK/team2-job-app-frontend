import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestResult {
  name: string;
  state: "passed" | "failed" | "skipped";
  duration: number;
  location: string;
  error?: string;
  expectedVsActual?: string;
}

interface CoverageData {
  lines: { pct: number };
  statements: { pct: number };
  functions: { pct: number };
  branches: { pct: number };
}

interface PlaywrightTestResult {
  status?: "passed" | "failed" | "timedOut" | "skipped";
  tests: Array<{
    title: string;
    ok: boolean;
    location: string;
    duration: number;
    status?: "passed" | "failed" | "skipped";
    error?: { message: string; stack?: string };
  }>;
}

interface ReportData {
  timestamp: string;
  buildNumber: string;
  unitTests?: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
    results: TestResult[];
    coverage?: {
      lines: number;
      branches: number;
      functions: number;
      statements: number;
    };
  };
  e2eTests?: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
    results: TestResult[];
  };
}

function readJsonFile(filePath: string): Record<string, unknown> {
  try {
    if (!fs.existsSync(filePath)) {
      return {};
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function getCoverageData(): {
  lines: number;
  branches: number;
  functions: number;
  statements: number;
} {
  const coverageFile = path.join(
    __dirname,
    "../coverage/coverage-final.json"
  );
  const coverageData = readJsonFile(coverageFile) as Record<
    string,
    { l?: Record<string, number>; b?: Record<string, number[]> }
  >;

  if (!Object.keys(coverageData).length) {
    return { lines: 0, branches: 0, functions: 0, statements: 0 };
  }

  let totalLines = 0;
  let coveredLines = 0;
  let totalBranches = 0;
  let coveredBranches = 0;

  Object.entries(coverageData).forEach(([_file, data]) => {
    if (data.l) {
      Object.values(data.l).forEach((count) => {
        totalLines++;
        if (count > 0) coveredLines++;
      });
    }
    if (data.b) {
      Object.values(data.b).forEach((branches) => {
        totalBranches += branches.length;
        coveredBranches += branches.filter((c) => c > 0).length;
      });
    }
  });

  return {
    lines: totalLines > 0 ? Math.round((coveredLines / totalLines) * 100) : 0,
    branches:
      totalBranches > 0 ? Math.round((coveredBranches / totalBranches) * 100) : 0,
    functions: 0,
    statements:
      totalLines > 0 ? Math.round((coveredLines / totalLines) * 100) : 0,
  };
}

function getUnitTestData(): ReportData["unitTests"] {
  const vitestResultsFile = path.join(
    __dirname,
    "../coverage/coverage-final.json"
  );

  // Try to read from vitest summary if available
  const summaryFile = path.join(__dirname, "../test-results/summary.json");
  const summary = readJsonFile(summaryFile) as Record<string, unknown>;

  const coverage = getCoverageData();

  return {
    total: (summary.total as number) || 0,
    passed: (summary.passed as number) || 0,
    failed: (summary.failed as number) || 0,
    skipped: (summary.skipped as number) || 0,
    duration: (summary.duration as number) || 0,
    results: [],
    coverage,
  };
}

function getE2ETestData(): ReportData["e2eTests"] {
  const playwrightResultsFile = path.join(
    __dirname,
    "../test-results/results.json"
  );
  const results = readJsonFile(playwrightResultsFile) as Record<string, unknown>;

  if (!results || !Array.isArray(results.suites)) {
    return {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      results: [],
    };
  }

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;
  let totalDuration = 0;
  const testResults: TestResult[] = [];

  (results.suites as PlaywrightTestResult[]).forEach((suite) => {
    suite.tests?.forEach((test) => {
      totalTests++;
      totalDuration += test.duration || 0;

      if (test.ok) {
        passedTests++;
      } else if (test.status === "skipped") {
        skippedTests++;
      } else {
        failedTests++;
        testResults.push({
          name: test.title,
          state: "failed",
          duration: test.duration || 0,
          location: test.location || "unknown",
          error: test.error?.message,
        });
      }
    });
  });

  return {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    skipped: skippedTests,
    duration: totalDuration,
    results: testResults,
  };
}

function formatDuration(ms: number): string {
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
}

function generateReport(data: ReportData): string {
  const unitData = data.unitTests;
  const e2eData = data.e2eTests;

  const unitStatus =
    unitData && unitData.failed === 0 ? "✅ PASSED" : "❌ FAILED";
  const e2eStatus = e2eData && e2eData.failed === 0 ? "✅ PASSED" : "❌ FAILED";

  const overallStatus =
    (!unitData || unitData.failed === 0) &&
    (!e2eData || e2eData.failed === 0)
      ? "✅ PASSED"
      : "❌ FAILED";

  let report = `
╔════════════════════════════════════════════════════════════════════╗
║                       TEST REPORT SUMMARY                          ║
╚════════════════════════════════════════════════════════════════════╝

Date: ${new Date(data.timestamp).toLocaleString()}
Build: #${data.buildNumber}

┌────────────────────────────────────────────────────────────────────┐
│ OVERALL STATUS                                                     │
└────────────────────────────────────────────────────────────────────┘
Status: ${overallStatus}

`;

  if (unitData) {
    const unitTotal = unitData.total;
    const unitPassed = unitData.passed;
    const unitFailed = unitData.failed;
    const unitSkipped = unitData.skipped;
    const unitPassRate =
      unitTotal > 0 ? Math.round((unitPassed / unitTotal) * 100) : 0;

    report += `┌────────────────────────────────────────────────────────────────────┐
│ UNIT TESTS (Vitest)                                                │
└────────────────────────────────────────────────────────────────────┘
Status: ${unitStatus}
Total: ${unitTotal} | Passed: ${unitPassed} | Failed: ${unitFailed} | Skipped: ${unitSkipped}
Pass Rate: ${unitPassRate}%
Duration: ${formatDuration(unitData.duration)}

Coverage:
  Lines:      ${unitData.coverage?.lines || 0}%
  Branches:   ${unitData.coverage?.branches || 0}%
  Functions:  ${unitData.coverage?.functions || 0}%
  Statements: ${unitData.coverage?.statements || 0}%

`;
  }

  if (e2eData) {
    const e2eTotal = e2eData.total;
    const e2ePassed = e2eData.passed;
    const e2eFailed = e2eData.failed;
    const e2eSkipped = e2eData.skipped;
    const e2ePassRate =
      e2eTotal > 0 ? Math.round((e2ePassed / e2eTotal) * 100) : 0;

    report += `┌────────────────────────────────────────────────────────────────────┐
│ E2E TESTS (Playwright)                                             │
└────────────────────────────────────────────────────────────────────┘
Status: ${e2eStatus}
Total: ${e2eTotal} | Passed: ${e2ePassed} | Failed: ${e2eFailed} | Skipped: ${e2eSkipped}
Pass Rate: ${e2ePassRate}%
Duration: ${formatDuration(e2eData.duration)}

`;

    if (e2eData.failed > 0) {
      report += `┌────────────────────────────────────────────────────────────────────┐
│ FAILED E2E TESTS (${e2eData.failed})                               │
└────────────────────────────────────────────────────────────────────┘
`;
      e2eData.results.forEach((test, index) => {
        report += `
${index + 1}. ${test.name}
   Location: ${test.location}
   Duration: ${formatDuration(test.duration)}
   Error: ${test.error || "Unknown error"}
`;
      });
      report += "\n";
    }
  }

  report += `
╔════════════════════════════════════════════════════════════════════╗
║ For detailed reports:                                              ║
║   Unit Tests: open coverage/index.html                             ║
║   E2E Tests:  npm run test:e2e:report                              ║
╚════════════════════════════════════════════════════════════════════╝
`;

  return report;
}

async function main() {
  try {
    const buildNumber = process.env.BUILD_NUMBER || "1";
    const reportData: ReportData = {
      timestamp: new Date().toISOString(),
      buildNumber,
      unitTests: getUnitTestData(),
      e2eTests: getE2ETestData(),
    };

    // Ensure reports directory exists
    const reportsDir = path.join(__dirname, "../reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Generate text report
    const textReport = generateReport(reportData);
    console.log(textReport);

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const reportPath = path.join(reportsDir, `test-report-${timestamp}.txt`);
    fs.writeFileSync(reportPath, textReport);

    // Save JSON report
    const jsonReportPath = path.join(reportsDir, `test-report-${timestamp}.json`);
    fs.writeFileSync(jsonReportPath, JSON.stringify(reportData, null, 2));

    // Also save latest report
    const latestReportPath = path.join(reportsDir, "test-report-latest.txt");
    fs.writeFileSync(latestReportPath, textReport);

    const latestJsonPath = path.join(reportsDir, "test-report-latest.json");
    fs.writeFileSync(latestJsonPath, JSON.stringify(reportData, null, 2));

    console.log(`\n✅ Reports saved to: ${reportsDir}`);
    console.log(`   - test-report-${timestamp}.txt`);
    console.log(`   - test-report-${timestamp}.json`);

    // Exit with appropriate code
    const testsFailed =
      (reportData.unitTests?.failed || 0) +
      (reportData.e2eTests?.failed || 0);
    process.exit(testsFailed > 0 ? 1 : 0);
  } catch (error) {
    console.error("Error generating test report:", error);
    process.exit(1);
  }
}

main();
