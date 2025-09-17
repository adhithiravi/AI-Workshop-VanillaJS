const { test, expect } = require('@playwright/test');

test.describe('Smoke Tests', () => {
  test('should load homepage and verify basic elements', async ({ page }) => {
    // Visit the homepage
    await page.goto('http://localhost:4000/');

    // Assert that the page title contains "Bethany"
    await expect(page).toHaveTitle(/Bethany/);

    // Assert that an element with id="pies-grid" (or data-testid="pies-grid") is visible
    // Based on the HTML, the element has id="monthly" and class="pies-grid"
    const piesGrid = page.locator('#monthly.pies-grid');
    await expect(piesGrid).toBeVisible();
  });
});