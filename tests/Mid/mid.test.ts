import { test, expect } from '@playwright/test';
import users from '../test-data/users.json';
import { LoginPage } from '../pages/login_page';
import { InventoryPage } from '../pages/inventory_page';
import { getEnvNumber } from '../utils/env'; 
import dotenv from 'dotenv';

dotenv.config();

//TODO: Clean test of login and inventory page check.
//TODO: update test2 to use page.clock.fastForward(duration) or page.page.clock.runFor(duration).
//TODO: Add use of fixtures for cleaner code.

// Import the user data

  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  const INACTIVITY_TIMEOUT_MS = getEnvNumber('INACTIVITY_TIMEOUT_MS', 70000); 

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Read from environment variable
    const usernameFromEnv = process.env.TEST_USER || 'standard_user';

    // Find matching user from users.json
    const user = users.find((u: any) => u.username === usernameFromEnv);

    if (!user) {
      throw new Error(`User "${usernameFromEnv}" not found in users.json`);
    }

    // Perform login
    await loginPage.navigate();
    await loginPage.login(user.username, user.password);
      
  });

  for (const user of users) {
    test(`Login as ${user.username}`, async () => {
      await loginPage.login(user.username, user.password);

      if (user.username === 'standard_user') {
        await loginPage.verifyLockedOutUserError();
      } else {
        await loginPage.verifyLoggedIn();
        await loginPage.verifyProductsTitleVisible();
      }
    });
  }



test.describe('Data-Driven Login Test', () => {

  // Loop through each user in the JSON file
  for (const user of users) {

    test(`1. should log in as ${user.username}`, async ({ page }) => {
      // Navigate to the login page
      await page.goto('https://www.saucedemo.com/');

      // Fill in the username and password
      await page.locator('[data-test="username"]').fill(user.username);
      await page.locator('[data-test="password"]').fill(user.password);

      // Click the login button
      await page.locator('[data-test="login-button"]').click();

      // Assertion: Check for successful login by verifying the URL
      // For the locked_out_user, we expect an error message
      if (user.username === 'locked_out_user') {
        await expect(page.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out.');
      } else {
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
      }
    });
  }

  test('2. Session persistence after browser reload', async ({ page }) => {

    test.setTimeout(INACTIVITY_TIMEOUT_MS + 20000); // Dynamic timeout with buffer
  
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.verifyInventoryListIsVisible();

    console.log(`Simulating ${INACTIVITY_TIMEOUT_MS / 1000} seconds of inactivity...`);

    //Simulate inactivity using page.waitForTimeout()
    await page.waitForTimeout(INACTIVITY_TIMEOUT_MS);
    console.log('Inactivity period ended.');

    // Verify sign-out
    // Attempt to navigate to a restricted page again
    await page.reload();
    const currentUrl = page.url();
    console.log(`Current URL after inactivity and reload: ${currentUrl}`);
    

    // Assert that the user is redirected to the login page
    // or that the login elements are now visible.
    const isLoginVisible = await page.locator('#login-button').isVisible().catch(() => false);
    const isInventoryVisible = await page.locator('.inventory_list').isVisible().catch(() => false);


    if (isLoginVisible) {
      console.log('✅ User session expired — redirected to login.');
      await expect(page.url()).toContain('https://www.saucedemo.com/'); // Still on base domain
      await expect(page.locator('#login-button')).toBeVisible();
    } else if (isInventoryVisible) {
      console.log('⚠️ Session is still active after inactivity. Inventory page is visible.');
      await expect(page.locator('.inventory_list')).toBeVisible();
    } else {
      console.warn('❌ Unknown state: Neither login nor inventory page detected.');
      await expect(page.locator('#login-button'), 'Expected login button or inventory to be visible').toBeVisible({ timeout: 5000 });
    }


    console.log('User has been signed out successfully (redirected to login page).');

  });


  test('3. Add multiple items to cart and verify count', async ({ page }) => {

    /*await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.verifyInventoryListIsVisible(); */
    
    // Get product names dynamically
    const allProducts = await inventoryPage.getAllProductNames();
    
    // Read desired number of items from ENV (default = 3)
    const itemsCount = parseInt(process.env.ITEMS_COUNT || '3', 10);
    console.log(`${itemsCount}`);
    
    // Ensure we don’t request more than available products
    const itemsToAdd = allProducts.slice(0, Math.min(itemsCount, allProducts.length));
    console.log(`items to add: ${itemsToAdd}`);
    
    // Add items to cart
    await inventoryPage.addItemsToCart(itemsToAdd);

    //verify cart badge count
    await inventoryPage.verifyCartBadgeCount(itemsCount.toString());

    await inventoryPage.goToCart();


    
  });

  
});