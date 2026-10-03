/** @format */

import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { LoginAPI } from '../../api-methods/LoginAPI';
import { GetEventListAPI } from '../../api-methods/GetEventsListAPI';
import { CreateEventAPI } from '../../api-methods/CreateEventAPI';
import { faker } from '@faker-js/faker';
import { GetEventByIdAPI } from '../../api-methods/GetEventByIdAPI';

test(
	'Get event with event id details',
	{ tag: '@GetEventByIdAPITest' },
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
		const eventId = await new CreateEventAPI(request).getEventId(
			createEventResponse,
		);

		const getEventByIdResponse = await new GetEventByIdAPI(
			request,
		).getEventById(token, eventId);

		expect(getEventByIdResponse.ok()).toBeTruthy();

		const getEventsResponseBody = await getEventByIdResponse.json();

		expect(getEventsResponseBody.data.title).toBe(title);
		expect(getEventsResponseBody.data.description).toBe(description);
		expect(getEventsResponseBody.data.category).toBe(category);
		expect(getEventsResponseBody.data.venue).toBe(venue);
		expect(getEventsResponseBody.data.city).toBe(city);
		expect(getEventsResponseBody.data.eventDate).toBe(dateTime);
		expect(getEventsResponseBody.data.price).toBe(price.toString());
		expect(getEventsResponseBody.data.totalSeats).toBe(seats);
	},
);

test(
	'Get event with event id details that does not exist',
	{ tag: '@GetEventByIdAPITest' },
	async ({ request }) => {
		const token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);
		const getEventByIdResponse = await new GetEventByIdAPI(
			request,
		).getEventById(token, 0);

		expect(getEventByIdResponse.ok()).toBeFalsy();

		const getEventResponseBody = await getEventByIdResponse.json();

		expect(getEventResponseBody.success).toBeFalsy();
		expect(getEventResponseBody.error).toBe(
			'Event with id 0 not found',
		);
	},
);

test(
	'Get event with no token test',
	{ tag: '@GetEventByIdAPITest' },
	async ({ request }) => {
		const getEventByIdResponse = await new GetEventByIdAPI(
			request,
		).getEventById('', 0);

		expect(getEventByIdResponse.ok()).toBeFalsy();

		const responseBody = await getEventByIdResponse.json();

		expect(responseBody.success).toBeFalsy();
	},
);
