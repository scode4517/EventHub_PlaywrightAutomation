/** @format */

import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { LoginAPI } from '../../api-methods/LoginAPI';
import { GetEventListAPI } from '../../api-methods/GetEventsListAPI';
import { CreateEventAPI } from '../../api-methods/CreateEventAPI';
import { faker } from '@faker-js/faker';

test(
	'Create event with valid details',
	{ tag: '@CreateEventAPITest' },
	async ({ request }) => {
		const token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const title = faker.word.noun();
		const description = faker.lorem.paragraph();
		const category = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city = faker.location.city();
		const venue = faker.location.streetAddress();
		const dateTime = faker.date.future().toISOString();
		const seats = faker.number.int({ min: 1, max: 1000 });
		const price = faker.number.int({ min: 1, max: 1000 });
		const imageUrl = faker.image.url();

		const createEventResponse = await new CreateEventAPI(
			request,
		).createEvent(
			token,
			title,
			description,
			category,
			venue,
			city,
			dateTime,
			price,
			seats,
			imageUrl,
		);

		expect(createEventResponse.ok()).toBeTruthy();

		const responseBody = await createEventResponse.json();
		const eventId: number = responseBody.data.id;

		expect(responseBody.success).toBeTruthy();
		expect(responseBody.message).toBe('Event created successfully');
		expect(responseBody.data).toBeDefined();
		expect(responseBody.data.id).toBeDefined();
		expect(responseBody.data.title).toBe(title);
		expect(responseBody.data.description).toBe(description);
		expect(responseBody.data.category).toBe(category);
		expect(responseBody.data.venue).toBe(venue);
		expect(responseBody.data.city).toBe(city);
		expect(responseBody.data.eventDate).toBe(dateTime);
		expect(responseBody.data.price).toBe(price.toString());
		expect(responseBody.data.totalSeats).toBe(seats);

		const getAllEventsAPIResponse = await new GetEventListAPI(
			request,
		).getAllEvents(token);

		expect(getAllEventsAPIResponse.ok()).toBeTruthy();

		const getEventsResponseBody = await getAllEventsAPIResponse.json();

		for (let i = 0; i < getEventsResponseBody.data.length; i++) {
			if (getEventsResponseBody.data[i].id == eventId) {
				expect(getEventsResponseBody.data[i].title).toBe(title);
				expect(getEventsResponseBody.data[i].description).toBe(
					description,
				);
				expect(getEventsResponseBody.data[i].category).toBe(
					category,
				);
				expect(getEventsResponseBody.data[i].venue).toBe(venue);
				expect(getEventsResponseBody.data[i].city).toBe(city);
				expect(getEventsResponseBody.data[i].eventDate).toBe(
					dateTime,
				);
				expect(getEventsResponseBody.data[i].price).toBe(
					price.toString(),
				);
				expect(getEventsResponseBody.data[i].totalSeats).toBe(
					seats,
				);
			}
		}
	},
);

test(
	'Create event with no token test',
	{ tag: '@CreateEventAPITest' },
	async ({ request }) => {
		const title = faker.word.noun();
		const description = faker.lorem.paragraph();
		const category = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city = faker.location.city();
		const venue = faker.location.streetAddress();
		const dateTime = faker.date.future().toISOString();
		const seats = faker.number.int({ min: 1, max: 1000 });
		const price = faker.number.int({ min: 1, max: 1000 });
		const imageUrl = faker.image.url();

		const createEventResponse = await new CreateEventAPI(
			request,
		).createEvent(
			'token',
			title,
			description,
			category,
			venue,
			city,
			dateTime,
			price,
			seats,
			imageUrl,
		);

		expect(createEventResponse.ok()).toBeFalsy();

		const responseBody = await createEventResponse.json();

		expect(responseBody.success).toBeFalsy();
	},
);

test(
	'Create event with invalid details',
	{ tag: '@CreateEventAPITest' },
	async ({ request }) => {
		const token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const createEventResponse = await new CreateEventAPI(
			request,
		).createEvent(token, '', '', '', '', '', '', 0, 0, '');

		expect(createEventResponse.ok()).toBeFalsy();

		const responseBody = await createEventResponse.json();

		expect(responseBody.success).toBeFalsy();
		expect(responseBody.error).toBe('Validation failed');
	},
);
