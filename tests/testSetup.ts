/** @format */

import { test as base, expect, type Page } from '@playwright/test';
import { PageManager } from '../pageObjects/PageManager';
import { TestData } from '../TestData/TestData';
import { LoginPage } from '../pageObjects/LoginPage';
import { HomePage } from '../pageObjects/HomePage';

export const test = base.extend<{ authenticatedPage: Page }>({
	authenticatedPage: async ({ page }, use) => {
		let loginPage: LoginPage = PageManager.getLoginPage(page);
		let homePage: HomePage = PageManager.getHomePage(page);

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);

		await use(page); // Provide the authenticated page to the test

		homePage.logout();
	},
});
