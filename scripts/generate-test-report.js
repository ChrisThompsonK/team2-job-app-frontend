#!/usr/bin/env node

/**
 * Test Report Generator
 * Generates a comprehensive HTML test report from Playwright, Vitest, and Cucumber results
 * Run after each test suite execution
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const REPORT_DIR = path.join(__dirname, '../test-results');
const REPORT_OUTPUT = path.join(REPORT_DIR, 'test-report.html');
const PLAYWRIGHT_RESULTS = path.join(REPORT_DIR, 'results.json');
const VITEST_RESULTS = path.join(REPORT_DIR, 'vitest-results.json');
const CUCUMBER_RESULTS = path.join(REPORT_DIR, 'cucumber-results.json');

// Ensure report directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

/**
 * Load and parse test results from JSON files
 */
function loadTestResults() {
  const results = {
    playwright: { tests: [], summary: { passed: 0, failed: 0, skipped: 0, total: 0, duration: 0 } },
    vitest: { tests: [], summary: { passed: 0, failed: 0, skipped: 0, total: 0, duration: 0 } },
    cucumber: { scenarios: [], summary: { passed: 0, failed: 0, skipped: 0, total: 0, duration: 0 } },
  };

  // Load Playwright results
  if (fs.existsSync(PLAYWRIGHT_RESULTS)) {
    try {
      const data = JSON.parse(fs.readFileSync(PLAYWRIGHT_RESULTS, 'utf-8'));
      if (data.suites) {
        results.playwright.tests = parsePlaywrightResults(data.suites);
        results.playwright.summary = calculatePlaywrightSummary(data);
      }
    } catch (err) {
      console.error('Error parsing Playwright results:', err.message);
    }
  }

  // Load Vitest results (if available)
  if (fs.existsSync(VITEST_RESULTS)) {
    try {
      const data = JSON.parse(fs.readFileSync(VITEST_RESULTS, 'utf-8'));
      results.vitest.tests = parseVitestResults(data);
      results.vitest.summary = calculateVitestSummary(data);
    } catch (err) {
      console.error('Error parsing Vitest results:', err.message);
    }
  }

  // Load Cucumber results (if available)
  if (fs.existsSync(CUCUMBER_RESULTS)) {
    try {
      const data = JSON.parse(fs.readFileSync(CUCUMBER_RESULTS, 'utf-8'));
      results.cucumber.scenarios = parseCucumberResults(data);
      results.cucumber.summary = calculateCucumberSummary(data);
    } catch (err) {
      console.error('Error parsing Cucumber results:', err.message);
    }
  }

  return results;
}

/**
 * Parse Playwright test results from JSON report
 */
function parsePlaywrightResults(suites) {
  const tests = [];
  
  function traverseSuites(suiteList, parentTitle = '') {
    suiteList.forEach(suite => {
      const suiteName = parentTitle ? `${parentTitle} > ${suite.title}` : suite.title;
      
      if (suite.specs) {
        suite.specs.forEach(spec => {
          // Handle nested test results
          if (spec.tests && spec.tests.length > 0) {
            spec.tests.forEach(test => {
              if (test.results && test.results.length > 0) {
                const result = test.results[0];
                const test_obj = {
                  name: spec.title,
                  suite: suiteName,
                  status: result.status || 'unknown',
                  duration: result.duration || 0,
                  error: result.error ? result.error.message : (result.errors && result.errors[0] ? result.errors[0].message : null),
                  browser: test.projectName || 'chromium',
                };
                tests.push(test_obj);
              }
            });
          } else {
            // Fallback for different format
            const test = {
              name: spec.title,
              suite: suiteName,
              status: spec.ok ? 'passed' : 'failed',
              duration: 0,
              error: spec.error ? spec.error.message : null,
              browser: 'chromium',
            };
            tests.push(test);
          }
        });
      }
      
      if (suite.suites) {
        traverseSuites(suite.suites, suiteName);
      }
    });
  }
  
  traverseSuites(suites);
  return tests;
}

/**
 * Calculate Playwright test summary
 */
