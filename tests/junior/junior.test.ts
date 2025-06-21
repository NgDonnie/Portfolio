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

  test('4. Add product to cart from inventory', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText(/Backpack/);
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toHaveText(/to cart/);
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText(/remove/i);
    await expect(page.locator('.shopping_cart_container .shopping-cart-badge')).toBeVisible;
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(/1/);
    
  });

  test('5. Remove product from cart on listing page', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText(/Backpack/);
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toHaveText(/to cart/);
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText(/remove/i);
    await expect(page.locator('.shopping_cart_container .shopping-cart-badge')).toBeVisible;
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(/1/);
    await page.click('[data-test="remove-sauce-labs-backpack"]');
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toHaveText(/to cart/);
    await expect(page.locator('.shopping_cart_container .shopping-cart-badge')).not.toBeVisible;
    
  });
});
