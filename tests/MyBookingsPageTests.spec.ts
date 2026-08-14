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
	'Verify no bookings text is displayed when there are no bookings',
	{ tag: '@MyBookingsPageTest' },
	async ({ page }) => {
		const homePage = PageManager.getHomePage(page);
		const myBookingsPage = PageManager.getMyBookingsPage(page);
		await homePage.clickOnMyBookingsButton();
		await myBookingsPage.verifyNoBookingsTextIsDisplayed();
		await myBookingsPage.clickOnBrowseEventsButton();
	},
);

test('Clear all bookings', { tag: '@MyBookingsPageTest' }, async ({ page }) => {
	const eventBookingPage = PageManager.getEventBookingPage(page);
	const homePage = PageManager.getHomePage(page);
	const myBookingsPage = PageManager.getMyBookingsPage(page);
	await page.waitForTimeout(2000);

	await homePage.readEventDetailsAndClickOnEventCardByName('RND');
	await page.waitForTimeout(2000);

	await eventBookingPage.changeTicketCountTo(1);

	const email = faker.internet.email();
	const name = faker.person.fullName();

	await eventBookingPage.bookEvent(name, email, '1234567890');
	await eventBookingPage.clickOnBrowseMoreEventsButton();
	await homePage.readEventDetailsAndClickOnEventCardByName('RND');
	await page.waitForTimeout(2000);

	await eventBookingPage.changeTicketCountTo(1);

	await eventBookingPage.bookEvent(name, email, '1234567890');
	await eventBookingPage.clickOnViewMyBookingsButton();
	await myBookingsPage.clearAllBookings();
});

test(
	'Cancel booking using cancel booking button',
	{ tag: '@MyBookingsPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const myBookingsPage = PageManager.getMyBookingsPage(page);

		const email = faker.internet.email();
		const name = faker.person.fullName();

		await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);

		await eventBookingPage.bookEvent(name, email, '1234567890');
		await eventBookingPage.clickOnViewMyBookingsButton();
		await myBookingsPage.cancelBooking();
	},
);

test(
	'View booking using cancel booking button',
	{ tag: '@MyBookingsPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const myBookingsPage = PageManager.getMyBookingsPage(page);

		const email = faker.internet.email();
		const name = faker.person.fullName();

		await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);

		await eventBookingPage.bookEvent(name, email, '1234567890');
		await eventBookingPage.clickOnViewMyBookingsButton();
		await myBookingsPage.viewBooking();
	},
);

test(
	'Verify booking details',
	{ tag: '@MyBookingsPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const myBookingsPage = PageManager.getMyBookingsPage(page);

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
		await page.waitForTimeout(1000);
		const bookingRefId = await eventBookingPage.getBookingRefId();
		await eventBookingPage.clickOnViewMyBookingsButton();
		const todayDate = new Intl.DateTimeFormat('en-GB', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		}).format(new Date());
		await myBookingsPage.verifyBookingDetails(
			eventName,
			eventDate,
			eventLocation,
			eventCost,
			1,
			todayDate,
			bookingRefId,
		);
	},
);
