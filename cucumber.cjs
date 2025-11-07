/**
 * Cucumber.js configuration file for BDD test automation framework.
 *
 * Configuration for loading TypeScript step definitions and features.
 * Uses glob patterns with auto-discovery.
 */

const defaultConfig = {
  // Step definitions and support code - use glob patterns for auto-discovery
  import: [
    'test-automation/support/*.ts',
    'test-automation/bdd/steps/*.ts',
  ],

  // Feature files
  paths: ['test-automation/bdd/features/**/*.feature'],

  // Skip SauceDemo tests by default (external application tests)
  tags: 'not @skip-saucedemo',

  // Formatters for output
  format: [
    'progress-bar',
    'json:test-results/cucumber-report.json',
    'html:test-results/cucumber-report.html',
  ],

  // Step timeout in milliseconds
  timeout: 60000, // Increased to 60 seconds

  // Parallel execution
  parallel: 1,

  // Strict mode - fail on undefined steps
  strict: true,
};

module.exports = {
  default: defaultConfig,
};
