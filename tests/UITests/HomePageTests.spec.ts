/** @format */

import { test } from '../testSetup';
import { PageManager } from '../../pageObjects/PageManager';
import { TestData } from '../../TestData/TestData';
import { LoginPage } from '../../pageObjects/LoginPage';
import { HomePage } from '../../pageObjects/HomePage';
import { EventBookingPage } from '../../pageObjects/EventBookingPage';
import { MyBookingsPage } from '../../pageObjects/MyBookingsPage';
import { BookingDetailsPage } from '../../pageObjects/BookingDetailsPage';

test.describe('Home page Test', () => {
	let loginPage: LoginPage;
	let homePage: HomePage;
	let eventBookingPage: EventBookingPage;

	test.beforeEach(async ({ authenticatedPage }) => {
		loginPage = PageManager.getLoginPage(authenticatedPage);
		homePage = PageManager.getHomePage(authenticatedPage);
		eventBookingPage =
			PageManager.getEventBookingPage(authenticatedPage);
	});

	test(
		'Logged in user mail display test',
		{ tag: '@HomePageTest' },
		async () => {
			await homePage.isNavigatedToHomePage(TestData.email);
			await homePage.isUserLoggedIn(TestData.email);
		},
	);

	test(
		'Navigate to events page test',
		{ tag: '@HomePageTest' },
		async () => {
			await homePage.gotoEventsPage();
		},
	);

	test(
		'Navigate to my bookings page test',
		{ tag: '@HomePageTest' },
		async () => {
			await homePage.gotoMyBookingsPage();
		},
	);

	test(
		'Navigate to manage events test',
		{ tag: '@HomePageTest' },
		async () => {
			await homePage.gotoManageEventsPage();
		},
	);

	test(
		'Navigate to manage bookings test',
		{ tag: '@HomePageTest' },
		async () => {
			await homePage.gotoManageBookingsPage();
		},
	);

	test('Logout test', { tag: '@HomePageTest' }, async () => {
		await homePage.logout();
		await homePage.isUserLoggedOut();
		await loginPage.isNavigatedToLoginPage();
	});

	test(
		'Navigate to events page using browse events button test',
		{ tag: '@HomePageTest' },
		async () => {
			await homePage.clickOnBrowseEventsButton();
		},
	);

	test(
		'Navigate to my bookings page using my bookings button test',
		{ tag: '@HomePageTest' },
		async () => {
			await homePage.clickOnMyBookingsButton();
		},
	);

	test(
		'Navigate to events page using view all button test',
		{ tag: '@HomePageTest' },
		async () => {
			await homePage.clickOnViewAllButton();
		},
	);

	test(
		'Navigate to events page using explore all events button test',
		{ tag: '@HomePageTest' },
		async () => {
			await homePage.clickOnExploreAllEventsButton();
		},
	);

	test(
		'Navigate to event bookings page and verify event details match from home page to bookings page',
		{ tag: '@HomePageTest' },
		async () => {
			const eventDetails: string[] =
				await homePage.readEventDetailsAndClickOnEventCardByName(
					'RND',
				);

			const [
				eventName,
				eventDate,
				eventLocation,
				eventCost,
				eventSeatsLeft,
			] = eventDetails;

			await eventBookingPage.isNavigatedToEventBookingPage(
				eventName,
				eventDate,
				eventLocation,
				eventCost,
				eventSeatsLeft,
			);
		},
	);
});
