/** @format */

import { expect, Page, Locator } from '@playwright/test';

export class LoginPage {
	page: Page;
	usernameInput: Locator;
	passwordInput: Locator;
	loginButton: Locator;
	registerLink: Locator;
	invalidEmail: Locator;
	invalidPassword: Locator;
	incorrectCredentialsError: Locator;

	constructor(page: Page) {
		this.page = page;
		this.usernameInput = page.getByRole('textbox', { name: 'Email' });
		this.passwordInput = page.getByRole('textbox', {
			name: 'Password',
		});
		this.loginButton = page.getByRole('button', { name: 'Sign In' });
		this.registerLink = page.getByRole('link', { name: 'Register' });
		this.invalidEmail = this.page.getByText('Enter a valid email');
		this.invalidPassword = this.page.getByText(
			'Password must be at least 6 characters',
		);
		this.incorrectCredentialsError = this.page.getByText(
			'Invalid email or password',
		);
	}

	async goto() {
		await this.page.goto('/login');
		await this.isNavigatedToLoginPage();
	}

	async login(username: string, password: string) {
		await this.usernameInput.fill(username);
		await this.passwordInput.fill(password);
		await this.loginButton.click();
	}

	async clickOnRegisterLink() {
		await this.registerLink.click();
	}

	async isNavigatedToLoginPage() {
		await expect(this.page).toHaveURL('/login');
		await expect(this.loginButton).toBeVisible();
	}

	async loginPageVisualTest() {
		await this.page.waitForLoadState('networkidle');
		await expect(this.page).toHaveScreenshot('login-page.png', {
			threshold: 0.15,
		});
	}

	async isInvalidEmailErrorVisible() {
		await expect(this.invalidEmail).toBeVisible();
		await expect(this.invalidEmail).toHaveText('Enter a valid email');
	}

	async isInvalidPasswordErrorVisible() {
		await expect(this.invalidPassword).toBeVisible();
		await expect(this.invalidPassword).toHaveText(
			'Password must be at least 6 characters',
		);
	}

	async isIncorrectCredentialsErrorVisible() {
		await expect(this.incorrectCredentialsError).toBeVisible();
		await expect(this.incorrectCredentialsError).toHaveText(
			'Invalid email or password',
		);
	}
}
