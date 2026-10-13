/** @format */

import { test } from '../testSetup';
import { PageManager } from '../../pageObjects/PageManager';
import { TestData } from '../../TestData/TestData';
import { faker } from '@faker-js/faker';
import { LoginPage } from '../../pageObjects/LoginPage';
import { HomePage } from '../../pageObjects/HomePage';
import { EventBookingPage } from '../../pageObjects/EventBookingPage';
import { MyBookingsPage } from '../../pageObjects/MyBookingsPage';
import { BookingDetailsPage } from '../../pageObjects/BookingDetailsPage';
import { ManageEventsPage } from '../../pageObjects/ManageEventsPage';
import { ManageBookingsPage } from '../../pageObjects/ManageBookingsPage';

test.describe('End to end UI tests', () => {
	let loginPage: LoginPage;
	let homePage: HomePage;
	let eventBookingPage: EventBookingPage;
	let myBookingsPage: MyBookingsPage;
	let bookingDetailsPage: BookingDetailsPage;
	let manageEventsPage: ManageEventsPage;
	let manageBookingsPage: ManageBookingsPage;

	test.beforeEach(async ({ page }) => {
		loginPage = PageManager.getLoginPage(page);
		homePage = PageManager.getHomePage(page);
		eventBookingPage = PageManager.getEventBookingPage(page);
		myBookingsPage = PageManager.getMyBookingsPage(page);
		bookingDetailsPage = PageManager.getBookingDetailsPage(page);
		manageEventsPage = PageManager.getManageEventsPage(page);
		manageBookingsPage = PageManager.getManageBookingsPage(page);
	});

	test(
		'Create a new event and book tickets for that event and verify booking details in my bookings and manage bookings and delete bookings and event test',
		{ tag: '@End2EndUITest' },
		async ({ page }) => {
			await loginPage.login(TestData.email, TestData.password);

			const title: string = faker.word.noun();
			const description: string = faker.lorem.paragraph();
			const category: string = faker.helpers.arrayElement(
				TestData.eventCategories,
			);
			const city: string = faker.location.city();
			const venue: string = faker.location.streetAddress();
			const dateTime: string = faker.date
				.future()
				.toISOString()
				.slice(0, 16);
			const seats: string = faker.number
				.int({ min: 1, max: 1000 })
				.toString();
			const price: string = faker.number
				.int({ min: 1, max: 1000 })
				.toString();
			const imageUrl: string = faker.image.url();

			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();

			await homePage.gotoManageEventsPage();
			await manageEventsPage.createNewEvent(
				title,
				description,
				category,
				city,
				venue,
				dateTime,
				seats,
				price,
				imageUrl,
			);
			await manageEventsPage.verifyEventDetails(
				title,
				category,
				city,
				dateTime,
				price,
			);

			await homePage.gotoHomePage();
			await page.waitForTimeout(2000);
			const [
				eventName,
				eventDate,
				eventLocation,
				eventCost,
				eventSeatsLeft,
			] =
				await homePage.readEventDetailsAndClickOnEventCardByName(
					title,
				);
			await page.waitForTimeout(2000);

			let initialTotal: number =
				Number(eventCost.replace(/[^0-9.-]+/g, '')) * 1;
			await eventBookingPage.verifyTotalIs(initialTotal);
			await eventBookingPage.changeTicketCountTo(5);
			await eventBookingPage.verifyTotalIs(initialTotal * 5);
			const totalCost: string =
				await eventBookingPage.getTotalCost();

			await eventBookingPage.bookEvent(name, email, '1234567890');
			await eventBookingPage.verifyBooking(
				name,
				5,
				initialTotal * 5,
			);

			const bookingRefId: string =
				await eventBookingPage.getBookingRefId();
			const eventCategory: string =
				await eventBookingPage.getEventCategory();

			await eventBookingPage.clickOnViewMyBookingsButton();

			const bookingId: string =
				await myBookingsPage.getEventBookingId();

			const todayDate: string = new Intl.DateTimeFormat('en-GB', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
			}).format(new Date());
			await myBookingsPage.verifyBookingDetails(
				eventName,
				dateTime,
				eventLocation,
				totalCost,
				5,
				todayDate,
				bookingRefId,
			);

			await myBookingsPage.viewBooking();

			await bookingDetailsPage.verifyBookingDetails(
				eventName,
				eventDate,
				eventLocation,
				eventCost,
				5,
				todayDate,
				bookingRefId,
				email,
				name,
				1234567890,
				bookingId,
				totalCost,
				eventCategory,
			);

			await homePage.gotoManageBookingsPage();
			await manageBookingsPage.isNavigatedToManageBookingsPage();
			await page.waitForTimeout(2000);

			await manageBookingsPage.viewAndVerifyBookingDetails(
				bookingRefId,
				name,
				email,
				'1234567890',
				eventName,
				5,
				totalCost,
				'confirmed',
				todayDate,
				eventDate,
				eventLocation,
			);
			await page.waitForTimeout(2000);
			await manageBookingsPage.cancelBooking(bookingRefId);

			await homePage.gotoManageEventsPage();
			await page.waitForTimeout(2000);
			await manageEventsPage.deleteEvent(title);
		},
	);
});
