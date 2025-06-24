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

  test('10. View product detail page', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText(/Backpack/);
    await page.locator('#item_4_title_link').click();
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.getByRole('button', {name: /Back/i})).toBeVisible();
    await expect(page.getByRole('button', {name: /Back/i})).toContainText(/back/i);

  });

  test('11. Login with valid standard user', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await page.selectOption('.product_sort_container', 'lohi');
    await expect(page.locator('#item_2_title_link[data-test="item-2-title-link"]')).toBeVisible();
    await expect(page.locator('#item_2_title_link[data-test="item-2-title-link"]')).toContainText(/Onesie/i);
    
  // Step 3: Get all the price elements.
  // We'll use the 'data-test' attribute which is good for targeting.
    const priceElements = await page.locator('[data-test="inventory-item-price"]').all();
  // .all() here returns an array of Locator objects, one for each price element.

  // Step 4: Create an empty list to store the actual numbers of the prices.
    const actualPrices: number[] = [];

  // Step 5: Loop through each price element we found.
    for (const element of priceElements) {
    // Get the text inside each price element (e.g., "$7.99")
      const priceText = await element.textContent();

    // Check if priceText is not null or undefined
      if (priceText !== null && priceText !== undefined) {
      // Remove the '$' sign and convert the text to a number.
      // trim() removes any extra spaces.
        const priceNumber = parseFloat(priceText.replace('$', '').trim());

      // Add the number to our actualPrices list.
        actualPrices.push(priceNumber);
      } else {
      // If an element had no text, this indicates an issue, so throw an error.
        throw new Error("Found a price element with no text content.");
      }
    }

  // Optional: Print the extracted prices to see them in the test output (helpful for debugging)
    console.log('Extracted prices:', actualPrices);

  // Step 6: Now, let's check if these prices are in the correct order.
  // We'll loop through the list, comparing each price to the one right after it.
    for (let i = 0; i < actualPrices.length - 1; i++) {
      const currentPrice = actualPrices[i];
      const nextPrice = actualPrices[i + 1];

      // CORRECTED ASSERTION: Remove the second argument for the custom message.
      // Playwright will automatically generate a helpful error message if this fails.
      expect(currentPrice).toBeLessThanOrEqual(nextPrice);
    }

  // If the loop finishes without any failures, it means all prices were sorted correctly!
    console.log('Assertion successful: Prices are sorted from lower to higher.');

  });

  const socialMediaIconsToTest = [
    {
      name: 'Twitter',
      selector: '[data-test="social-twitter"]', // How Playwright finds it (from your HTML)
      expectedUrlPart: 'x.com/saucelabs',  // What URL we expect in the new tab
      socialUrlPart: 'twitter.com/saucelabs'
    },
    {
      name: 'Facebook',
      selector: '[data-test="social-facebook"]', // How Playwright finds it
      expectedUrlPart: 'facebook.com/saucelabs',  // What URL we expect
      socialUrlPart: 'facebook.com/saucelabs'
    },
    {
      name: 'LinkedIn',
      selector: '[data-test="social-linkedin"]', // How Playwright finds it
      expectedUrlPart: 'linkedin.com/company/sauce-labs', // What URL we expect 
      socialUrlPart: 'linkedin.com/company/sauce-labs'
    }
  ];

  for (const iconDetails of socialMediaIconsToTest) {
    
    test(`12. Validate social media footer links opens a new tab for ${iconDetails.name}`, async ({ page, context }) => {
      await page.goto('/');
      await page.fill('#user-name', 'standard_user');
      await page.fill('#password', 'secret_sauce');
      await page.click('#login-button');
      await expect(page).toHaveURL(/inventory\.html$/);
      await expect(page.locator('.inventory_list')).toBeVisible();
      const socialMediaIconLocator = page.locator(iconDetails.selector);
      await expect(socialMediaIconLocator).toBeVisible();
      // Make sure it's set to open in a new tab.
      await expect(socialMediaIconLocator).toHaveAttribute('target', '_blank');
      // Make sure its link (href) points to something sensible (optional, but good).
      await expect(socialMediaIconLocator).toHaveAttribute('href', new RegExp(iconDetails.socialUrlPart));
      console.log('${iconDetails.name} icon is visible and correctly configured.');
      // 5. Click the icon AND wait for the new tab to open.
      // This 'Promise.all' is super important to catch the new tab!
      console.log(`Clicking ${iconDetails.name} icon and waiting for new tab...`);
      const [newPage] = await Promise.all([
        context.waitForEvent('page'), // Playwright starts listening for a new tab/page.
        socialMediaIconLocator.click() // We click the icon, which should open the new tab.
      ]);
      console.log(`New tab for ${iconDetails.name} opened.`);
      // 6. Wait for the new tab to load its content.
      // This ensures the page is ready before we check its URL.
      await newPage.waitForLoadState('domcontentloaded');
      console.log('New tab for ${iconDetails.name} finished loading.');

      // 7. Check if the new tab went to the correct social media page.
      // 'toContainURL' is great for external links as their exact URLs can change.
      await expect(newPage).toHaveURL(new RegExp(iconDetails.expectedUrlPart));
      console.log(`Confirmed new tab navigated to ${iconDetails.name} page.`);

      // 8. Close the new tab.
      // Always close tabs you open to keep your browser tidy during tests.
      await newPage.close();
      console.log(`Closed new tab for ${iconDetails.name}.`);

      // 9. Make sure we are still on the original page.
      // This confirms our main page didn't unexpectedly change.
      await expect(page).toHaveURL(/inventory\.html$/);
      console.log('Confirmed original page is still active after checking ${iconDetails.name}.');
      console.log('--- Test for ${iconDetails.name} completed successfully! ---');


    });
  }

  test('13. Responsive view (mobile 375px)', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });






});
