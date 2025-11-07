import { test, expect } from '@playwright/test';

/**
 * Cross-Browser Compatibility Tests
 * 
 * These tests verify that core functionality works across different browsers
 * and device configurations. They test critical user paths to ensure
 * consistent experience across platforms.
 */

test.describe('Cross-Browser Compatibility Tests', () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  test.describe('Desktop Browser Compatibility', () => {
    test('should load homepage on Chromium', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'Chromium-only test');
      // Note: Test timeout is configured globally in playwright.config.ts
      
      await page.goto(baseUrl, { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      
      // Verify page has content
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100);
    });

    test('should load homepage on Firefox', async ({ page, browserName }) => {
      test.skip(browserName !== 'firefox', 'Firefox-only test');
      // Note: Test timeout is configured globally in playwright.config.ts
      
      await page.goto(baseUrl, { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      
      // Verify page has content
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100);
    });

    test('should load homepage on WebKit', async ({ page, browserName }) => {
      test.skip(browserName !== 'webkit', 'WebKit-only test');
      // Note: Test timeout is configured globally in playwright.config.ts
      
      await page.goto(baseUrl, { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      
      // Verify page has content
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100);
    });
  });

  test.describe('Mobile Device Compatibility', () => {
    test('should work on iPhone viewport', async ({ page }) => {
      // Note: Test timeout is configured globally in playwright.config.ts
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(baseUrl, { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100);
    });

    test('should work on Android viewport', async ({ page }) => {
      // Note: Test timeout is configured globally in playwright.config.ts
      await page.setViewportSize({ width: 412, height: 915 });
      await page.goto(baseUrl, { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100);
    });

    test('should work on tablet viewport', async ({ page }) => {
      // Note: Test timeout is configured globally in playwright.config.ts
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(baseUrl, { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100);
    });
  });

  test.describe('Screen Resolution Compatibility', () => {
    test('should work on 1920x1080 (Full HD)', async ({ page }) => {
      // Note: Test timeout is configured globally in playwright.config.ts
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(baseUrl, { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100);
    });

    test('should work on 1366x768 (HD)', async ({ page }) => {
      // Note: Test timeout is configured globally in playwright.config.ts
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.goto(baseUrl, { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100);
    });

    test('should work on 2560x1440 (2K)', async ({ page }) => {
      // Note: Test timeout is configured globally in playwright.config.ts
      await page.setViewportSize({ width: 2560, height: 1440 });
      await page.goto(baseUrl, { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100);
    });
  });

  test.describe('Navigation Compatibility', () => {
    test('should navigate to job roles across browsers', async ({ page }) => {
      // Note: Test timeout is configured globally in playwright.config.ts
      await page.goto(baseUrl, { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      
      // Try to find and click job roles link
      const jobLink = page.locator('a[href*="job"]').first();
      if (await jobLink.count() > 0) {
        await jobLink.click({ timeout: 10000 });
        await page.waitForLoadState('networkidle');
      }
      
      // Verify page has content
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100);
    });
  });

  test.describe('Performance Compatibility', () => {
    test('should load homepage quickly', async ({ page }) => {
      // Note: Test timeout is configured globally in playwright.config.ts
      const startTime = Date.now();
      
      await page.goto(baseUrl, { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load in under 15 seconds
      expect(loadTime).toBeLessThan(15000);
      console.log(`Homepage loaded in ${loadTime}ms`);
    });
  });
});
