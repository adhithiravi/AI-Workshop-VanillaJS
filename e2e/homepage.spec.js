const { test, expect } = require('@playwright/test');

test.describe('Home Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to ensure clean state
    await page.goto('http://localhost:4000/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test.describe('Pies of the Month Section', () => {
    test('should display pies of the month section with correct title', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Wait for the page to load and API call to complete
      await page.waitForLoadState('networkidle');

      // Check that the "Pies of the Month" section exists
      const featuredSection = page.locator('#featured');
      await expect(featuredSection).toBeVisible();

      // Check the section title
      const sectionTitle = featuredSection.locator('h2');
      await expect(sectionTitle).toHaveText('Pies of the Month');

      // Check that the monthly pies grid exists
      const monthlyGrid = page.locator('#monthly.pies-grid');
      await expect(monthlyGrid).toBeVisible({ timeout: 10000 });
    });

    test('should load and display pie cards in the monthly section', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Wait for the page to load and pie cards to be rendered
      await page.waitForLoadState('networkidle');

      // Check what's in the monthly grid
      const monthlyGrid = page.locator('#monthly.pies-grid');

      // Wait for pie cards to be rendered - try multiple approaches for WebKit compatibility
      try {
        await page.waitForSelector('.pie-card', { timeout: 10000 });
      } catch (error) {
        // Fallback: wait for content to be present in the monthly grid
        await page.waitForFunction(() => {
          const grid = document.querySelector('#monthly.pies-grid');
          return grid && grid.children.length > 0;
        }, { timeout: 10000 });
      }

      // Check that pie cards are present (expecting 3 based on API response)
      const pieCards = page.locator('.pie-card');
      const pieCount = await pieCards.count();

      // If pie cards aren't found, check for the content in the grid
      if (pieCount === 0) {
        const gridContent = await monthlyGrid.textContent();
        // Check if the content contains pie information
        expect(gridContent).toContain('Cherry Pie');
        expect(gridContent).toContain('Blueberry Pie');
        expect(gridContent).toContain('Strawberry Cheesecake');
      } else {
        await expect(pieCards).toHaveCount(3, { timeout: 5000 });
      }

      // Verify each pie card has required elements (only if pie cards are found)
      if (pieCount > 0) {
        const firstCard = pieCards.first();
        await expect(firstCard.locator('img')).toBeVisible();
        await expect(firstCard.locator('h3')).toBeVisible();
        await expect(firstCard.locator('.price')).toBeVisible();
        await expect(firstCard.locator('button')).toBeVisible();
        await expect(firstCard.locator('button')).toHaveText('Add to Cart');
      }
    });

    test('should handle API failure gracefully', async ({ page }) => {
      // Mock API failure
      await page.route('**/api/pies-of-the-month', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });

      await page.goto('http://localhost:4000/');

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Check that error message is displayed
      const monthlyGrid = page.locator('#monthly.pies-grid');
      await expect(monthlyGrid).toContainText('Failed to load pies of the month');
    });
  });

  test.describe('Hero Carousel Functionality', () => {
    test('should display carousel with all slides and indicators', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Check that hero section exists
      const heroSection = page.locator('#hero');
      await expect(heroSection).toBeVisible();

      // Check that all slides are present
      const slides = page.locator('.hero-slide');
      await expect(slides).toHaveCount(3);

      // Check that the first slide is active by default
      const firstSlide = slides.first();
      await expect(firstSlide).toHaveClass(/active/);

      // Check that indicators are present
      const indicators = page.locator('#hero-indicators');
      await expect(indicators).toBeVisible();

      // Check that indicator buttons are present
      const indicatorButtons = indicators.locator('button');
      await expect(indicatorButtons).toHaveCount(3);

      // Check that first indicator is active
      const firstIndicator = indicatorButtons.first();
      await expect(firstIndicator).toHaveClass(/active/);
    });

    test('should navigate carousel when clicking indicators', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      const slides = page.locator('.hero-slide');
      const indicators = page.locator('#hero-indicators button');

      // Click on the second indicator
      await indicators.nth(1).click();

      // Wait a bit for the transition
      await page.waitForTimeout(500);

      // Check that the second slide is now active
      await expect(slides.nth(1)).toHaveClass(/active/);
      await expect(slides.first()).not.toHaveClass(/active/);

      // Check that the second indicator is now active
      await expect(indicators.nth(1)).toHaveClass(/active/);
      await expect(indicators.first()).not.toHaveClass(/active/);

      // Click on the third indicator
      await indicators.nth(2).click();
      await page.waitForTimeout(500);

      // Check that the third slide is now active
      await expect(slides.nth(2)).toHaveClass(/active/);
      await expect(slides.nth(1)).not.toHaveClass(/active/);

      // Check that the third indicator is now active
      await expect(indicators.nth(2)).toHaveClass(/active/);
      await expect(indicators.nth(1)).not.toHaveClass(/active/);
    });

    test('should auto-advance carousel slides', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      const slides = page.locator('.hero-slide');
      const indicators = page.locator('#hero-indicators button');

      // Wait for auto-advance (carousel advances every 5 seconds)
      await page.waitForTimeout(6000);

      // Check that the carousel has advanced to the second slide
      await expect(slides.nth(1)).toHaveClass(/active/);
      await expect(indicators.nth(1)).toHaveClass(/active/);

      // Wait for another auto-advance
      await page.waitForTimeout(6000);

      // Check that the carousel has advanced to the third slide
      await expect(slides.nth(2)).toHaveClass(/active/);
      await expect(indicators.nth(2)).toHaveClass(/active/);
    });

    test('should reset auto-advance timer when manually navigating', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      const slides = page.locator('.hero-slide');
      const indicators = page.locator('#hero-indicators button');

      // Wait for first auto-advance
      await page.waitForTimeout(6000);
      await expect(slides.nth(1)).toHaveClass(/active/);

      // Manually click back to first slide
      await indicators.first().click();
      await page.waitForTimeout(500);
      await expect(slides.first()).toHaveClass(/active/);

      // Wait for auto-advance to happen again (should advance to second slide)
      await page.waitForTimeout(6000);
      await expect(slides.nth(1)).toHaveClass(/active/);
    });
  });

  test.describe('Add to Cart Functionality', () => {
    test('should add pie to cart when clicking Add to Cart button', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Wait for the page to load and pie cards to be rendered
      await page.waitForLoadState('networkidle');

      // Wait for content to be present in the monthly grid
      await page.waitForFunction(() => {
        const grid = document.querySelector('#monthly.pies-grid');
        return grid && grid.children.length > 0;
      }, { timeout: 10000 });

      // Try to find pie cards, fallback to grid content if needed
      let addToCartButton;
      const pieCards = page.locator('.pie-card');
      const pieCount = await pieCards.count();

      if (pieCount > 0) {
        addToCartButton = pieCards.first().locator('button');
      } else {
        // Fallback: look for Add to Cart button in the monthly grid
        addToCartButton = page.locator('#monthly.pies-grid button').first();
      }

      // Check initial cart count
      const cartCount = page.locator('#cart-count');
      await expect(cartCount).toHaveText('0');

      // Click Add to Cart button
      await addToCartButton.click();

      // Check that cart count has increased
      await expect(cartCount).toHaveText('1');

      // Verify cart data in localStorage
      const cartData = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('cart') || '[]');
      });

      expect(cartData).toHaveLength(1);
      expect(cartData[0]).toHaveProperty('id');
      expect(cartData[0]).toHaveProperty('name');
      expect(cartData[0]).toHaveProperty('price');
      expect(cartData[0]).toHaveProperty('quantity', 1);
    });

    test('should increment quantity when adding same pie multiple times', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Wait for the page to load and pie cards to be rendered
      await page.waitForLoadState('networkidle');

      // Wait for content to be present in the monthly grid
      await page.waitForFunction(() => {
        const grid = document.querySelector('#monthly.pies-grid');
        return grid && grid.children.length > 0;
      }, { timeout: 10000 });

      // Try to find pie cards, fallback to grid content if needed
      let addToCartButton;
      const pieCards = page.locator('.pie-card');
      const pieCount = await pieCards.count();

      if (pieCount > 0) {
        addToCartButton = pieCards.first().locator('button');
      } else {
        // Fallback: look for Add to Cart button in the monthly grid
        addToCartButton = page.locator('#monthly.pies-grid button').first();
      }

      // Add the same pie twice
      await addToCartButton.click();
      await addToCartButton.click();

      // Check that cart count shows 2
      const cartCount = page.locator('#cart-count');
      await expect(cartCount).toHaveText('2');

      // Verify cart data in localStorage
      const cartData = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('cart') || '[]');
      });

      expect(cartData).toHaveLength(1);
      expect(cartData[0]).toHaveProperty('quantity', 2);
    });

    test('should add different pies to cart separately', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Wait for the page to load and pie cards to be rendered
      await page.waitForLoadState('networkidle');

      // Wait for content to be present in the monthly grid
      await page.waitForFunction(() => {
        const grid = document.querySelector('#monthly.pies-grid');
        return grid && grid.children.length > 0;
      }, { timeout: 10000 });

      const pieCards = page.locator('.pie-card');
      const cartCount = page.locator('#cart-count');
      const pieCount = await pieCards.count();

      // Add first pie
      if (pieCount > 0) {
        await pieCards.first().locator('button').click();
      } else {
        await page.locator('#monthly.pies-grid button').first().click();
      }
      await expect(cartCount).toHaveText('1');

      // Add second pie if available
      if (pieCount > 1) {
        await pieCards.nth(1).locator('button').click();
        await expect(cartCount).toHaveText('2');

        // Verify cart data in localStorage
        const cartData = await page.evaluate(() => {
          return JSON.parse(localStorage.getItem('cart') || '[]');
        });

        expect(cartData).toHaveLength(2);
        expect(cartData[0].id).not.toBe(cartData[1].id);
      }
    });

    test('should update cart UI when cart is modified', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Wait for the page to load and pie cards to be rendered
      await page.waitForLoadState('networkidle');

      // Wait for content to be present in the monthly grid
      await page.waitForFunction(() => {
        const grid = document.querySelector('#monthly.pies-grid');
        return grid && grid.children.length > 0;
      }, { timeout: 10000 });

      // Add a pie to cart
      const pieCards = page.locator('.pie-card');
      const pieCount = await pieCards.count();

      if (pieCount > 0) {
        await pieCards.first().locator('button').click();
      } else {
        await page.locator('#monthly.pies-grid button').first().click();
      }

      // Open cart
      const cartToggle = page.locator('#cart-toggle');
      await cartToggle.click();

      // Check that cart is visible
      const cart = page.locator('#cart');
      await expect(cart).toBeVisible();
      await expect(cart).not.toHaveClass(/hidden/);

      // Check that cart items are displayed
      const cartItems = page.locator('#cart-items');
      await expect(cartItems).toBeVisible();

      // Check that cart total is displayed
      const cartTotal = page.locator('#cart-total');
      await expect(cartTotal).toBeVisible();
      await expect(cartTotal).not.toHaveText('0.00');

      // Check that clear button is present
      const clearButton = page.locator('#cart-clear');
      await expect(clearButton).toBeVisible();
      await expect(clearButton).toHaveText('Clear');
    });

    test('should clear cart when clicking clear button', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Wait for the page to load and pie cards to be rendered
      await page.waitForLoadState('networkidle');

      // Wait for content to be present in the monthly grid
      await page.waitForFunction(() => {
        const grid = document.querySelector('#monthly.pies-grid');
        return grid && grid.children.length > 0;
      }, { timeout: 10000 });

      // Add pies to cart
      const pieCards = page.locator('.pie-card');
      const pieCount = await pieCards.count();

      if (pieCount > 0) {
        await pieCards.first().locator('button').click();
        if (pieCount > 1) {
          await pieCards.nth(1).locator('button').click();
        }
      } else {
        await page.locator('#monthly.pies-grid button').first().click();
        const buttonCount = await page.locator('#monthly.pies-grid button').count();
        if (buttonCount > 1) {
          await page.locator('#monthly.pies-grid button').nth(1).click();
        }
      }

      // Open cart
      await page.locator('#cart-toggle').click();

      // Clear cart
      await page.locator('#cart-clear').click();

      // Check that cart count is reset
      const cartCount = page.locator('#cart-count');
      await expect(cartCount).toHaveText('0');

      // Check that cart total is reset
      const cartTotal = page.locator('#cart-total');
      await expect(cartTotal).toHaveText('0.00');

      // Verify localStorage is cleared
      const cartData = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('cart') || '[]');
      });

      expect(cartData).toHaveLength(0);
    });

    test('should persist cart data across page refreshes', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Wait for the page to load and pie cards to be rendered
      await page.waitForLoadState('networkidle');

      // Wait for content to be present in the monthly grid
      await page.waitForFunction(() => {
        const grid = document.querySelector('#monthly.pies-grid');
        return grid && grid.children.length > 0;
      }, { timeout: 10000 });

      // Add pie to cart
      const pieCards = page.locator('.pie-card');
      const pieCount = await pieCards.count();

      if (pieCount > 0) {
        await pieCards.first().locator('button').click();
      } else {
        await page.locator('#monthly.pies-grid button').first().click();
      }

      // Check cart count
      const cartCount = page.locator('#cart-count');
      await expect(cartCount).toHaveText('1');

      // Refresh the page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Check that cart count persists
      await expect(cartCount).toHaveText('1');

      // Open cart and verify items are still there
      await page.locator('#cart-toggle').click();
      const cartItems = page.locator('#cart-items');
      await expect(cartItems).toBeVisible();
    });
  });

  test.describe('Page Navigation and Layout', () => {
    test('should have proper page structure and navigation', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Check page title
      await expect(page).toHaveTitle(/Bethany's Pie Shop/);

      // Check header elements
      const header = page.locator('.header');
      await expect(header).toBeVisible();

      const brand = page.locator('.brand h1');
      await expect(brand).toHaveText("Bethany's Pie Shop");

      const tagline = page.locator('#tagline');
      await expect(tagline).toHaveText('Handmade pies, served with love.');

      // Check navigation links
      const navLinks = page.locator('.top-nav a');
      await expect(navLinks).toHaveCount(5);

      const expectedLinks = ['Home', 'Fruit Pies', 'Cheesecakes', 'Seasonal', 'Cart'];
      for (let i = 0; i < expectedLinks.length; i++) {
        await expect(navLinks.nth(i)).toHaveText(expectedLinks[i]);
      }

      // Check cart preview
      const cartPreview = page.locator('#cart-preview');
      await expect(cartPreview).toBeVisible();

      const cartToggle = page.locator('#cart-toggle');
      await expect(cartToggle).toBeVisible();
      await expect(cartToggle).toHaveText('Cart (0)');
    });

    test('should have shop by category section', async ({ page }) => {
      await page.goto('http://localhost:4000/');

      // Check shop by category section
      const shopCta = page.locator('.shop-cta');
      await expect(shopCta).toBeVisible();

      const sectionTitle = shopCta.locator('h2');
      await expect(sectionTitle).toHaveText('Shop by Category');

      // Check category links
      const categoryLinks = page.locator('.category-link');
      await expect(categoryLinks).toHaveCount(3);

      const expectedCategories = [
        { title: 'Fruit Pies', description: 'Fresh, seasonal fruit pies' },
        { title: 'Cheesecakes', description: 'Rich, creamy cheesecakes' },
        { title: 'Seasonal', description: 'Holiday favorites' }
      ];

      for (let i = 0; i < expectedCategories.length; i++) {
        const link = categoryLinks.nth(i);
        await expect(link.locator('h3')).toHaveText(expectedCategories[i].title);
        await expect(link.locator('p')).toHaveText(expectedCategories[i].description);
      }
    });
  });
});
