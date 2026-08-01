/** @format */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageObjects/LoginPage.spec';
import { RegisterPage } from '../pageObjects/RegisterPage.spec';
import { HomePage } from '../pageObjects/HomePage.spec';

test('Login page visual test', { tag: '@LoginTest' }, async ({ page }) => {
	const loginPage = new LoginPage(page);
	await loginPage.goto();
	await loginPage.loginPageVisualTest();
});

test('Valid login test', { tag: '@LoginTest' }, async ({ page }) => {
	const loginPage = new LoginPage(page);
	const homePage = new HomePage(page);
	await loginPage.goto();
	await loginPage.login('santhoshsai4517@gmail.com', '151Fa04124@4517');
	await homePage.isNavigatedToHomePage();
});

test('Click on register link test', { tag: '@LoginTest' }, async ({ page }) => {
	const loginPage = new LoginPage(page);
	const registerPage = new RegisterPage(page);
	await loginPage.goto();
	await loginPage.clickOnRegisterLink();
	await registerPage.isNavigatedToRegisterPage();
});

test(
	'Login with empty credentials test',
	{ tag: '@LoginErrorTest' },
	async ({ page }) => {
		const loginPage = new LoginPage(page);
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
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login('', 'password');
		await loginPage.isInvalidEmailErrorVisible();
	},
);

test(
	'Login with empty password test',
	{ tag: '@LoginErrorTest' },
	async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login('santhoshsai4517@gmail.com', '');
		await loginPage.isInvalidPasswordErrorVisible();
	},
);

test(
	'Login with invalid email test',
	{ tag: '@LoginErrorTest' },
	async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login('invalid-email', 'password');
		await loginPage.isInvalidEmailErrorVisible();
	},
);

test(
	'Login with incorrect credentials test',
	{ tag: '@LoginErrorTest' },
	async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login(
			'santhoshsai4517@gmail.com',
			'wrong password',
		);
		await loginPage.isIncorrectCredentialsErrorVisible();
	},
);
