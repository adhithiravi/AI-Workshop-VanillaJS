const { test, expect } = require('@playwright/test');

test.describe('Smoke Tests', () => {
  test('should load homepage and verify basic elements', async ({ page }) => {
    // Visit the homepage
    await page.goto('http://localhost:4000/');

    // Wait for the page to load and API calls to complete
    await page.waitForLoadState('networkidle');

    // Assert that the page title contains "Bethany"
    await expect(page).toHaveTitle(/Bethany/);

    // Assert that the basic page structure exists
    // Check for the featured section
    const featuredSection = page.locator('#featured');
    await expect(featuredSection).toBeVisible();

    // Check for the section title
    const sectionTitle = featuredSection.locator('h2');
    await expect(sectionTitle).toHaveText('Pies of the Month');

    // Check that the monthly pies grid element exists (structure check)
    const piesGrid = page.locator('#monthly.pies-grid');
    await expect(piesGrid).toBeAttached();

    // For smoke test, just verify the element exists - content loading is tested in homepage tests
    console.log('Smoke test: Basic page structure verified');
  });
});