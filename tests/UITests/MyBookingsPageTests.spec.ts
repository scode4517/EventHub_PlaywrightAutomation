/** @format */

import { test } from '../testSetup';
import { PageManager } from '../../pageObjects/PageManager';
import { TestData } from '../../TestData/TestData';
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

	test.beforeEach(async ({ page }) => {
		homePage = PageManager.getHomePage(page);
		eventBookingPage = PageManager.getEventBookingPage(page);
		myBookingsPage = PageManager.getMyBookingsPage(page);
		bookingDetailsPage = PageManager.getBookingDetailsPage(page);
		await homePage.clickOnBrowseEventsButton();
	});

	test(
		'Verify no bookings text is displayed when there are no bookings',
		{ tag: '@MyBookingsPageTest' },
		async () => {
			await homePage.clickOnMyBookingsButton();
			await myBookingsPage.verifyNoBookingsTextIsDisplayed();
			await myBookingsPage.clickOnBrowseEventsButton();
		},
	);

	test(
		'Clear all bookings',
		{ tag: '@MyBookingsPageTest' },
		async ({ authenticatedPage }) => {
			await authenticatedPage.waitForTimeout(2000);
			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);

			await authenticatedPage.waitForTimeout(2000);

			await eventBookingPage.changeTicketCountTo(1);
			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();
			await eventBookingPage.bookEvent(name, email, '1234567890');
			await eventBookingPage.clickOnBrowseMoreEventsButton();
			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);

			await authenticatedPage.waitForTimeout(2000);

			await eventBookingPage.changeTicketCountTo(1);
			await eventBookingPage.bookEvent(name, email, '1234567890');
			await eventBookingPage.clickOnViewMyBookingsButton();
			await myBookingsPage.clearAllBookings();
		},
	);

	test(
		'Cancel booking using cancel booking button',
		{ tag: '@MyBookingsPageTest' },
		async ({ authenticatedPage }) => {
			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();

			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);

			await authenticatedPage.waitForTimeout(2000);

			await eventBookingPage.bookEvent(name, email, '1234567890');
			await eventBookingPage.clickOnViewMyBookingsButton();
			await myBookingsPage.cancelBooking();
		},
	);

	test(
		'View booking using view booking button',
		{ tag: '@MyBookingsPageTest' },
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
		},
	);

	test(
		'Verify booking details',
		{ tag: '@MyBookingsPageTest' },
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

			await authenticatedPage.waitForTimeout(1000);

			const bookingRefId: string =
				await eventBookingPage.getBookingRefId();
			await eventBookingPage.clickOnViewMyBookingsButton();

			const todayDate: string = new Intl.DateTimeFormat('en-GB', {
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
});
