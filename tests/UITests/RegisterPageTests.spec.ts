/** @format */

import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { PageManager } from '../../pageObjects/PageManager';
import { LoginPage } from '../../pageObjects/LoginPage';
import { HomePage } from '../../pageObjects/HomePage';
import { RegisterPage } from '../../pageObjects/RegisterPage';

test.describe('Booking Details Test', () => {
	let loginPage: LoginPage;
	let homePage: HomePage;
	let registerPage: RegisterPage;

	test.beforeEach(async ({ page }) => {
		loginPage = PageManager.getLoginPage(page);
		homePage = PageManager.getHomePage(page);
		registerPage = PageManager.getRegisterPage(page);
	});

	test('Register page visual test', { tag: '@RegisterTest' }, async () => {
		await registerPage.goto();
		await registerPage.registerPageVisualTest();
	});

	test('Click on login link test', { tag: '@RegisterTest' }, async () => {
		await registerPage.goto();
		await registerPage.clickOnLoginLink();
		await loginPage.isNavigatedToLoginPage();
	});

	test('Valid register test', { tag: '@RegisterTest' }, async () => {
		await registerPage.goto();
		const email: string = faker.internet.email();
		const password: string = faker.internet.password({
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
		async () => {
			await registerPage.goto();
			await registerPage.register('', '', '');
			await registerPage.isInvalidEmailErrorVisible();
			await registerPage.isInvalidPasswordErrorVisible();
		},
	);

	test(
		'Register with password mismatch test',
		{ tag: '@RegisterErrorTest' },
		async () => {
			await registerPage.goto();
			const email: string = faker.internet.email();
			const password: string = faker.internet.password({
				length: 12,
				memorable: false,
				pattern: /[A-Za-z0-9!@#$%^&*]/,
				prefix: 'Aa1!',
			});

			await registerPage.register(email, password, 'Password2!');
			await registerPage.isMismatchPasswordErrorVisible();
		},
	);
});
