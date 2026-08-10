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
	'Navigate to events page using bread crumbs',
	{ tag: '@EventBookingPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		await page.waitForTimeout(2000);
		await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);
		await eventBookingPage.clickOnEventsBreadCrumb();
	},
);

test(
	'Verify featured event text is displayed when featured tag is present',
	{ tag: '@EventBookingPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		await page.waitForTimeout(2000);
		await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);
		await eventBookingPage.verifyFeaturedTextForFeaturedEvents();
	},
);

test(
	'Verify ticket pricing calculation',
	{ tag: '@EventBookingPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		await page.waitForTimeout(2000);
		const [
			eventName,
			eventDate,
			eventLocation,
			eventCost,
			eventSeatsLeft,
		] = await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);

		let initialTotal = Number(eventCost.replace(/[^0-9.-]+/g, '')) * 1;
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
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		await page.waitForTimeout(2000);
		const [
			eventName,
			eventDate,
			eventLocation,
			eventCost,
			eventSeatsLeft,
		] = await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);

		let initialTotal = Number(eventCost.replace(/[^0-9.-]+/g, '')) * 1;
		let finalTotal = initialTotal * 5;
		await eventBookingPage.verifyTotalIs(initialTotal);
		await eventBookingPage.changeTicketCountTo(5);
		await eventBookingPage.verifyTotalIs(finalTotal);

		const email = faker.internet.email();
		const name = faker.person.fullName();

		await eventBookingPage.bookEvent(name, email, '1234567890');
		await eventBookingPage.verifyBooking(name, 5, finalTotal);
	},
);

test(
	'Booking event with empty details',
	{ tag: '@EventBookingPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		await page.waitForTimeout(2000);
		await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);

		await eventBookingPage.bookEvent('', '', '');
		await eventBookingPage.verifyErrorsAreDisplayed();
	},
);

test(
	'Navigate to my bookings page from booking confirmed page',
	{ tag: '@EventBookingPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		await page.waitForTimeout(2000);
		await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);
		const email = faker.internet.email();
		const name = faker.person.fullName();

		await eventBookingPage.bookEvent(name, email, '1234567890');
		await eventBookingPage.clickOnViewMyBookingsButton();
	},
);

test(
	'Navigate to events page from booking confirmed page',
	{ tag: '@EventBookingPageTest' },
	async ({ page }) => {
		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		await page.waitForTimeout(2000);
		await homePage.readEventDetailsAndClickOnEventCardByName('RND');
		await page.waitForTimeout(2000);
		const email = faker.internet.email();
		const name = faker.person.fullName();

		await eventBookingPage.bookEvent(name, email, '1234567890');
		await eventBookingPage.clickOnBrowseMoreEventsButton();
	},
);
