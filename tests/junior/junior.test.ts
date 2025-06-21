import { test, expect } from '@playwright/test';

test.describe('Junior-Level Tests', () => {
  test('1. Login with valid standard user', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('2. Login with locked-out user', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'locked_out_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toHaveText(/locked out/);
  });
  
  test('3. Login with missing credentials', async ({ page }) => {
    await page.goto('/');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toHaveText(/is required/);
    
    
  });
});
