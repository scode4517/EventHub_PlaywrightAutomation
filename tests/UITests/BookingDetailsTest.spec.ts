/** @format */

import { test } from '../TestSetup';
import { PageManager } from '../../pageObjects/PageManager';
import { faker } from '@faker-js/faker';
import { HomePage } from '../../pageObjects/HomePage';
import { EventBookingPage } from '../../pageObjects/EventBookingPage';
import { MyBookingsPage } from '../../pageObjects/MyBookingsPage';
import { BookingDetailsPage } from '../../pageObjects/BookingDetailsPage';

test.describe('Booking Details Test', () => {
	let homePage: HomePage;
	let eventBookingPage: EventBookingPage;
	let myBookingsPage: MyBookingsPage;
	let bookingDetailsPage: BookingDetailsPage;

	test.beforeEach(async ({ authenticatedPage }) => {
		homePage = PageManager.getHomePage(authenticatedPage);
		eventBookingPage =
			PageManager.getEventBookingPage(authenticatedPage);
		myBookingsPage = PageManager.getMyBookingsPage(authenticatedPage);
		bookingDetailsPage =
			PageManager.getBookingDetailsPage(authenticatedPage);
		await homePage.clickOnBrowseEventsButton();
	});

	test(
		'Navigate to my bookings page using bread crumbs',
		{ tag: '@BookingDetailsPageTest' },
		async ({ authenticatedPage }) => {
			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();

			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);
			await authenticatedPage.waitForTimeout(2000);

			await eventBookingPage.bookEvent(name, email, '1234567890');
			await eventBookingPage.clickOnViewMyBookingsButton();
			await myBookingsPage.viewBooking();
			await bookingDetailsPage.clickOnMyBookingBreadCrumb();
		},
	);

	test(
		'Navigate to my bookings page using back to bookings button',
		{ tag: '@BookingDetailsPageTest' },
		async ({ authenticatedPage }) => {
			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();

			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);
			await authenticatedPage.waitForTimeout(2000);

			await eventBookingPage.bookEvent(name, email, '1234567890');
			await eventBookingPage.clickOnViewMyBookingsButton();
			await myBookingsPage.viewBooking();
			await bookingDetailsPage.clickOnBackToBookings();
		},
	);

	test(
		'Cancel booking',
		{ tag: '@BookingDetailsPageTest' },
		async ({ authenticatedPage }) => {
			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();

			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);
			await authenticatedPage.waitForTimeout(2000);

			await eventBookingPage.bookEvent(name, email, '1234567890');
			await eventBookingPage.clickOnViewMyBookingsButton();
			await myBookingsPage.viewBooking();
			await bookingDetailsPage.cancelBooking();
		},
	);

	test(
		'Verify booking details',
		{ tag: '@BookingDetailsPageTest' },
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
			await eventBookingPage.changeTicketCountTo(2);
			const totalCost: string =
				await eventBookingPage.getTotalCost();
			await eventBookingPage.bookEvent(name, email, '1234567890');
			await authenticatedPage.waitForTimeout(1000);
			const bookingRefId: string =
				await eventBookingPage.getBookingRefId();

			const eventCategory: string =
				await eventBookingPage.getEventCategory();
			await eventBookingPage.clickOnViewMyBookingsButton();
			const bookingId: string =
				await myBookingsPage.getEventBookingId();

			await myBookingsPage.viewBooking();
			const todayDate: string = new Intl.DateTimeFormat('en-GB', {
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
		async ({ authenticatedPage }) => {
			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();

			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);
			await authenticatedPage.waitForTimeout(2000);

			await eventBookingPage.bookEvent(name, email, '1234567890');
			await authenticatedPage.waitForTimeout(1000);
			await eventBookingPage.clickOnViewMyBookingsButton();

			await myBookingsPage.viewBooking();
			await bookingDetailsPage.verifyEligibleForRefundIsDisplayed();
		},
	);

	test(
		'Verify not eligible for refund is displayed',
		{ tag: '@BookingDetailsPageTest' },
		async ({ authenticatedPage }) => {
			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();

			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);
			await authenticatedPage.waitForTimeout(2000);
			await eventBookingPage.changeTicketCountTo(2);
			await eventBookingPage.bookEvent(name, email, '1234567890');
			await authenticatedPage.waitForTimeout(1000);
			await eventBookingPage.clickOnViewMyBookingsButton();

			await myBookingsPage.viewBooking();
			await bookingDetailsPage.verifyNotEligibleForRefundIsDisplayed();
		},
	);
});
