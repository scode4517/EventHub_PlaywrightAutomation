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
	'Navigate to my bookings page using bread crumbs',
	{ tag: '@BookingDetailsPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const myBookingsPage = PageManager.getMyBookingsPage(page);
		const bookingDetailsPage = PageManager.getBookingDetailsPage(page);

		const email = faker.internet.email();
		const name = faker.person.fullName();

		await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);

		await eventBookingPage.bookEvent(name, email, '1234567890');
		await eventBookingPage.clickOnViewMyBookingsButton();
		await myBookingsPage.viewBooking();
		await bookingDetailsPage.clickOnMyBookingBreadCrumb();
	},
);

test(
	'Navigate to my bookings page using back to bookings button',
	{ tag: '@BookingDetailsPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const myBookingsPage = PageManager.getMyBookingsPage(page);
		const bookingDetailsPage = PageManager.getBookingDetailsPage(page);

		const email = faker.internet.email();
		const name = faker.person.fullName();

		await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);

		await eventBookingPage.bookEvent(name, email, '1234567890');
		await eventBookingPage.clickOnViewMyBookingsButton();
		await myBookingsPage.viewBooking();
		await bookingDetailsPage.clickOnBackToBookings();
	},
);

test('Cancel booking', { tag: '@BookingDetailsPageTest' }, async ({ page }) => {
	const eventBookingPage = PageManager.getEventBookingPage(page);
	const homePage = PageManager.getHomePage(page);
	const myBookingsPage = PageManager.getMyBookingsPage(page);
	const bookingDetailsPage = PageManager.getBookingDetailsPage(page);

	const email = faker.internet.email();
	const name = faker.person.fullName();

	await homePage.readEventDetailsAndClickOnEventCardByName('RND');
	await page.waitForTimeout(2000);

	await eventBookingPage.bookEvent(name, email, '1234567890');
	await eventBookingPage.clickOnViewMyBookingsButton();
	await myBookingsPage.viewBooking();
	await bookingDetailsPage.cancelBooking();
});

test(
	'Verify booking details',
	{ tag: '@BookingDetailsPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const myBookingsPage = PageManager.getMyBookingsPage(page);
		const bookingDetailsPage = PageManager.getBookingDetailsPage(page);

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
		await eventBookingPage.changeTicketCountTo(2);
		const totalCost = await eventBookingPage.getTotalCost();
		await eventBookingPage.bookEvent(name, email, '1234567890');
		await page.waitForTimeout(1000);
		const bookingRefId = await eventBookingPage.getBookingRefId();

		const eventCategory = await eventBookingPage.getEventCategory();
		await eventBookingPage.clickOnViewMyBookingsButton();
		const bookingId = await myBookingsPage.getEventBookingId();

		await myBookingsPage.viewBooking();
		const todayDate = new Intl.DateTimeFormat('en-GB', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		}).format(new Date());

		await bookingDetailsPage.verifyBookingDetails(
			eventName,
			eventDate,
			eventLocation,
			eventCost,
			2,
			todayDate,
			bookingRefId,
			email,
			name,
			1234567890,
			bookingId,
			totalCost,
			eventCategory,
		);
	},
);

test(
	'Verify eligible for refund is displayed',
	{ tag: '@BookingDetailsPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const myBookingsPage = PageManager.getMyBookingsPage(page);
		const bookingDetailsPage = PageManager.getBookingDetailsPage(page);

		const email = faker.internet.email();
		const name = faker.person.fullName();

		await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);

		await eventBookingPage.bookEvent(name, email, '1234567890');
		await page.waitForTimeout(1000);
		await eventBookingPage.clickOnViewMyBookingsButton();

		await myBookingsPage.viewBooking();
		await bookingDetailsPage.verifyEligibleForRefundIsDisplayed();
	},
);

test(
	'Verify not eligible for refund is displayed',
	{ tag: '@BookingDetailsPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const myBookingsPage = PageManager.getMyBookingsPage(page);
		const bookingDetailsPage = PageManager.getBookingDetailsPage(page);

		const email = faker.internet.email();
		const name = faker.person.fullName();

		await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);
		await eventBookingPage.changeTicketCountTo(2);
		await eventBookingPage.bookEvent(name, email, '1234567890');
		await page.waitForTimeout(1000);
		await eventBookingPage.clickOnViewMyBookingsButton();

		await myBookingsPage.viewBooking();
		await bookingDetailsPage.verifyNotEligibleForRefundIsDisplayed();
	},
);
