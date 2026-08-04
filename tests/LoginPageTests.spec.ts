/** @format */

import { test, expect } from './testSetup';
import { PageManager } from '../pageObjects/PageManager';
import { TestData } from '../TestData/TestData';

test('Login page visual test', { tag: '@LoginTest' }, async ({ page }) => {
	const loginPage = PageManager.getLoginPage(page);
	await loginPage.goto();
	await loginPage.loginPageVisualTest();
});

test('Valid login test', { tag: '@LoginTest' }, async ({ page }) => {
	const loginPage = PageManager.getLoginPage(page);
	const homePage = PageManager.getHomePage(page);
	await loginPage.goto();
	await loginPage.login(TestData.email, TestData.password);
	await homePage.isNavigatedToHomePage(TestData.email);
});

test('Click on register link test', { tag: '@LoginTest' }, async ({ page }) => {
	const loginPage = PageManager.getLoginPage(page);
	const registerPage = PageManager.getRegisterPage(page);
	await loginPage.goto();
	await loginPage.clickOnRegisterLink();
	await registerPage.isNavigatedToRegisterPage();
});

test(
	'Login with empty credentials test',
	{ tag: '@LoginErrorTest' },
	async ({ page }) => {
		const loginPage = PageManager.getLoginPage(page);
		await loginPage.goto();
		await loginPage.login('', '');
		await loginPage.isInvalidEmailErrorVisible();
		await loginPage.isInvalidPasswordErrorVisible();
	},
);

test(
	'Login with empty email test',
	{ tag: '@LoginErrorTest' },
	async ({ page }) => {
		const loginPage = PageManager.getLoginPage(page);
		await loginPage.goto();
		await loginPage.login('', 'password');
		await loginPage.isInvalidEmailErrorVisible();
	},
);

test(
	'Login with empty password test',
	{ tag: '@LoginErrorTest' },
	async ({ page }) => {
		const loginPage = PageManager.getLoginPage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, '');
		await loginPage.isInvalidPasswordErrorVisible();
	},
);

test(
	'Login with invalid email test',
	{ tag: '@LoginErrorTest' },
	async ({ page }) => {
		const loginPage = PageManager.getLoginPage(page);
		await loginPage.goto();
		await loginPage.login('invalid-email', 'password');
		await loginPage.isInvalidEmailErrorVisible();
	},
);

test(
	'Login with incorrect credentials test',
	{ tag: '@LoginErrorTest' },
	async ({ page }) => {
		const loginPage = PageManager.getLoginPage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, 'wrong password');
		await loginPage.isIncorrectCredentialsErrorVisible();
	},
);
