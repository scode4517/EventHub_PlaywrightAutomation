/** @format */

import { test } from '../testSetup';
import { PageManager } from '../../pageObjects/PageManager';
import { faker } from '@faker-js/faker';
import { HomePage } from '../../pageObjects/HomePage';
import { EventBookingPage } from '../../pageObjects/EventBookingPage';
import { MyBookingsPage } from '../../pageObjects/MyBookingsPage';
import { BookingDetailsPage } from '../../pageObjects/BookingDetailsPage';

test.describe('Event booking Test', () => {
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
		'Navigate to events page using bread crumbs',
		{ tag: '@EventBookingPageTest' },
		async ({ authenticatedPage }) => {
			await authenticatedPage.waitForTimeout(2000);
			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);
			await authenticatedPage.waitForTimeout(2000);
			await eventBookingPage.clickOnEventsBreadCrumb();
		},
	);

	test(
		'Verify featured event text is displayed when featured tag is present',
		{ tag: '@EventBookingPageTest' },
		async ({ authenticatedPage }) => {
			await authenticatedPage.waitForTimeout(2000);
			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);
			await authenticatedPage.waitForTimeout(2000);
			await eventBookingPage.verifyFeaturedTextForFeaturedEvents();
		},
	);

	test(
		'Verify ticket pricing calculation',
		{ tag: '@EventBookingPageTest' },
		async ({ authenticatedPage }) => {
			await authenticatedPage.waitForTimeout(2000);
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

			let initialTotal: number =
				Number(eventCost.replace(/[^0-9.-]+/g, '')) * 1;
			await eventBookingPage.verifyTotalIs(initialTotal);
			await eventBookingPage.changeTicketCountTo(5);
			await eventBookingPage.verifyTotalIs(initialTotal * 5);
			await eventBookingPage.changeTicketCountTo(3);
			await eventBookingPage.verifyTotalIs(initialTotal * 3);
		},
	);

	test(
		'Booking an event test',
		{ tag: '@EventBookingPageTest' },
		async ({ authenticatedPage }) => {
			await authenticatedPage.waitForTimeout(2000);
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

			let initialTotal: number =
				Number(eventCost.replace(/[^0-9.-]+/g, '')) * 1;
			let finalTotal: number = initialTotal * 5;
			await eventBookingPage.verifyTotalIs(initialTotal);
			await eventBookingPage.changeTicketCountTo(5);
			await eventBookingPage.verifyTotalIs(finalTotal);

			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();

			await eventBookingPage.bookEvent(name, email, '1234567890');
			await eventBookingPage.verifyBooking(name, 5, finalTotal);
		},
	);

	test(
		'Booking event with empty details',
		{ tag: '@EventBookingPageTest' },
		async ({ authenticatedPage }) => {
			await authenticatedPage.waitForTimeout(2000);
			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);
			await authenticatedPage.waitForTimeout(2000);

			await eventBookingPage.bookEvent('', '', '');
			await eventBookingPage.verifyErrorsAreDisplayed();
		},
	);

	test(
		'Navigate to my bookings page from booking confirmed page',
		{ tag: '@EventBookingPageTest' },
		async ({ authenticatedPage }) => {
			await authenticatedPage.waitForTimeout(2000);
			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);
			await authenticatedPage.waitForTimeout(2000);
			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();

			await eventBookingPage.bookEvent(name, email, '1234567890');
			await eventBookingPage.clickOnViewMyBookingsButton();
		},
	);

	test(
		'Navigate to events page from booking confirmed page',
		{ tag: '@EventBookingPageTest' },
		async ({ authenticatedPage }) => {
			await authenticatedPage.waitForTimeout(2000);
			await homePage.readEventDetailsAndClickOnEventCardByName(
				'RND',
			);
			await authenticatedPage.waitForTimeout(2000);
			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();

			await eventBookingPage.bookEvent(name, email, '1234567890');
			await eventBookingPage.clickOnBrowseMoreEventsButton();
		},
	);
});
