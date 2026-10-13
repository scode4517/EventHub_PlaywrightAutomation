/** @format */

import { test } from '../testSetup';
import { PageManager } from '../../pageObjects/PageManager';
import { TestData } from '../../TestData/TestData';
import { faker } from '@faker-js/faker';
import { HomePage } from '../../pageObjects/HomePage';
import { ManageEventsPage } from '../../pageObjects/ManageEventsPage';

test.describe('Manage events page Test', () => {
	let homePage: HomePage;
	let manageEventsPage: ManageEventsPage;

	test.beforeEach(async ({ authenticatedPage }) => {
		homePage = PageManager.getHomePage(authenticatedPage);
		manageEventsPage =
			PageManager.getManageEventsPage(authenticatedPage);
		await homePage.gotoManageEventsPage();
	});

	test(
		'Event creation form visual test',
		{ tag: '@ManageEventsPageTest' },
		async () => {
			await manageEventsPage.isNavigatedToManageEventsPage();
			await manageEventsPage.manageEventsPageFormVisualTest();
		},
	);

	test(
		'Empty form submission test',
		{ tag: '@ManageEventsPageTest' },
		async () => {
			await manageEventsPage.createNewEvent();
			await manageEventsPage.verifyThatAllErrorsAreDisplayed();
		},
	);

	test(
		'Create new event and verify event details and delete the newly created event test',
		{ tag: '@ManageEventsPageTest' },
		async () => {
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
		async () => {
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

			const newTitle: string = faker.word.noun();
			const newDescription: string = faker.lorem.paragraph();
			const newCategory: string = faker.helpers.arrayElement(
				TestData.eventCategories,
			);
			const newCity: string = faker.location.city();
			const newVenue: string = faker.location.streetAddress();
			const newDateTime: string = faker.date
				.future()
				.toISOString()
				.slice(0, 16);
			const newSeats: string = faker.number
				.int({ min: 1, max: 1000 })
				.toString();
			const newPrice: string = faker.number
				.int({ min: 1, max: 1000 })
				.toString();
			const newImageUrl: string = faker.image.url();

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
});
