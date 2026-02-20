import { test, expect } from '@playwright/test';

test.describe('Catalog User Journey (E2E)', () => {
  test('should allow user to select a location and view categories', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const locationSelect = page.getByRole('button', { name: /Chosen location/i });
    await expect(locationSelect).toBeVisible();

    const tabs = page.getByRole('tab');
    await expect(tabs.first()).toBeVisible();

    const secondCategoryTab = tabs.nth(1);
    await secondCategoryTab.click();

    await expect(page).toHaveURL(/\?category=/);

    const searchInput = page.getByPlaceholder('Search items...');
    await expect(searchInput).toBeVisible();
  });
});