import { test, expect } from '@playwright/test';
import users from '../test-data/users.json';

// Import the user data

test.describe('Data-Driven Login Test', () => {

  // Loop through each user in the JSON file
  for (const user of users) {

    test(`should log in as ${user.username}`, async ({ page }) => {
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
});