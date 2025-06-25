import { test, expect, type Locator } from '@playwright/test';
import { LoginPage } from '../pages/login_page';
import { InventoryPage } from '../pages/inventory_page';
import { CartPage } from '../pages/cart_page';
import { CheckoutPage } from '../pages/checkout_page';

// We can declare the page objects here to be used in all tests.
  // 'let' is used because they will be initialized inside each test.
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  // We can create a helper function for this to reduce repetition.
  const loginAsStandardUser = async () => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.verifyInventoryListIsVisible();
  };

  // test.beforeEach hook runs before each test in the describe block.
  // This is a great place to initialize page objects.
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

test.describe('Junior-Level Tests @mobile', () => {
  test('1. Login with valid standard user', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.verifyInventoryListIsVisible();
  });

  test('2. Login with locked-out user', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.verifyLockedOutUserError();
  });

  test('3. Login with missing credentials', async ({ page }) => {
    await loginPage.navigate();
    // For this test, we demonstrate a more specific method from the LoginPage
    await loginPage.clickLoginButton();
    await loginPage.verifyMissingUsernameError();

  });

  test('4. Add product to cart from inventory', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.verifyInventoryListIsVisible();
    await inventoryPage.addBackpackToCart();
    await inventoryPage.verifyBackpackRemoveButtonIsVisible();
    await inventoryPage.verifyCartBadgeCount('1');

  });

  test('5. Remove product from cart on listing page', async ({ page }) => {
    // First, add the item to the cart as a setup step
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addBackpackToCart();
    await inventoryPage.verifyCartBadgeCount('1');

    // Now, perform the action under test: removing the item
    await inventoryPage.removeBackpackFromCart();
    await inventoryPage.verifyCartBadgeIsNotVisible();

  });

  test('6. Navigate to cart page', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addBackpackToCart();
    await inventoryPage.goToCart();
    await cartPage.verifyCartPageIsLoaded();

  });

  test('7. Checkout with missing information', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addBackpackToCart();
    await inventoryPage.goToCart();
    await cartPage.goToCheckout();
    await checkoutPage.verifyCheckoutStepOneIsLoaded();
    
    // Fill form with missing first name
    await checkoutPage.fillInformation('', 'Doe', '33101');
    await checkoutPage.continueCheckout();
    await checkoutPage.verifyMissingInformationError();

  });

  test('8. Complete successful checkout', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addBackpackToCart();
    await inventoryPage.goToCart();
    await cartPage.goToCheckout();
    
    await checkoutPage.fillInformation('John', 'Doe', '90210');
    await checkoutPage.continueCheckout();
    
    await checkoutPage.verifyCheckoutStepTwoIsLoaded();
    await checkoutPage.finishCheckout();
    
    await checkoutPage.verifyCheckoutIsComplete();
    await checkoutPage.goBackHome();
    
    await inventoryPage.verifyInventoryListIsVisible();

  });

  test('9. Logout from product page', async ({ page }) => {
    await loginPage.navigate();
      await loginPage.login('standard_user', 'secret_sauce');
      await inventoryPage.verifyInventoryListIsVisible();
      await inventoryPage.logout();
      await expect(page).toHaveURL(/.*saucedemo\.com/); // Check we are back at the root
      await expect(loginPage.loginButton).toBeVisible();
    
  });

  test('10. View product detail page', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.verifyInventoryListIsVisible();
    await inventoryPage.viewBackpackDetails();
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.getByRole('button', {name: /Back to products/i})).toBeVisible();

  });

  test('11. Login with valid standard user', async ({ page }) => {
    await loginAsStandardUser();
    await inventoryPage.sortProductsBy('lohi');
    await inventoryPage.verifyProductsAreSortedByPriceLowToHigh();

  });

  const socialMediaTests = [
    { name: 'Twitter', locator: 'socialTwitterLink', expectedUrl: /x\.com\/saucelabs/ },
    { name: 'Facebook', locator: 'socialFacebookLink', expectedUrl: /facebook\.com\/saucelabs/ },
    { name: 'LinkedIn', locator: 'socialLinkedinLink', expectedUrl: /linkedin\.com\/company\/sauce-labs/ }
  ];

  for (const social of socialMediaTests) {
    test(`12. Validate social media footer link for ${social.name}`, async ({ page, context }) => {
      await loginAsStandardUser();

      // Start waiting for new page before clicking
      const pagePromise = context.waitForEvent('page');
      // A trick to access property by string name
      const socialLinkLocator = inventoryPage[social.locator as keyof InventoryPage] as Locator;
      await socialLinkLocator.click();
      const newPage = await pagePromise;
      
      await newPage.waitForLoadState();
      await expect(newPage).toHaveURL(social.expectedUrl);
      await newPage.close();

      // Verify we are still on the inventory page
      await expect(page).toHaveURL(/inventory\.html$/);
    });
  }

  test('14. Error message disappears after valid input', async ({ page }) => {
    await loginAsStandardUser();
    await inventoryPage.addBackpackToCart();
    await inventoryPage.goToCart();
    await cartPage.goToCheckout();

    // Trigger error
    await checkoutPage.continueCheckout();
    await checkoutPage.verifyMissingInformationError("Error: First Name is required");
    
    // Explicitly close the error message and verify it's gone
    await checkoutPage.closeErrorMessage();
    await checkoutPage.verifyErrorMessageIsHidden();

  });

  test('15. Visual snapshot of product page', async ({ page }) => {
    await loginAsStandardUser();
    // The page is ready, take a screenshot.
    // Assertions against the DOM are good before a visual test
    // to ensure the page is in the state you want to capture.
    await expect(inventoryPage.inventoryList).toBeVisible();
    await expect(inventoryPage.shoppingCartLink).toBeVisible();

    //await expect(page).toHaveScreenshot('inventory-page.png');
    await page.screenshot({ path: 'screenshots/full_page_after_login.png', fullPage: true });
    console.log('Full page screenshot after login saved.');

  });


});
