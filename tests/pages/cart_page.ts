import { type Page, type Locator, expect } from '@playwright/test';

/**
 * CartPage class represents the shopping cart page.
 */
export class CartPage {
    // --- Locators ---
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly cartContentsContainer: Locator;
    readonly checkoutButton: Locator;

    /**
     * Constructor for the CartPage.
     * @param page - The Playwright Page object.
     */
    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.locator('.title');
        this.cartContentsContainer = page.locator('#cart_contents_container');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }

    // --- Actions ---

    /**
     * Clicks the 'Checkout' button to proceed to the next step.
     */
    async goToCheckout() {
        await this.checkoutButton.click();
    }

    // --- Verifications ---

    /**
     * Asserts that the cart page is loaded correctly by checking the URL and title.
     */
    async verifyCartPageIsLoaded() {
        await expect(this.page).toHaveURL(/cart\.html$/);
        await expect(this.pageTitle).toHaveText(/Your Cart/i);
        await expect(this.cartContentsContainer).toBeVisible();
    }
}