function calculatePlaywrightSummary(data) {
  let passed = 0, failed = 0, skipped = 0, total = 0, duration = 0;
  
  function traverseSuites(suites) {
    suites.forEach(suite => {
      if (suite.specs) {
        suite.specs.forEach(spec => {
          if (spec.tests && spec.tests.length > 0) {
            spec.tests.forEach(test => {
              if (test.results && test.results.length > 0) {
                total += 1;
                const result = test.results[0];
                duration += result.duration || 0;
                
                if (result.status === 'passed') passed += 1;
                else if (result.status === 'failed') failed += 1;
                else if (result.status === 'skipped') skipped += 1;
              }
            });
          } else {
            total += 1;
            duration += 0;
            if (spec.ok) passed += 1;
            else failed += 1;
          }
        });
      }
      
      if (suite.suites) {
        traverseSuites(suite.suites);
      }
    });
  }
  
  if (data.suites) {
    traverseSuites(data.suites);
  }
  
  return { passed, failed, skipped, total, duration: Math.round(duration / 1000) };
}

/**
 * Parse Vitest results
 */
function parseVitestResults(data) {
  const tests = [];
  
  if (data.testResults) {
    data.testResults.forEach(file => {
      if (file.assertionResults) {
        file.assertionResults.forEach(test => {
          tests.push({
            name: test.title,
            file: file.name,
            status: test.status === 'passed' ? 'passed' : test.status === 'failed' ? 'failed' : 'skipped',
            duration: test.duration || 0,
            error: test.failureMessages ? test.failureMessages[0] : null,
          });
        });
      }
    });
  }
  
  return tests;
}

/**
 * Calculate Vitest summary
 */
function calculateVitestSummary(data) {
  let passed = 0, failed = 0, skipped = 0, total = 0, duration = 0;
  
  if (data.testResults) {
    data.testResults.forEach(file => {
      if (file.assertionResults) {
        file.assertionResults.forEach(test => {
          total += 1;
          duration += test.duration || 0;
          
          if (test.status === 'passed') passed += 1;
          else if (test.status === 'failed') failed += 1;
          else skipped += 1;
        });
      }
    });
  }
  
  return { passed, failed, skipped, total, duration: Math.round(duration / 1000) };
}

/**
 * Parse Cucumber results
 */
function parseCucumberResults(data) {
  const scenarios = [];
  
  if (Array.isArray(data)) {
    data.forEach(feature => {
      if (feature.elements) {
        feature.elements.forEach(scenario => {
          const steps = scenario.steps || [];
          const failedSteps = steps.filter(s => s.result && s.result.status === 'failed');
          
          scenarios.push({
            name: scenario.name,
            feature: feature.name,
            status: failedSteps.length > 0 ? 'failed' : 'passed',
            stepsTotal: steps.length,
            stepsPassed: steps.filter(s => s.result && s.result.status === 'passed').length,
            stepsFailed: failedSteps.length,
            duration: scenario.steps ? scenario.steps.reduce((sum, s) => sum + (s.result?.duration || 0), 0) / 1000000000 : 0,
            error: failedSteps.length > 0 ? failedSteps[0].result.error_message : null,
          });
        });
      }
    });
  }
  
  return scenarios;
}

/**
 * Calculate Cucumber summary
 */
function calculateCucumberSummary(data) {
  let passed = 0, failed = 0, skipped = 0, total = 0, duration = 0;
  
  if (Array.isArray(data)) {
    data.forEach(feature => {
      if (feature.elements) {
        feature.elements.forEach(scenario => {
          total += 1;
          const steps = scenario.steps || [];
          const failedSteps = steps.filter(s => s.result && s.result.status === 'failed');
          duration += steps.reduce((sum, s) => sum + (s.result?.duration || 0), 0);
          
          if (failedSteps.length > 0) failed += 1;
          else if (steps.every(s => s.result && s.result.status === 'passed')) passed += 1;
          else skipped += 1;
        });
      }
    });
  }
  
  return { passed, failed, skipped, total, duration: Math.round(duration / 1000000000) };
}

/**
 * Generate HTML report
 */
