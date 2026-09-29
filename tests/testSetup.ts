/** @format */

import { test as base, expect, request } from '@playwright/test';
import { PageManager } from '../pageObjects/PageManager';
import { TestData } from '../TestData/TestData';

export const test = base.extend({});
export { expect } from '@playwright/test';

let token: string;

test.beforeAll(async ({ browser, request }) => {
	const user = {
		email: TestData.email,
		password: TestData.password,
	};
	const loginResponse = await request.post(
		TestData.apiUrl + '/auth/login',
		{ data: user },
	);
	expect(loginResponse.ok()).toBeTruthy();
	token = (await loginResponse.json()).token;
	console.log(token);
});

test.beforeEach(async ({ page, request }) => {
	page.addInitScript((value) => {
		window.localStorage.setItem('eventhub_token', value);
	}, token);
	await PageManager.getHomePage(page).goto();
});

test.afterEach(async ({ page }) => {
	await PageManager.getHomePage(page).logout();
});
