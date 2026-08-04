/** @format */

import { test, expect } from './testSetup';
import { PageManager } from '../pageObjects/PageManager';
import { faker } from '@faker-js/faker';
import { TestData } from '../TestData/TestData';

test(
	'Logged in user mail display test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const homePage = PageManager.getHomePage(page);
		const registerPage = PageManager.getRegisterPage(page);
		const email = faker.internet.email();
		const password = faker.internet.password({
			length: 12,
			memorable: false,
			pattern: /[A-Za-z0-9!@#$%^&*]/,
			prefix: 'Aa1!',
		});
		await registerPage.goto();
		await registerPage.register(email, password, password);
		await homePage.isNavigatedToHomePage(email);
		await homePage.isUserLoggedIn(email);
	},
);

test(
	'Navigate to events page test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const loginPage = PageManager.getLoginPage(page);
		const homePage = PageManager.getHomePage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.gotoEventsPage();
	},
);

test(
	'Navigate to my bookings page test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const loginPage = PageManager.getLoginPage(page);
		const homePage = PageManager.getHomePage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.gotoMyBookingsPage();
	},
);

test(
	'Navigate to manage events test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const loginPage = PageManager.getLoginPage(page);
		const homePage = PageManager.getHomePage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.gotoManageEventsPage();
	},
);

test(
	'Navigate to manage bookings test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const loginPage = PageManager.getLoginPage(page);
		const homePage = PageManager.getHomePage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.gotoManageBookingsPage();
	},
);
