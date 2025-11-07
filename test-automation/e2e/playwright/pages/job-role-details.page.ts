import { type Page } from '@playwright/test';

/**
 * Page Object Model for Job Role Details page
 * Encapsulates all interactions with the job role details page at /job-roles/:id
 */
export class JobRoleDetailsPage {
  readonly page: Page;
  readonly baseUrl: string;

  constructor(page: Page, baseUrl: string = 'http://localhost:3000') {
    this.page = page;
    this.baseUrl = baseUrl;
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
  async getJobRoleId(): Promise<number | null> {
    const url = this.page.url();
    const match = url.match(/\/job-roles\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Take a screenshot and save it
   */
  async takeScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }
}
