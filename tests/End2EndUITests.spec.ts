/** @format */

import { test } from './testSetup';
import { PageManager } from '../pageObjects/PageManager';
import { TestData } from '../TestData/TestData';
import { faker } from '@faker-js/faker';

test(
	'Create a new event and book tickets for that event and verify booking details in my bookings and manage bookings and delete bookings and event test',
	{ tag: '@End2EndUITest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const myBookingsPage = PageManager.getMyBookingsPage(page);
		const bookingDetailsPage = PageManager.getBookingDetailsPage(page);
		const manageEventsPage = PageManager.getManageEventsPage(page);
		const loginPage = PageManager.getLoginPage(page);
		const manageBookingsPage = PageManager.getManageBookingsPage(page);

		await loginPage.login(TestData.email, TestData.password);

		const title = faker.word.noun();
		const description = faker.lorem.paragraph();
		const category = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city = faker.location.city();
		const venue = faker.location.streetAddress();
		const dateTime = faker.date.future().toISOString().slice(0, 16);
		const seats = faker.number.int({ min: 1, max: 1000 }).toString();
		const price = faker.number.int({ min: 1, max: 1000 }).toString();
		const imageUrl = faker.image.url();

		const email = faker.internet.email();
		const name = faker.person.fullName();

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
		] = await homePage.readEventDetailsAndClickOnEventCardByName(title);
		await page.waitForTimeout(2000);

		let initialTotal = Number(eventCost.replace(/[^0-9.-]+/g, '')) * 1;
		await eventBookingPage.verifyTotalIs(initialTotal);
		await eventBookingPage.changeTicketCountTo(5);
		await eventBookingPage.verifyTotalIs(initialTotal * 5);
		const totalCost = await eventBookingPage.getTotalCost();

		await eventBookingPage.bookEvent(name, email, '1234567890');
		await eventBookingPage.verifyBooking(name, 5, initialTotal * 5);

		const bookingRefId = await eventBookingPage.getBookingRefId();
		const eventCategory = await eventBookingPage.getEventCategory();

		await eventBookingPage.clickOnViewMyBookingsButton();

		const bookingId = await myBookingsPage.getEventBookingId();

		const todayDate = new Intl.DateTimeFormat('en-GB', {
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
