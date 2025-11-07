import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page.js';
import { AdminJobCreationFormPage } from './pages/admin-job-creation-form.page.js';
import { JobRoleDetailsPage } from './pages/job-role-details.page.js';

/**
 * Admin Job Creation Tests
 * 
 * Tests for the admin job creation workflow using Page Object Model pattern:
 * 1. Navigate to /login and authenticate
 * 2. Navigate to /admin/job-roles/new
 * 3. Fill form fields (role name, location, capability, band, closing date, open positions, job spec link, description, responsibilities)
 * 4. Submit form
 * 5. Verify redirect to /job-roles/xx?created=true
 */

test.describe('Admin Job Creation', () => {
  // Test data with unique timestamp to avoid duplicates
  const testJobData = {
    roleName: `Test Admin Job ${Date.now()}`,
    location: 'London',
    capability: 'Engineering',
    band: 'Senior',
    closingDate: '2025-12-31',
    numberOfOpenPositions: '2',
    jobSpecLink: 'https://example.com/job-spec',
    description: 'This is a test job role created by automation',
    responsibilities: 'Test responsibilities for automation',
  };


  test('Admin can navigate to job creation form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const creationFormPage = new AdminJobCreationFormPage(page);

    // Authenticate and navigate
    await loginPage.loginAsAdmin();
    await creationFormPage.navigate();

    // Verify page loaded correctly
    const pageTitle = await creationFormPage.getPageTitle();
    const url = await creationFormPage.getCurrentUrl();

    expect(pageTitle).toBeTruthy();
    expect(url).toContain('/admin/job-roles/new');

    // Take screenshot for visual verification
    await creationFormPage.takeScreenshot('test-results/admin-form-page.png');
  });

  // TODO: Implement remaining tests when backend /admin/job-roles/new is fully ready
  // - Admin can fill job creation form with all required fields
  // - Admin can submit job creation form and verify success
});

