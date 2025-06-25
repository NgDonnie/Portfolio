import { type Page, type Locator, expect } from '@playwright/test';

/**
 * LoginPage class represents the login page of the Sauce Demo application.
 * It encapsulates all the elements and actions that can be performed on the login page.
 */
export class LoginPage {
    // --- Locators ---
    // It's a good practice to make locators readonly and private or protected.
    // This prevents them from being modified from outside the class.
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    /**
     * Constructor for the LoginPage.
     * @param page - The Playwright Page object.
     */
    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    // --- Actions ---

    /**
     * Navigates to the login page.
     */
    async navigate() {
        await this.page.goto('/');
    }

    /**
     * Fills the username and password fields and clicks the login button.
     * This is a high-level action that combines several smaller steps.
     * @param username - The username to enter.
     * @param password - The password to enter.
     */
    async login(username: string, password?: string) {
        await this.usernameInput.fill(username);
        // The password may not always be provided, so we check for it.
        if (password) {
            await this.passwordInput.fill(password);
        }
        await this.loginButton.click();
    }

    /**
     * Clicks the login button without entering credentials.
     */
    async clickLoginButton() {
        await this.loginButton.click();
    }


    // --- Verifications ---

    /**
     * Asserts that the error message for a locked-out user is visible and has the correct text.
     */
    async verifyLockedOutUserError() {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toHaveText(/locked out/);
    }

    /**
     * Asserts that the error message for missing credentials is visible and has the correct text.
     */
    async verifyMissingUsernameError() {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toHaveText(/is required/);
    }
}