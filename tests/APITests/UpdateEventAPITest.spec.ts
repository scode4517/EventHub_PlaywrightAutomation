/** @format */

import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { LoginAPI } from '../../api-methods/LoginAPI';
import { GetEventListAPI } from '../../api-methods/GetEventsListAPI';
import { CreateEventAPI } from '../../api-methods/CreateEventAPI';
import { faker } from '@faker-js/faker';
import { GetEventByIdAPI } from '../../api-methods/GetEventByIdAPI';
import { UpdateEventAPI } from '../../api-methods/UpdateEventAPI';

test(
	'Update event with event id details',
	{ tag: '@GetEventByIdAPITest' },
	async ({ request }) => {
		const token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		let title = faker.word.noun();
		let description = faker.lorem.paragraph();
		let category = faker.helpers.arrayElement(TestData.eventCategories);
		let city = faker.location.city();
		let venue = faker.location.streetAddress();
		let dateTime = faker.date.future().toISOString();
		let seats = faker.number.int({ min: 1, max: 1000 });
		let price = faker.number.int({ min: 1, max: 1000 });
		let imageUrl = faker.image.url();

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

		title = faker.word.noun();
		description = faker.lorem.paragraph();
		category = faker.helpers.arrayElement(TestData.eventCategories);
		city = faker.location.city();
		venue = faker.location.streetAddress();
		dateTime = faker.date.future().toISOString();
		seats = faker.number.int({ min: 1, max: 1000 });
		price = faker.number.int({ min: 1, max: 1000 });
		imageUrl = faker.image.url();

		const updateEventResponse = await new UpdateEventAPI(
			request,
		).updateEvent(
			eventId,
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

		expect(updateEventResponse.ok()).toBeTruthy();

		const updateEventResponseBody = await updateEventResponse.json();

		expect(updateEventResponseBody.data.title).toBe(title);
		expect(updateEventResponseBody.data.description).toBe(description);
		expect(updateEventResponseBody.data.category).toBe(category);
		expect(updateEventResponseBody.data.venue).toBe(venue);
		expect(updateEventResponseBody.data.city).toBe(city);
		expect(updateEventResponseBody.data.eventDate).toBe(dateTime);
		expect(updateEventResponseBody.data.price).toBe(price.toString());
		expect(updateEventResponseBody.data.totalSeats).toBe(seats);

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
	'Update event with event id details that does not exist',
	{ tag: '@GetEventByIdAPITest' },
	async ({ request }) => {
		const token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);
		let title = faker.word.noun();
		let description = faker.lorem.paragraph();
		let category = faker.helpers.arrayElement(TestData.eventCategories);
		let city = faker.location.city();
		let venue = faker.location.streetAddress();
		let dateTime = faker.date.future().toISOString();
		let seats = faker.number.int({ min: 1, max: 1000 });
		let price = faker.number.int({ min: 1, max: 1000 });
		let imageUrl = faker.image.url();

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

		title = faker.word.noun();
		description = faker.lorem.paragraph();
		category = faker.helpers.arrayElement(TestData.eventCategories);
		city = faker.location.city();
		venue = faker.location.streetAddress();
		dateTime = faker.date.future().toISOString();
		seats = faker.number.int({ min: 1, max: 1000 });
		price = faker.number.int({ min: 1, max: 1000 });
		imageUrl = faker.image.url();

		const updateEventResponse = await new UpdateEventAPI(
			request,
		).updateEvent(
			0,
			token,
			title,
			description,
			category,
			city,
			venue,
			dateTime,
			price,
			seats,
			imageUrl,
		);

		expect(updateEventResponse.ok()).toBeFalsy();

		const updateEventResponseBody = await updateEventResponse.json();

		expect(updateEventResponseBody.success).toBeFalsy();
		expect(updateEventResponseBody.error).toBe(
			'Event with id 0 not found',
		);
	},
);

test(
	'Update event with no token test',
	{ tag: '@GetEventByIdAPITest' },
	async ({ request }) => {
		let title = faker.word.noun();
		let description = faker.lorem.paragraph();
		let category = faker.helpers.arrayElement(TestData.eventCategories);
		let city = faker.location.city();
		let venue = faker.location.streetAddress();
		let dateTime = faker.date.future().toISOString();
		let seats = faker.number.int({ min: 1, max: 1000 });
		let price = faker.number.int({ min: 1, max: 1000 });
		let imageUrl = faker.image.url();

		const updateEventResponse = await new UpdateEventAPI(
			request,
		).updateEvent(
			285,
			'',
			title,
			description,
			category,
			city,
			venue,
			dateTime,
			price,
			seats,
			imageUrl,
		);

		expect(updateEventResponse.ok()).toBeFalsy();
		const responseBody = await updateEventResponse.json();

		expect(responseBody.success).toBeFalsy();
	},
);
