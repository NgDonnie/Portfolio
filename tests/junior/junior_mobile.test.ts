import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/login_page';
import { InventoryPage } from '../pages/inventory_page';

  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  const viewPortSize = async (page: Page) => {
    const viewportSize = page.viewportSize();
    await expect(viewportSize?.width).toBe(375);
  };

  const responsiveTest = async (page: Page) => {
    await expect(page.getByRole('button' , {name: /Open/i})).toBeVisible;
    await page.getByRole('button' , {name: /Open/i}).click();
    await expect(page.locator('a#logout_sidebar_link[data-test="logout-sidebar-link"]')).toContainText(/Logout/i);
  };

  test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      inventoryPage = new InventoryPage(page);      
  });

test.describe('Junior-Level-Mobile Tests @mobile', () => {

    test('13. Responsive view (mobile 375px)', async ({ page }) => {
    await loginPage.navigate();
    await viewPortSize(page);
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.verifyInventoryListIsVisible();
    await responsiveTest(page);

  });
  
});