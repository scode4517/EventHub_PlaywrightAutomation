/** @format */

import { test } from '../testSetup';
import { PageManager } from '../../pageObjects/PageManager';
import { TestData } from '../../TestData/TestData';
import { HomePage } from '../../pageObjects/HomePage';
import { EventBookingPage } from '../../pageObjects/EventBookingPage';
import { MyBookingsPage } from '../../pageObjects/MyBookingsPage';
import { BookingDetailsPage } from '../../pageObjects/BookingDetailsPage';
import { EventsPage } from '../../pageObjects/EventsPage';

test.describe('Booking Details Test', () => {
	let homePage: HomePage;
	let eventBookingPage: EventBookingPage;
	let myBookingsPage: MyBookingsPage;
	let bookingDetailsPage: BookingDetailsPage;
	let eventsPage: EventsPage;

	test.beforeEach(async ({ authenticatedPage }) => {
		homePage = PageManager.getHomePage(authenticatedPage);
		eventBookingPage =
			PageManager.getEventBookingPage(authenticatedPage);
		myBookingsPage = PageManager.getMyBookingsPage(authenticatedPage);
		bookingDetailsPage =
			PageManager.getBookingDetailsPage(authenticatedPage);
		eventsPage = PageManager.getEventsPage(authenticatedPage);
		await homePage.clickOnBrowseEventsButton();
	});

	test(
		'Navigate to event bookings page and verify event details match from events page to bookings page',
		{ tag: '@EventsPageTest' },
		async ({ authenticatedPage }) => {
			const eventDetails: string[] =
				await homePage.readEventDetailsAndClickOnEventCardByName(
					'RND',
				);
			await authenticatedPage.waitForLoadState('networkidle');
			const [
				eventName,
				eventDate,
				eventLocation,
				eventCost,
				eventSeatsLeft,
			] = eventDetails;

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
		async () => {
			await eventsPage.clickOnAddNewEventsButton();
		},
	);

	test(
		'Apply category filter test',
		{ tag: '@EventsPageTest' },
		async () => {
			const category = await eventsPage.selectCategory('RND');
			await eventsPage.verifyCategoryFilterIsApplied(category);
		},
	);

	test('Clear filters test', { tag: '@EventsPageTest' }, async () => {
		await eventsPage.verifyClearButtonClearsAllFiltersAndDisplaysAllEvents();
	});

	test('Apply city filter test', { tag: '@EventsPageTest' }, async () => {
		const city = await eventsPage.selectCity('RND');
		await eventsPage.verifyCityFilterIsApplied(city);
	});

	test('search event test', { tag: '@EventsPageTest' }, async () => {
		const eventName = await eventsPage.searchEvent('RND');
		await eventsPage.verifySearchEventFilterIsApplied(eventName);
	});
});
