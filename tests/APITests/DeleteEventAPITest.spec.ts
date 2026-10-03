/** @format */

import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { LoginAPI } from '../../api-methods/LoginAPI';
import { CreateEventAPI } from '../../api-methods/CreateEventAPI';
import { faker } from '@faker-js/faker';
import { GetEventByIdAPI } from '../../api-methods/GetEventByIdAPI';
import { DeleteEventAPI } from '../../api-methods/DeleteEventAPI';

test(
	'Delete event with event id details',
	{ tag: '@DeleteEventByIdAPITest' },
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

		const deleteResponse = await new DeleteEventAPI(
			request,
		).deleteEventById(token, eventId);

		expect(deleteResponse.ok()).toBeTruthy();

		const deleteResponseBody = await deleteResponse.json();

		expect(deleteResponseBody.success).toBeTruthy();
		expect(deleteResponseBody.message).toBe(
			'Event deleted successfully',
		);

		const getEventByIdResponse = await new GetEventByIdAPI(
			request,
		).getEventById(token, eventId);

		expect(getEventByIdResponse.ok()).toBeFalsy();

		const getEventResponseBody = await getEventByIdResponse.json();

		expect(getEventResponseBody.success).toBeFalsy();
		expect(getEventResponseBody.error).toBe(
			`Event with id ${eventId} not found`,
		);
	},
);

test(
	'Delete event with event id details that does not exist',
	{ tag: '@DeleteEventByIdAPITest' },
	async ({ request }) => {
		const token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);
		const deleteEventResponse = await new DeleteEventAPI(
			request,
		).deleteEventById(token, 0);

		expect(deleteEventResponse.ok()).toBeFalsy();

		const deleteEventResponseBody = await deleteEventResponse.json();

		expect(deleteEventResponseBody.success).toBeFalsy();
		expect(deleteEventResponseBody.error).toBe(
			'Event with id 0 not found',
		);
	},
);

test(
	'Delete event with no token test',
	{ tag: '@DeleteEventByIdAPITest' },
	async ({ request }) => {
		const deleteEventResponse = await new DeleteEventAPI(
			request,
		).deleteEventById('', 0);

		expect(deleteEventResponse.ok()).toBeFalsy();

		const responseBody = await deleteEventResponse.json();

		expect(responseBody.success).toBeFalsy();
	},
);
