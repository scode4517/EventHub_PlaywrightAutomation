/** @format */

import { test } from '../testSetup';
import { PageManager } from '../../pageObjects/PageManager';
import { faker } from '@faker-js/faker';
import { HomePage } from '../../pageObjects/HomePage';
import { EventBookingPage } from '../../pageObjects/EventBookingPage';
import { ManageBookingsPage } from '../../pageObjects/ManageBookingsPage';

test.describe('manage Booking Details Test', () => {
	let homePage: HomePage;
	let eventBookingPage: EventBookingPage;
	let manageBookingsPage: ManageBookingsPage;

	test.beforeEach(async ({ authenticatedPage }) => {
		homePage = PageManager.getHomePage(authenticatedPage);
		eventBookingPage =
			PageManager.getEventBookingPage(authenticatedPage);
		manageBookingsPage =
			PageManager.getManageBookingsPage(authenticatedPage);
		await homePage.clickOnBrowseEventsButton();
	});

	test(
		'No bookings visual test',
		{ tag: '@ManageBookingsPageTest' },
		async () => {
			await homePage.gotoManageBookingsPage();
			await manageBookingsPage.isNavigatedToManageBookingsPage();
			await manageBookingsPage.manageBookingsPageFormVisualTest();
		},
	);

	test(
		'Cancel booking test',
		{ tag: '@ManageBookingsPageTest' },
		async ({ authenticatedPage }) => {
			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();

			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);

			await authenticatedPage.waitForTimeout(2000);
			await eventBookingPage.bookEvent(name, email, '1234567890');
			const bookingRefId: string =
				await eventBookingPage.getBookingRefId();
			await homePage.gotoManageBookingsPage();
			await manageBookingsPage.isNavigatedToManageBookingsPage();
			await authenticatedPage.waitForTimeout(2000);
			await manageBookingsPage.cancelBooking(bookingRefId);
		},
	);

	test(
		'Verify booking test',
		{ tag: '@ManageBookingsPageTest' },
		async ({ authenticatedPage }) => {
			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();

			const [
				eventName,
				eventDate,
				eventLocation,
				eventCost,
				eventSeatsLeft,
			] =
				await homePage.readEventDetailsAndClickOnEventCardByName(
					'RND',
				);

			await authenticatedPage.waitForTimeout(2000);

			await eventBookingPage.bookEvent(name, email, '1234567890');
			const bookingRefId: string =
				await eventBookingPage.getBookingRefId();
			await homePage.gotoManageBookingsPage();
			await manageBookingsPage.isNavigatedToManageBookingsPage();

			await authenticatedPage.waitForTimeout(2000);

			const todayDate: string = new Intl.DateTimeFormat('en-GB', {
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

			await authenticatedPage.waitForTimeout(2000);

			await manageBookingsPage.cancelBooking(bookingRefId);
		},
	);

	test(
		'View and verify booking test',
		{ tag: '@ManageBookingsPageTest' },
		async ({ authenticatedPage }) => {
			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();

			const [
				eventName,
				eventDate,
				eventLocation,
				eventCost,
				eventSeatsLeft,
			] =
				await homePage.readEventDetailsAndClickOnEventCardByName(
					'RND',
				);

			await authenticatedPage.waitForTimeout(2000);

			await eventBookingPage.bookEvent(name, email, '1234567890');
			const bookingRefId: string =
				await eventBookingPage.getBookingRefId();
			await homePage.gotoManageBookingsPage();
			await manageBookingsPage.isNavigatedToManageBookingsPage();

			await authenticatedPage.waitForTimeout(2000);

			const todayDate: string = new Intl.DateTimeFormat('en-GB', {
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
				eventLocation,
			);

			await authenticatedPage.waitForTimeout(2000);

			await manageBookingsPage.cancelBooking(bookingRefId);
		},
	);
});
