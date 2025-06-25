import { test, expect } from '@playwright/test';

test.describe('Junior-Level-Mobile Tests @mobile', () => {

    test('13. Responsive view (mobile 375px)', async ({ page }) => {
    await page.goto('/');
    const viewportSize = page.viewportSize();
    await expect(viewportSize?.width).toBe(375);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page.getByRole('button' , {name: /Open/i})).toBeVisible;
    await page.getByRole('button' , {name: /Open/i}).click();
    await expect(page.locator('a#logout_sidebar_link[data-test="logout-sidebar-link"]')).toContainText(/Logout/i);

  });
  
});