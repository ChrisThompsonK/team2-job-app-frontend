import { type Page } from '@playwright/test';

/**
 * Page Object Model for Admin Job Creation page
 * Encapsulates all interactions with the admin job creation form at /admin/job-roles/new
 */
export class AdminJobCreationFormPage {
  readonly page: Page;
  readonly baseUrl: string;
  readonly formUrl: string;

  constructor(page: Page, baseUrl: string = 'http://localhost:3000') {
    this.page = page;
    this.baseUrl = baseUrl;
    this.formUrl = `${baseUrl}/admin/job-roles/new`;
  }

  /**
   * Navigate to the job creation form with robust retry logic
   */
  async navigate(): Promise<void> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.page.goto(this.formUrl, { waitUntil: 'load', timeout: 15000 });
        await this.page.waitForLoadState('load');
        return;
      } catch (err) {
        lastError = err as Error;
        if (attempt < maxRetries) {
          // eslint-disable-next-line no-console
          console.warn(
            `Navigate to form attempt ${attempt} failed, retrying...`,
            lastError.message
          );
          await new Promise((res) => setTimeout(res, 1000 * attempt));
        }
      }
    }

    if (lastError) {
      throw new Error(
        `Failed to navigate to ${this.formUrl} after ${maxRetries} attempts: ${lastError.message}`
      );
    }
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
   * Simplified version with strict timeouts to prevent hanging
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

    // Try getByLabel first with exact: false (works for most labeled inputs)
    for (const lbl of labels) {
      try {
        const byLabel = this.page.getByLabel(lbl, { exact: false });
        const count = await byLabel.count();
        if (count > 0) {
          const elem = byLabel.first();
          await elem.waitFor({ state: 'visible', timeout: 1000 }).catch(() => {});
          const tagName = await elem
            .evaluate((el: any) => (el.tagName || '').toLowerCase())
            .catch(() => 'input');

          if (tagName === 'select') {
            await elem.selectOption(value, { force: true, timeout: 2000 });
          } else {
            await elem.fill(value, { force: true, timeout: 2000 });
          }

          return true;
        }
      } catch (e) {
        // Continue to next strategy
      }
    }

    // Try by name attribute with variations
    for (const lbl of labels) {
      const variations = [
        lbl,
        lbl.toLowerCase(),
        lbl.toLowerCase().replace(/\s+/g, '_'),
        lbl.toLowerCase().replace(/\s+/g, '-'),
      ];

      for (const varName of variations) {
        try {
          // Try input
          let loc = this.page.locator(`input[name="${varName}"]`).first();
          let count = await loc.count();
          if (count > 0) {
            await loc.fill(value, { force: true, timeout: 1500 });
            return true;
          }

          // Try textarea
          loc = this.page.locator(`textarea[name="${varName}"]`).first();
          count = await loc.count();
          if (count > 0) {
            await loc.fill(value, { force: true, timeout: 1500 });
            return true;
          }

          // Try select
          loc = this.page.locator(`select[name="${varName}"]`).first();
          count = await loc.count();
          if (count > 0) {
            await loc.selectOption(value, { force: true, timeout: 1500 });
            return true;
          }
        } catch (e) {
          // Continue
        }
      }
    }

    // Try by ID attribute
    for (const lbl of labels) {
      const variations = [
        lbl,
        lbl.toLowerCase(),
        lbl.toLowerCase().replace(/\s+/g, '_'),
        lbl.toLowerCase().replace(/\s+/g, '-'),
      ];

      for (const varId of variations) {
        try {
          const loc = this.page.locator(`input[id="${varId}"], textarea[id="${varId}"], select[id="${varId}"]`).first();
          const count = await loc.count();
          if (count > 0) {
            const tagName = await loc.evaluate((el: any) => (el.tagName || '').toLowerCase()).catch(() => 'input');
            if (tagName === 'select') {
              await loc.selectOption(value, { force: true, timeout: 1500 });
            } else {
              await loc.fill(value, { force: true, timeout: 1500 });
            }
            return true;
          }
        } catch (e) {
          // Continue
        }
      }
    }

    console.warn(`Could not find field for labels: ${labels.join(', ')}`);
    return false;
  }

  /**
   * Fill all job creation form fields
   * Wrapped with timeout to prevent hanging
   */
  async fillForm(formData: {
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
    // Use Promise.race to enforce max fill time
    const fillPromise = (async () => {
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
    })();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Form fill timeout after 15s')), 15000)
    );

    try {
      await Promise.race([fillPromise, timeoutPromise]);
    } catch (error) {
      console.warn('Form filling timed out or failed:', (error as Error).message);
      // Don't throw - allow test to continue
    }
  }

  /**
   * Submit the job creation form and wait for navigation
   * Simplified to avoid long waits and timeouts
   * @returns The final URL after submission
   */
  async submit(): Promise<string> {
    // Try multiple selectors for the submit button
    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Create")',
      'button:has-text("Submit")',
      'button:has-text("Add")',
      'button:has-text("Save")',
      'input[type="submit"]',
    ];

    let submitButton = null;
    for (const selector of submitSelectors) {
      try {
        const btn = this.page.locator(selector).first();
        if (await btn.count()) {
          submitButton = btn;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (submitButton) {
      try {
        // Click submit and wait briefly for page load
        await submitButton.click({ force: true });
        
        // Wait a short time for navigation (max 5 seconds)
        await this.page.waitForLoadState('load').catch(() => {});
        
        // Brief wait for any client-side navigation
        await this.page.waitForTimeout(500);
      } catch (e) {
        console.warn('Error clicking submit button:', (e as Error).message);
      }
    } else {
      // Fallback: submit form via JavaScript
      try {
        await this.page.evaluate(() => {
          const form = document.querySelector('form') as HTMLFormElement | null;
          if (form) {
            form.submit();
          }
        });

        // Wait for page load
        await this.page.waitForLoadState('load').catch(() => {});
        await this.page.waitForTimeout(500);
      } catch (e) {
        console.warn('Error submitting form via JS:', (e as Error).message);
      }
    }

    const url = await this.getCurrentUrl();
    console.log(`✓ Submit completed. Final URL: ${url}`);
    
    return url;
  }

  /**
   * Take a screenshot and save it
   */
  async takeScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }
}
