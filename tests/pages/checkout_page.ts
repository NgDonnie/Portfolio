import { type Page, type Locator, expect } from '@playwright/test';

/**
 * CheckoutPage class represents the checkout process, covering multiple steps.
 */
export class CheckoutPage {
    // --- Locators for Step One ---
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly errorMessage: Locator;

    // --- NEW Locator for Test 14 ---
    readonly errorCloseButton: Locator;

    // --- Locators for Step Two ---
    readonly finishButton: Locator;
    
    // --- Locators for Completion Page ---
    readonly thankYouHeader: Locator;
    readonly backHomeButton: Locator;

    /**
     * Constructor for the CheckoutPage.
     * @param page - The Playwright Page object.
     */
    constructor(page: Page) {
        this.page = page;
        // Step One
        this.pageTitle = page.locator('.title');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.errorMessage = page.locator('[data-test="error"]');
        // --- NEW Locator initialization ---
        this.errorCloseButton = page.locator('button.error-button');

        // Step Two
        this.finishButton = page.locator('[data-test="finish"]');

        // Completion
        this.thankYouHeader = page.getByRole('heading', { name: /Thank you/i });
        this.backHomeButton = page.locator('[data-test="back-to-products"]');
    }

    // --- Actions ---

    /**
     * Fills the checkout information form.
     * @param firstName - The first name.
     * @param lastName - The last name.
     * @param postalCode - The postal code.
     */
    async fillInformation(firstName: string, lastName: string, postalCode: string) {
        if(firstName) await this.firstNameInput.fill(firstName);
        if(lastName) await this.lastNameInput.fill(lastName);
        if(postalCode) await this.postalCodeInput.fill(postalCode);
    }
    
    /**
     * Clicks the 'Continue' button.
     */
    async continueCheckout() {
        await this.continueButton.click();
    }

    /**
     * Clicks the 'Finish' button to complete the purchase.
     */
    async finishCheckout() {
        await this.finishButton.click();
    }

    /**
     * Clicks the 'Back Home' button after a successful purchase.
     */
    async goBackHome() {
        await this.backHomeButton.click();
    }

    // --- NEW Action for Test 14 ---
    /**
     * Clicks the 'x' button to close the error message container.
     */
    async closeErrorMessage() {
        await this.errorCloseButton.click();
    }


    // --- Verifications ---

    /**
     * Asserts that the checkout information page is loaded.
     */
    async verifyCheckoutStepOneIsLoaded() {
        await expect(this.page).toHaveURL(/checkout-step-one\.html$/);
        await expect(this.pageTitle).toHaveText(/Checkout: Your Information/i);
    }

    /**
     * Asserts that the checkout overview page (step two) is loaded.
     */
    async verifyCheckoutStepTwoIsLoaded() {
        await expect(this.page).toHaveURL(/checkout-step-two\.html$/);
        await expect(this.pageTitle).toHaveText(/Checkout: Overview/i);
    }

    /**
     * Asserts that the checkout completion page is displayed.
     */
    async verifyCheckoutIsComplete() {
        await expect(this.page).toHaveURL(/checkout-complete\.html$/);
        await expect(this.thankYouHeader).toBeVisible();
    }

    /**
     * Asserts that the error message for missing information is visible.
     */
    async verifyMissingInformationError(expectedError: string = "Error: First Name is required") {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toHaveText(expectedError);
    }

    // --- NEW Verifications for Test 14 ---
    /**
     * Asserts that the error message container is no longer visible.
     */
    async verifyErrorMessageIsHidden() {
        await expect(this.errorMessage).not.toBeVisible();
        await expect(this.errorCloseButton).not.toBeVisible();
    }
}