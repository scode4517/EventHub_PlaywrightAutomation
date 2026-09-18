/** @format */

import { test } from './testSetup';
import { PageManager } from '../pageObjects/PageManager';
import { TestData } from '../TestData/TestData';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ page }) => {
	const loginPage = PageManager.getLoginPage(page);
	await loginPage.login(TestData.email, TestData.password);
	const homePage = PageManager.getHomePage(page);
	await homePage.gotoManageEventsPage();
});

test(
	'Event creation form visual test',
	{ tag: '@ManageEventsPageTest' },
	async ({ page }) => {
		const manageEventsPage = PageManager.getManageEventsPage(page);
		await manageEventsPage.isNavigatedToManageEventsPage();
		await manageEventsPage.manageEventsPageFormVisualTest();
	},
);

test(
	'Empty form submission test',
	{ tag: '@ManageEventsPageTest' },
	async ({ page }) => {
		const manageEventsPage = PageManager.getManageEventsPage(page);
		await manageEventsPage.createNewEvent();
		await manageEventsPage.verifyThatAllErrorsAreDisplayed();
	},
);

test(
	'Create new event and verify event details and delete the newly created event test',
	{ tag: '@ManageEventsPageTest' },
	async ({ page }) => {
		const manageEventsPage = PageManager.getManageEventsPage(page);
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
		await manageEventsPage.deleteEvent(title);
	},
);

test(
	'Create new event and edit event test',
	{ tag: '@ManageEventsPageTest' },
	async ({ page }) => {
		const manageEventsPage = PageManager.getManageEventsPage(page);
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

		const newTitle = faker.word.noun();
		const newDescription = faker.lorem.paragraph();
		const newCategory = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const newCity = faker.location.city();
		const newVenue = faker.location.streetAddress();
		const newDateTime = faker.date.future().toISOString().slice(0, 16);
		const newSeats = faker.number.int({ min: 1, max: 1000 }).toString();
		const newPrice = faker.number.int({ min: 1, max: 1000 }).toString();
		const newImageUrl = faker.image.url();

		await manageEventsPage.editEvent(
			title,
			description,
			category,
			city,
			venue,
			dateTime,
			seats,
			price,
			imageUrl,
			newTitle,
			newDescription,
			newCategory,
			newCity,
			newVenue,
			newDateTime,
			newSeats,
			newPrice,
			newImageUrl,
		);

		await manageEventsPage.verifyEventDetails(
			newTitle,
			newCategory,
			newCity,
			newDateTime,
			newPrice,
		);
		await manageEventsPage.deleteEvent(newTitle);
	},
);
