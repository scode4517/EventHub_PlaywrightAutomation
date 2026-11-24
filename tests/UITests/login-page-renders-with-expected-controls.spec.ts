/** @format */

import { test, expect } from '@playwright/test';
import { PageManager } from '../../pageObjects/PageManager';

test.describe('Login UI', () => {
	test('Login page renders with expected controls', async ({ page }) => {
		const loginPage = PageManager.getLoginPage(page);

		// 1. Navigate to /login using the LoginPage page object.
		await loginPage.goto();

		// 2. Verify the URL is /login and the heading, Email and Password inputs, Sign In button, and Register link are visible and enabled.
		await loginPage.isNavigatedToLoginPage();
		const emailInput = page.getByRole('textbox', { name: 'Email' });
		const passwordInput = page.getByRole('textbox', {
			name: 'Password',
		});
		const signInButton = page.getByRole('button', { name: 'Sign In' });
		const registerLink = page.getByRole('link', { name: 'Register' });

		await expect(
			page.getByRole('heading', { name: 'Sign in to EventHub' }),
		).toBeVisible();
		await expect(emailInput).toBeVisible();
		await expect(emailInput).toBeEnabled();
		await expect(passwordInput).toBeVisible();
		await expect(passwordInput).toBeEnabled();
		await expect(signInButton).toBeEnabled();
		await expect(registerLink).toBeVisible();
		await expect(registerLink).toBeEnabled();

		// 3. Verify the Password input has type=password so text is masked.
		await expect(passwordInput).toHaveAttribute('type', 'password');
	});
});
