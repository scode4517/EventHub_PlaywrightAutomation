/** @format */

import { test as base } from '@playwright/test';
import { PageManager } from '../pageObjects/PageManager';

export const test = base.extend({});
export { expect } from '@playwright/test';

test.beforeAll(async ({ browser }) => {
	const setupPage = await browser.newPage();
	await PageManager.getLoginPage(setupPage).goto();
	await setupPage.close();
});

test.beforeEach(async ({ page }) => {
	await PageManager.getLoginPage(page).goto();
});

test.afterEach(async ({ page }) => {
	await PageManager.getHomePage(page).logout();
});
