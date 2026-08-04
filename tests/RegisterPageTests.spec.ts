/** @format */

import { test, expect } from './testSetup';
import { faker } from '@faker-js/faker';
import { PageManager } from '../pageObjects/PageManager';

test(
	'Register page visual test',
	{ tag: '@RegisterTest' },
	async ({ page }) => {
		const registerPage = PageManager.getRegisterPage(page);
		await registerPage.goto();
		await registerPage.registerPageVisualTest();
	},
);

test('Click on login link test', { tag: '@RegisterTest' }, async ({ page }) => {
	const registerPage = PageManager.getRegisterPage(page);
	const loginPage = PageManager.getLoginPage(page);
	await registerPage.goto();
	await registerPage.clickOnLoginLink();
	await loginPage.isNavigatedToLoginPage();
});

test('Valid register test', { tag: '@RegisterTest' }, async ({ page }) => {
	const registerPage = PageManager.getRegisterPage(page);
	const homePage = PageManager.getHomePage(page);
	await registerPage.goto();

	const email = faker.internet.email();
	const password = faker.internet.password({
		length: 12,
		memorable: false,
		pattern: /[A-Za-z0-9!@#$%^&*]/,
		prefix: 'Aa1!',
	});
	await registerPage.register(email, password, password);
	await homePage.isNavigatedToHomePage(email);
});

test(
	'Register with empty credentials test',
	{ tag: '@RegisterErrorTest' },
	async ({ page }) => {
		const registerPage = PageManager.getRegisterPage(page);
		await registerPage.goto();
		await registerPage.register('', '', '');
		await registerPage.isInvalidEmailErrorVisible();
		await registerPage.isInvalidPasswordErrorVisible();
	},
);

test(
	'Register with password mismatch test',
	{ tag: '@RegisterErrorTest' },
	async ({ page }) => {
		const registerPage = PageManager.getRegisterPage(page);
		await registerPage.goto();
		const email = faker.internet.email();
		const password = faker.internet.password({
			length: 12,
			memorable: false,
			pattern: /[A-Za-z0-9!@#$%^&*]/,
			prefix: 'Aa1!',
		});
		await registerPage.register(email, password, 'Password2!');
		await registerPage.isMismatchPasswordErrorVisible();
	},
);