function generateHTMLReport(results) {
  const timestamp = new Date().toISOString();
  const totalTests = results.playwright.summary.total + results.vitest.summary.total;
  const totalPassed = results.playwright.summary.passed + results.vitest.summary.passed;
  const totalFailed = results.playwright.summary.failed + results.vitest.summary.failed;
  const totalSkipped = results.playwright.summary.skipped + results.vitest.summary.skipped;
  const passRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Report - ${timestamp.split('T')[0]}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
      padding: 20px;
      min-height: 100vh;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    .header p {
      font-size: 1.1em;
      opacity: 0.9;
    }
    
    .timestamp {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9em;
      margin-top: 10px;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 40px;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }
    
    .summary-card {
      background: white;
      padding: 25px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    
    .summary-card.passed {
      border-left-color: #10b981;
    }
    
    .summary-card.failed {
      border-left-color: #ef4444;
    }
    
    .summary-card.skipped {
      border-left-color: #f59e0b;
    }
    
    .summary-card.passrate {
      border-left-color: #3b82f6;
    }
    
    .summary-card h3 {
      color: #666;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    
    .summary-card .number {
      font-size: 2.5em;
      font-weight: 700;
      color: #333;
    }
    
    .content {
      padding: 40px;
    }
    
    .section {
      margin-bottom: 50px;
    }
    
    .section h2 {
      font-size: 1.8em;
      margin-bottom: 25px;
      color: #333;
      border-bottom: 3px solid #667eea;
      padding-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .section-icon {
      font-size: 1.5em;
    }
    
    .test-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    
    .test-table thead {
      background: #f3f4f6;
      border-bottom: 2px solid #d1d5db;
    }
    
    .test-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      font-size: 0.95em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .test-table td {
      padding: 12px 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .test-table tbody tr:hover {
      background: #f9fafb;
    }
    
    .test-table .status {
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.85em;
      display: inline-block;
      white-space: nowrap;
    }
    
    .status.passed {
      background: #dcfce7;
      color: #166534;
    }
    
    .status.failed {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .status.skipped {
      background: #fef3c7;
      color: #92400e;
    }
    
    .duration {
      color: #6b7280;
      font-size: 0.9em;
    }
    
    .error-message {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 12px;
      border-radius: 4px;
      color: #7f1d1d;
      font-family: 'Courier New', monospace;
      font-size: 0.85em;
      max-height: 100px;
      overflow-y: auto;
      margin-top: 5px;
    }
    
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #9ca3af;
      background: #f9fafb;
      border-radius: 8px;
      border: 2px dashed #e5e7eb;
    }
    
    .empty-state p {
      font-size: 1.1em;
    }
    
    .footer {
      background: #f9fafb;
      padding: 25px;
      text-align: center;
      color: #6b7280;
      font-size: 0.9em;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .summary-grid {
        grid-template-columns: 1fr;
      }
      
      .test-table {
        font-size: 0.9em;
      }
      
      .test-table th, .test-table td {
        padding: 8px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 Test Report</h1>
      <p>Comprehensive test execution summary</p>
      <div class="timestamp">Generated: ${timestamp}</div>
    </div>
    
    <div class="summary-grid">
      <div class="summary-card passed">
        <h3>Passed</h3>
        <div class="number">${totalPassed}</div>
      </div>
      <div class="summary-card failed">
        <h3>Failed</h3>
        <div class="number">${totalFailed}</div>
      </div>
      <div class="summary-card skipped">
        <h3>Skipped</h3>
        <div class="number">${totalSkipped}</div>
      </div>
      <div class="summary-card passrate">
        <h3>Pass Rate</h3>
        <div class="number">${passRate}%</div>
      </div>
    </div>
    
    <div class="content">
      ${generatePlaywrightSection(results.playwright)}
      ${generateVitestSection(results.vitest)}
      ${generateCucumberSection(results.cucumber)}
    </div>
    
    <div class="footer">
      <p>Test Report Auto-Generated • <a href="https://playwright.dev">Playwright</a> • <a href="https://vitest.dev">Vitest</a> • <a href="https://cucumber.io">Cucumber</a></p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Generate Playwright section
 */
function generatePlaywrightSection(playwrightResults) {
  if (playwrightResults.summary.total === 0) {
    return '';
  }

  const { passed, failed, skipped, total } = playwrightResults.summary;
  
  let tableHtml = playwrightResults.tests.length > 0
    ? `
      <table class="test-table">
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Suite</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Browser</th>
          </tr>
        </thead>
        <tbody>
          ${playwrightResults.tests.map(test => `
            <tr>
              <td>${test.name}</td>
              <td>${test.suite}</td>
              <td><span class="status ${test.status}">${test.status.toUpperCase()}</span>${test.error ? `<div class="error-message">${escapeHtml(test.error)}</div>` : ''}</td>
              <td><span class="duration">${(test.duration / 1000).toFixed(2)}s</span></td>
              <td>${test.browser}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
    : '<div class="empty-state"><p>No Playwright tests found</p></div>';

  return `
    <div class="section">
      <h2><span class="section-icon">🎭</span> Playwright E2E Tests</h2>
      <div style="margin-bottom: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
        <div style="background: #dcfce7; padding: 15px; border-radius: 6px;"><strong>${passed}</strong> Passed</div>
        <div style="background: #fee2e2; padding: 15px; border-radius: 6px;"><strong>${failed}</strong> Failed</div>
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px;"><strong>${skipped}</strong> Skipped</div>
        <div style="background: #dbeafe; padding: 15px; border-radius: 6px;"><strong>${total}</strong> Total</div>
      </div>
      ${tableHtml}
    </div>
  `;
}

/**
 * Generate Vitest section
 */
function generateVitestSection(vitestResults) {
  if (vitestResults.summary.total === 0) {
    return '';
  }

  const { passed, failed, skipped, total } = vitestResults.summary;
  
  let tableHtml = vitestResults.tests.length > 0
    ? `
      <table class="test-table">
        <thead>
          <tr>
            <th>Test Name</th>
            <th>File</th>
            <th>Status</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          ${vitestResults.tests.map(test => `
            <tr>
              <td>${test.name}</td>
              <td><code>${test.file.split('/').pop()}</code></td>
              <td><span class="status ${test.status}">${test.status.toUpperCase()}</span>${test.error ? `<div class="error-message">${escapeHtml(test.error)}</div>` : ''}</td>
              <td><span class="duration">${(test.duration / 1000).toFixed(2)}s</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
    : '<div class="empty-state"><p>No Vitest tests found</p></div>';

  return `
    <div class="section">
      <h2><span class="section-icon">⚡</span> Vitest Unit Tests</h2>
      <div style="margin-bottom: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
        <div style="background: #dcfce7; padding: 15px; border-radius: 6px;"><strong>${passed}</strong> Passed</div>
        <div style="background: #fee2e2; padding: 15px; border-radius: 6px;"><strong>${failed}</strong> Failed</div>
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px;"><strong>${skipped}</strong> Skipped</div>
        <div style="background: #dbeafe; padding: 15px; border-radius: 6px;"><strong>${total}</strong> Total</div>
      </div>
      ${tableHtml}
    </div>
  `;
}

/**
 * Generate Cucumber section
 */
function generateCucumberSection(cucumberResults) {
  if (cucumberResults.summary.total === 0) {
    return '';
  }

  const { passed, failed, skipped, total } = cucumberResults.summary;
  
  let tableHtml = cucumberResults.scenarios.length > 0
    ? `
      <table class="test-table">
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Feature</th>
            <th>Status</th>
            <th>Steps</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          ${cucumberResults.scenarios.map(scenario => `
            <tr>
              <td>${scenario.name}</td>
              <td>${scenario.feature}</td>
              <td><span class="status ${scenario.status}">${scenario.status.toUpperCase()}</span>${scenario.error ? `<div class="error-message">${escapeHtml(scenario.error)}</div>` : ''}</td>
              <td><span class="duration">${scenario.stepsPassed}/${scenario.stepsTotal}</span></td>
              <td><span class="duration">${scenario.duration.toFixed(2)}s</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
    : '<div class="empty-state"><p>No Cucumber scenarios found</p></div>';

  return `
    <div class="section">
      <h2><span class="section-icon">🥒</span> Cucumber BDD Tests</h2>
      <div style="margin-bottom: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
        <div style="background: #dcfce7; padding: 15px; border-radius: 6px;"><strong>${passed}</strong> Passed</div>
        <div style="background: #fee2e2; padding: 15px; border-radius: 6px;"><strong>${failed}</strong> Failed</div>
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px;"><strong>${skipped}</strong> Skipped</div>
        <div style="background: #dbeafe; padding: 15px; border-radius: 6px;"><strong>${total}</strong> Total</div>
      </div>
      ${tableHtml}
    </div>
  `;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Main execution
 */
function main() {
  console.log('📊 Generating test report...');
  
  try {
    // Load test results
    const results = loadTestResults();
    
    // Generate HTML report
    const html = generateHTMLReport(results);
    
    // Write to file
    fs.writeFileSync(REPORT_OUTPUT, html);
    
    console.log(`✅ Test report generated: ${REPORT_OUTPUT}`);
    console.log('');
    console.log('📈 Test Summary:');
    console.log(`   Playwright: ${results.playwright.summary.passed}/${results.playwright.summary.total} passed`);
    console.log(`   Vitest:     ${results.vitest.summary.passed}/${results.vitest.summary.total} passed`);
    console.log(`   Cucumber:   ${results.cucumber.summary.passed}/${results.cucumber.summary.total} passed`);
    console.log('');
    console.log(`🌐 Open report in browser: open ${REPORT_OUTPUT}`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error generating report:', err.message);
    process.exit(1);
  }
}

main();
