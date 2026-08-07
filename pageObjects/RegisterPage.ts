/** @format */

import { expect, Page, Locator } from '@playwright/test';

export class RegisterPage {
	page: Page;
	usernameInput: Locator;
	passwordInput: Locator;
	registerButton: Locator;
	registerLink: Locator;
	loginLink: Locator;
	confirmPasswordInput: Locator;
	invalidEmail: Locator;
	invalidPassword: Locator;
	mismatchPasswordError: Locator;

	constructor(page: Page) {
		this.page = page;
		this.usernameInput = page.getByRole('textbox', { name: 'Email' });
		this.passwordInput = page.getByRole('textbox', {
			name: 'Min 8 chars, uppercase, number & symbol',
		});
		this.confirmPasswordInput = page.getByRole('textbox', {
			name: 'Repeat your password',
		});
		this.registerButton = page.getByRole('button', {
			name: 'Create Account',
		});
		this.registerLink = page.getByRole('link', { name: 'Register' });
		this.loginLink = page.getByRole('link', { name: 'Sign in' });
		this.invalidEmail = this.page.getByText('Enter a valid email');
		this.invalidPassword = this.page.getByText(
			'Password does not meet the requirements below',
		);
		this.mismatchPasswordError = this.page.getByText(
			'Passwords do not match',
		);
	}

	async goto() {
		await this.page.goto('/register');
		await this.isNavigatedToRegisterPage();
	}

	async isNavigatedToRegisterPage() {
		await expect(this.page).toHaveURL('/register');
		await expect(this.registerButton).toBeVisible();
	}

	async registerPageVisualTest() {
		await this.page.waitForLoadState('networkidle');
		await expect(this.usernameInput).toHaveScreenshot(
			'register-page.png',
			{
				threshold: 0.15,
			},
		);
	}

	async clickOnLoginLink() {
		await this.loginLink.click();
	}

	async register(
		username: string,
		password: string,
		confirmPassword: string,
	) {
		await this.usernameInput.fill(username);
		await this.passwordInput.fill(password);
		await this.confirmPasswordInput.fill(confirmPassword);
		await this.registerButton.click();
	}

	async isInvalidEmailErrorVisible() {
		await expect(this.invalidEmail).toBeVisible();
		await expect(this.invalidEmail).toHaveText('Enter a valid email');
	}

	async isInvalidPasswordErrorVisible() {
		await expect(this.invalidPassword).toBeVisible();
		await expect(this.invalidPassword).toHaveText(
			'Password does not meet the requirements below',
		);
	}

	async isMismatchPasswordErrorVisible() {
		await expect(this.mismatchPasswordError).toBeVisible();
	}
}
