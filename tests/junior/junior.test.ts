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
    await expect(page.locator('#shopping_cart_container')).toBeVisible();
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
    await expect(page.locator('#shopping_cart_container')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(/1/);
    await page.click('[data-test="remove-sauce-labs-backpack"]');
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toHaveText(/to cart/);
    await expect(page.locator('.shopping_cart_container .shopping-cart-badge')).not.toBeVisible();

  });

  test('6. Navigate to cart page', async ({ page }) => {

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
    await expect(page.locator('#shopping_cart_container')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(/1/);
    await page.click('a.shopping_cart_link[data-test="shopping-cart-link"]');
    await expect(page).toHaveURL(/cart\.html$/);
    await expect(page.locator('.title')).toHaveText(/Your Cart/i);
    await expect(page.locator('#cart_contents_container')).toBeVisible();

  });

  test('7. Checkout with missing information', async ({ page }) => {

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
    await expect(page.locator('#shopping_cart_container')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(/1/);
    await page.click('a.shopping_cart_link[data-test="shopping-cart-link"]');
    await expect(page).toHaveURL(/cart\.html$/);
    await expect(page.locator('.title')).toHaveText(/Your Cart/i);
    await expect(page.locator('#cart_contents_container')).toBeVisible();
    await expect(page.locator('button.btn.btn_action.btn_medium.checkout_button[data-test="checkout"]')).toBeVisible();
    await page.click('button.btn.btn_action.btn_medium.checkout_button[data-test="checkout"]');
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await expect(page.locator('.title')).toHaveText(/Checkout/i);
    await expect(page.locator('.checkout_info')).toBeVisible();
    await expect(page.locator('input[type="submit"].submit-button.btn.btn_primary.cart_button.btn_action[data-test="continue"]')).toBeVisible();
    await page.fill('input.input_error.form_input#first-name', '');
    await page.fill('input.input_error.form_input#last-name', 'Doe');
    await page.fill('input.input_error.form_input#postal-code', '33101');
    await page.click('input[type="submit"].submit-button.btn.btn_primary.cart_button.btn_action[data-test="continue"]');
    await expect(page.locator('h3[data-test="error"]')).toBeVisible();
    await expect(page.locator('h3[data-test="error"]')).toHaveText(/Error/i);

  });

  test('8. Complete successful checkout', async ({ page }) => {

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
    await expect(page.locator('#shopping_cart_container')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(/1/);
    await page.click('a.shopping_cart_link[data-test="shopping-cart-link"]');
    await expect(page).toHaveURL(/cart\.html$/);
    await expect(page.locator('.title')).toHaveText(/Your Cart/i);
    await expect(page.locator('#cart_contents_container')).toBeVisible();
    await expect(page.locator('button.btn.btn_action.btn_medium.checkout_button[data-test="checkout"]')).toBeVisible();
    await page.click('button.btn.btn_action.btn_medium.checkout_button[data-test="checkout"]');
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await expect(page.locator('.title')).toHaveText(/Checkout/i);
    await expect(page.locator('.checkout_info')).toBeVisible();
    await expect(page.locator('input[type="submit"].submit-button.btn.btn_primary.cart_button.btn_action[data-test="continue"]')).toBeVisible();
    await page.fill('input.input_error.form_input#first-name', 'John');
    await page.fill('input.input_error.form_input#last-name', 'Doe');
    await page.fill('input.input_error.form_input#postal-code', '90210');
    await page.click('input[type="submit"].submit-button.btn.btn_primary.cart_button.btn_action[data-test="continue"]');
    await expect(page.locator('span.title[data-test="title"]')).toContainText(/Checkout/); 
    await expect(page.locator('.summary_info_label[data-test="total-info-label"]')).toContainText(/Total/);
    await expect(page.getByRole('button', {name: /finish/i})).toHaveText(/Finish/);
    await page.getByRole('button', {name: /finish/i}).click();
    await expect(page.locator('span.title[data-test="title"]')).toContainText(/Complete/i);
    await expect(page.getByRole('heading', {name: /Thank you/i})).toBeVisible();
    await expect(page.getByRole('button', {name: /back/i})).toHaveText(/back/i);
    await page.getByRole('button', {name: /back/i}).click();
    await expect(page).toHaveURL(/inventory\.html$/);

  });

  test('9. Logout from product page', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await page.getByRole('button', {name: /Menu/i}).click();
    await expect(page.locator('a#about_sidebar_link[data-test="about-sidebar-link"]')).toContainText(/About/i);
    await expect(page.locator('a#logout_sidebar_link[data-test="logout-sidebar-link"]')).toContainText(/Logout/i);
    await page.locator('#logout_sidebar_link').click();
    await expect(page).toHaveURL(/saucedemo/i);
    await expect(page.locator('input#login-button[data-test="login-button"]')).toBeVisible();
    
  });



});
