/** @format */

import { expect, Page, Locator } from '@playwright/test';

export class RegisterPage {
	page: Page;
	usernameInput: Locator;
	passwordInput: Locator;
	registerButton: Locator;
	registerLink: Locator;

	constructor(page: Page) {
		this.page = page;
		this.usernameInput = page.getByRole('textbox', { name: 'Email' });
		this.passwordInput = page.getByRole('textbox', {
			name: 'Password',
		});
		this.registerButton = page.getByRole('button', {
			name: 'Create Account',
		});
		this.registerLink = page.getByRole('link', { name: 'Register' });
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
}
