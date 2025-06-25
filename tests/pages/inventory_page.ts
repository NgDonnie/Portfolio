import { type Page, type Locator, expect } from '@playwright/test';

/**
 * InventoryPage class represents the inventory/products page of the Sauce Demo application.
 * It encapsulates all elements and actions for this page.
 */
export class InventoryPage {
    // --- Locators ---
    readonly page: Page;
    readonly inventoryList: Locator;
    readonly backpackAddToCartButton: Locator;
    readonly backpackRemoveFromCartButton: Locator;
    readonly shoppingCartBadge: Locator;
    readonly shoppingCartLink: Locator;
    readonly burgerMenuButton: Locator;
    readonly logoutSidebarLink: Locator;
    readonly backpackProductLink: Locator;

    /**
     * Constructor for the InventoryPage.
     * @param page - The Playwright Page object.
     */
    constructor(page: Page) {
        this.page = page;
        this.inventoryList = page.locator('.inventory_list');
        this.backpackAddToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.backpackRemoveFromCartButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
        this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
        this.burgerMenuButton = page.getByRole('button', { name: /Menu/i });
        this.logoutSidebarLink = page.locator('#logout_sidebar_link');
        this.backpackProductLink = page.locator('#item_4_title_link');
    }

    // --- Actions ---

    /**
     * Clicks the 'Add to Cart' button for the Sauce Labs Backpack.
     */
    async addBackpackToCart() {
        await this.backpackAddToCartButton.click();
    }

    /**
     * Clicks the 'Remove' button for the Sauce Labs Backpack.
     */
    async removeBackpackFromCart() {
        await this.backpackRemoveFromCartButton.click();
    }

    /**
     * Clicks the shopping cart icon to navigate to the cart page.
     */
    async goToCart() {
        await this.shoppingCartLink.click();
    }
    
    /**
     * Clicks the product link for the Sauce Labs Backpack to view details.
     */
    async viewBackpackDetails() {
        await this.backpackProductLink.click();
    }

    /**
     * Opens the burger menu and clicks the logout link.
     */
    async logout() {
        await this.burgerMenuButton.click();
        await this.logoutSidebarLink.click();
    }


    // --- Verifications ---

    /**
     * Asserts that the main inventory list is visible.
     */
    async verifyInventoryListIsVisible() {
        await expect(this.page).toHaveURL(/inventory\.html$/);
        await expect(this.inventoryList).toBeVisible();
    }
    
    /**
     * Asserts that the shopping cart badge shows the correct count.
     * @param count - The expected number of items in the cart.
     */
    async verifyCartBadgeCount(count: string) {
        await expect(this.shoppingCartBadge).toBeVisible();
        await expect(this.shoppingCartBadge).toHaveText(count);
    }
    
    /**
     * Asserts that the remove button for the backpack is visible.
     */
    async verifyBackpackRemoveButtonIsVisible() {
        await expect(this.backpackRemoveFromCartButton).toBeVisible();
        await expect(this.backpackRemoveFromCartButton).toHaveText(/remove/i);
    }

    /**
     * Asserts that the cart badge is not visible.
     */
    async verifyCartBadgeIsNotVisible() {
       await expect(this.shoppingCartBadge).not.toBeVisible();
    }
}