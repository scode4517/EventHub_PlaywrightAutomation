/** @format */

import { test, expect } from './testSetup';
import { PageManager } from '../pageObjects/PageManager';
import { TestData } from '../TestData/TestData';

test.beforeEach(async ({ page }) => {
	const loginPage = PageManager.getLoginPage(page);
	await PageManager.getLoginPage(page).login(
		TestData.email,
		TestData.password,
	);
	await page.waitForLoadState('networkidle');
});

test(
	'Logged in user mail display test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const homePage = PageManager.getHomePage(page);

		await homePage.isNavigatedToHomePage(TestData.email);
		await homePage.isUserLoggedIn(TestData.email);
	},
);

test(
	'Navigate to events page test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const homePage = PageManager.getHomePage(page);
		await homePage.gotoEventsPage();
	},
);

test(
	'Navigate to my bookings page test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const homePage = PageManager.getHomePage(page);
		await homePage.gotoMyBookingsPage();
	},
);

test(
	'Navigate to manage events test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const homePage = PageManager.getHomePage(page);
		await homePage.gotoManageEventsPage();
	},
);

test(
	'Navigate to manage bookings test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const homePage = PageManager.getHomePage(page);
		await homePage.gotoManageBookingsPage();
	},
);

test('Logout test', { tag: '@HomePageTest' }, async ({ page }) => {
	const loginPage = PageManager.getLoginPage(page);
	const homePage = PageManager.getHomePage(page);
	await homePage.logout();
	await homePage.isUserLoggedOut();
	await loginPage.isNavigatedToLoginPage();
});

test(
	'Navigate to events page using browse events button test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const homePage = PageManager.getHomePage(page);
		await homePage.clickOnBrowseEventsButton();
	},
);

test(
	'Navigate to my bookings page using my bookings button test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const homePage = PageManager.getHomePage(page);
		await homePage.clickOnMyBookingsButton();
	},
);

test(
	'Navigate to events page using view all button test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const homePage = PageManager.getHomePage(page);
		await homePage.clickOnViewAllButton();
	},
);

test(
	'Navigate to events page using explore all events button test',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const homePage = PageManager.getHomePage(page);
		await homePage.clickOnExploreAllEventsButton();
	},
);

test(
	'Navigate to event bookings page and verify event details match from home page to bookings page',
	{ tag: '@HomePageTest' },
	async ({ page }) => {
		const homePage = PageManager.getHomePage(page);

		const eventDetails: string[] =
			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);
		await page.waitForLoadState('networkidle');
		const [
			eventName,
			eventDate,
			eventLocation,
			eventCost,
			eventSeatsLeft,
		] = eventDetails;

		const eventBookingPage = PageManager.getEventBookingPage(page);
		eventBookingPage.isNavigatedToEventBookingPage(
			eventName,
			eventDate,
			eventLocation,
			eventCost,
			eventSeatsLeft,
		);
	},
);
