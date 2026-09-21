/** @format */

import { test } from './testSetup';
import { PageManager } from '../pageObjects/PageManager';
import { TestData } from '../TestData/TestData';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ page }) => {
	const loginPage = PageManager.getLoginPage(page);
	await loginPage.login(TestData.email, TestData.password);
	const homePage = PageManager.getHomePage(page);

	await homePage.clickOnBrowseEventsButton();
});

test(
	'No bookings visual test',
	{ tag: '@ManageBookingsPageTest' },
	async ({ page }) => {
		const homePage = PageManager.getHomePage(page);
		const manageBookingsPage = PageManager.getManageBookingsPage(page);

		await homePage.gotoManageBookingsPage();
		await manageBookingsPage.isNavigatedToManageBookingsPage();
		await manageBookingsPage.manageBookingsPageFormVisualTest();
	},
);

test(
	'Cancel booking test',
	{ tag: '@ManageBookingsPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const manageBookingsPage = PageManager.getManageBookingsPage(page);

		const email = faker.internet.email();
		const name = faker.person.fullName();

		await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);

		await eventBookingPage.bookEvent(name, email, '1234567890');

		const bookingRefId = await eventBookingPage.getBookingRefId();
		await homePage.gotoManageBookingsPage();
		await manageBookingsPage.isNavigatedToManageBookingsPage();
		await page.waitForTimeout(2000);
		await manageBookingsPage.cancelBooking(bookingRefId);
	},
);

test(
	'Verify booking test',
	{ tag: '@ManageBookingsPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const manageBookingsPage = PageManager.getManageBookingsPage(page);

		const email = faker.internet.email();
		const name = faker.person.fullName();

		const [
			eventName,
			eventDate,
			eventLocation,
			eventCost,
			eventSeatsLeft,
		] = await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);

		await eventBookingPage.bookEvent(name, email, '1234567890');

		const bookingRefId = await eventBookingPage.getBookingRefId();
		await homePage.gotoManageBookingsPage();
		await manageBookingsPage.isNavigatedToManageBookingsPage();
		await page.waitForTimeout(2000);
		const todayDate = new Intl.DateTimeFormat('en-GB', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		}).format(new Date());
		await manageBookingsPage.verifyBookingDetails(
			bookingRefId,
			name,
			email,
			eventName,
			1,
			eventCost,
			'confirmed',
			todayDate,
		);
		await page.waitForTimeout(2000);
		await manageBookingsPage.cancelBooking(bookingRefId);
	},
);

test(
	'View and verify booking test',
	{ tag: '@ManageBookingsPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const manageBookingsPage = PageManager.getManageBookingsPage(page);

		const email = faker.internet.email();
		const name = faker.person.fullName();

		const [
			eventName,
			eventDate,
			eventLocation,
			eventCost,
			eventSeatsLeft,
		] = await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);

		await eventBookingPage.bookEvent(name, email, '1234567890');

		const bookingRefId = await eventBookingPage.getBookingRefId();
		await homePage.gotoManageBookingsPage();
		await manageBookingsPage.isNavigatedToManageBookingsPage();
		await page.waitForTimeout(2000);
		const todayDate = new Intl.DateTimeFormat('en-GB', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		}).format(new Date());
		await manageBookingsPage.viewAndVerifyBookingDetails(
			bookingRefId,
			name,
			email,
            '1234567890',
			eventName,
			1,
			eventCost,
			'confirmed',
			todayDate,
            eventDate,
            eventLocation
		);
		await page.waitForTimeout(2000);
		await manageBookingsPage.cancelBooking(bookingRefId);
	},
);
