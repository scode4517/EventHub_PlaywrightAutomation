/** @format */

import { test } from './testSetup';
import { PageManager } from '../pageObjects/PageManager';
import { TestData } from '../TestData/TestData';

test.beforeEach(async ({ page }) => {
	const loginPage = PageManager.getLoginPage(page);
	await PageManager.getLoginPage(page).login(
		TestData.email,
		TestData.password,
	);
	const homePage = PageManager.getHomePage(page);

	await homePage.clickOnBrowseEventsButton();
});

test(
	'Navigate to event bookings page and verify event details match from events page to bookings page',
	{ tag: '@EventsPageTest' },
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

test(
	'Navigate to add events page using add new events button test',
	{ tag: '@EventsPageTest' },
	async ({ page }) => {
		const eventsPage = PageManager.getEventsPage(page);
		await eventsPage.clickOnAddNewEventsButton();
	},
);

test(
	'Apply category filter test',
	{ tag: '@EventsPageTest' },
	async ({ page }) => {
		const eventsPage = PageManager.getEventsPage(page);
		const category = await eventsPage.selectCategory('RND');
		await eventsPage.verifyCategoryFilterIsApplied(category);
	},
);

test('Clear filters test', { tag: '@EventsPageTest' }, async ({ page }) => {
	const eventsPage = PageManager.getEventsPage(page);
	await eventsPage.verifyClearButtonClearsAllFiltersAndDisplaysAllEvents();
});

test('Apply city filter test', { tag: '@EventsPageTest' }, async ({ page }) => {
	const eventsPage = PageManager.getEventsPage(page);
	const city = await eventsPage.selectCity('RND');
	await eventsPage.verifyCityFilterIsApplied(city);
});

test('search event test', { tag: '@EventsPageTest' }, async ({ page }) => {
	const eventsPage = PageManager.getEventsPage(page);
	const eventName = await eventsPage.searchEvent('RND');
	await eventsPage.verifySearchEventFilterIsApplied(eventName);
});
