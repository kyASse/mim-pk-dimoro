import { test, expect } from '@playwright/test';

test('home page has school name in title', async ({ page }) => {
  await page.goto('/');

  // Expect the page title to contain the school name.
  await expect(page).toHaveTitle(/MIM|Madrasah Ibtidaiyah Muhammadiyah/);
});

test('home page loads successfully', async ({ page }) => {
  await page.goto('/');

  // Expect the page to return a successful response.
  await expect(page).toHaveURL('/');
  await expect(page.locator('body')).toBeVisible();
});
