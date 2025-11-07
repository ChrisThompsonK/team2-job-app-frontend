import { type Page } from '@playwright/test';

/**
 * Page Object Model for Admin Job Creation page
 * Encapsulates all interactions with the admin job creation form at /admin/job-roles/new
 */
export class AdminJobCreationPage {
  readonly page: Page;
  readonly baseUrl: string;
  readonly loginUrl: string;
  readonly formUrl: string;

  // Admin credentials
  readonly adminEmail = 'admin@example.com';
  readonly adminPassword = 'Admin123!';

  constructor(page: Page, baseUrl: string = 'http://localhost:3000') {
    this.page = page;
    this.baseUrl = baseUrl;
    this.loginUrl = `${baseUrl}/login`;
    this.formUrl = `${baseUrl}/admin/job-roles/new`;
  }

  /**
   * Log in as admin using email and password
   */
  async loginAsAdmin(): Promise<void> {
    await this.page.goto(this.loginUrl);
    await this.page.waitForLoadState('load');

    // Fill email/password
    await this.page.fill('input[name="email"]', this.adminEmail).catch(() => {});
    await this.page.fill('input[name="password"]', this.adminPassword).catch(() => {});

    // Submit form
    const submit = this.page
      .locator('button[type="submit"], button:has-text("Sign In"), input[type="submit"]')
      .first();

    if (await submit.count()) {
      await submit.click();
    } else {
      // Fallback: submit form via JavaScript
      await this.page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) (form as HTMLFormElement).submit();
      });
    }

    // Wait for redirect after login
    await this.page.waitForLoadState('load');
  }

  /**
   * Navigate to the job creation form
   */
  async navigateToForm(): Promise<void> {
    await this.page.goto(this.formUrl);
    await this.page.waitForLoadState('load');
  }

  /**
   * Get the page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Get the current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Fill a form field with robust locator strategies (label, name, id, placeholder, select)
   * @param labelCandidates - Array of possible label texts or field names to try
   * @param value - Value to fill in the field
   */
  async fillField(
    labelCandidates: string | string[],
    value: string
  ): Promise<boolean> {
    const labels = Array.isArray(labelCandidates)
      ? labelCandidates
      : [labelCandidates];

    // Try getByLabel first (works for inputs, textareas, selects)
    for (const lbl of labels) {
      try {
        const byLabel = this.page.getByLabel(lbl, { exact: false });
        if (await byLabel.count()) {
          const tagName = await byLabel.evaluate(
            (el: any) => (el.tagName || '').toLowerCase()
          );

          if (tagName === 'select') {
            await byLabel.selectOption({ label: value }).catch(() => {});
          } else {
            await byLabel.fill(value).catch(() => {});
          }

          return true;
        }
      } catch (e) {
        // Continue to next strategy
      }
    }

    // Try common attribute selectors
    const firstLabel = labels[0];
    const inputSelectors = [
      `input[name="${firstLabel}"]`,
      `input[id="${firstLabel}"]`,
      `input[placeholder*="${firstLabel}"]`,
      `textarea[name="${firstLabel}"]`,
      `textarea[id="${firstLabel}"]`,
      `select[name="${firstLabel}"]`,
      `select[id="${firstLabel}"]`,
    ];

    for (const sel of inputSelectors) {
      try {
        const loc = this.page.locator(sel).first();
        if (await loc.count()) {
          const tagName = await loc.evaluate(
            (el: any) => (el.tagName || '').toLowerCase()
          );

          if (tagName === 'select') {
            await loc.selectOption({ label: value }).catch(() => {});
          } else {
            await loc.fill(value).catch(() => {});
          }

          return true;
        }
      } catch (e) {
        // Continue to next strategy
      }
    }

    // Last resort: try matching placeholder
    try {
      const placeholder = this.page
        .locator(
          `input[placeholder*="${firstLabel}"], textarea[placeholder*="${firstLabel}"]`
        )
        .first();

      if (await placeholder.count()) {
        await placeholder.fill(value).catch(() => {});
        return true;
      }
    } catch (e) {
      // Field not found
    }

    return false;
  }

  /**
   * Fill all job creation form fields
   */
  async fillJobCreationForm(formData: {
    roleName: string;
    location: string;
    capability: string;
    band: string;
    closingDate: string;
    numberOfOpenPositions: string;
    jobSpecLink: string;
    description: string;
    responsibilities: string;
  }): Promise<void> {
    await this.fillField(['Role name', 'roleName', 'role'], formData.roleName);
    await this.fillField(['Location', 'location'], formData.location);
    await this.fillField(['Capability', 'capability'], formData.capability);
    await this.fillField(['Band', 'band', 'Band Level'], formData.band);
    await this.fillField(['Closing date', 'closingDate'], formData.closingDate);
    await this.fillField(
      ['Number of Open Positions', 'numberOfOpenPositions', 'Open positions'],
      formData.numberOfOpenPositions
    );
    await this.fillField(
      ['Job Spec Link', 'jobSpecLink', 'Job Spec Link (SharePoint)'],
      formData.jobSpecLink
    );
    await this.fillField(
      ['Description', 'description', 'Job Description'],
      formData.description
    );
    await this.fillField(
      ['Responsibilities', 'responsibilities', 'Key Responsibilities'],
      formData.responsibilities
    );
  }

  /**
   * Submit the job creation form and wait for navigation
   * @returns The final URL after submission
   */
  async submitForm(): Promise<string> {
    const submit = this.page
      .locator(
        'button[type="submit"], button:has-text("Create"), button:has-text("Submit"), button:has-text("Add")'
      )
      .first();

    if (await submit.count()) {
      await Promise.all([
        this.page.waitForNavigation({
          waitUntil: 'load',
          timeout: 30000,
        }).catch(() => {}),
        submit.click().catch(() => {}),
      ]);
    } else {
      // Fallback: submit form via JavaScript
      await this.page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) (form as HTMLFormElement).submit();
      });

      await this.page.waitForLoadState('load').catch(() => {});
    }

    const url = await this.getCurrentUrl();
    console.log(`✓ Submit complete. Final URL: ${url}`);
    return url;
  }

  /**
   * Take a screenshot and save it
   */
  async takeScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }

  /**
   * Check if the current URL indicates successful job creation
   */
  async isJobCreated(): Promise<boolean> {
    const url = this.page.url();
    const hasCreatedParam =
      url.includes('?created=true') || url.includes('created=1');
    const hasJobIdParam = /\/job-roles\/\d+/.test(url);

    return hasCreatedParam || hasJobIdParam;
  }

  /**
   * Get the job role ID from the current URL (if on the job details page)
   */
  async getJobRoleIdFromUrl(): Promise<number | null> {
    const url = this.page.url();
    const match = url.match(/\/job-roles\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }
}
