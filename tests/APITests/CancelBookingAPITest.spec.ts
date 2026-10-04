/** @format */

import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { LoginAPI } from '../../api-methods/LoginAPI';
import { CreateEventAPI } from '../../api-methods/CreateEventAPI';
import { faker } from '@faker-js/faker';
import { GetEventByIdAPI } from '../../api-methods/GetEventByIdAPI';
import { DeleteEventAPI } from '../../api-methods/DeleteEventAPI';
import { CreateBookingsAPI } from '../../api-methods/CreateBookingsAPI';
import { CancelBookingAPI } from '../../api-methods/CancelBookingAPI';
import { GetBookingByIdAPI } from '../../api-methods/GetBookingByIdAPI';

test(
	'Cancel booking with event id details',
	{ tag: '@CancelBookingByIdAPITest' },
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

		const email = faker.internet.email();
		const name = faker.person.fullName();
		const phone = '1234567890';
		const quantity = faker.number.int({ min: 1, max: 10 });

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

		const createBookingAPI = new CreateBookingsAPI(request);

		const createBookingResponse = await createBookingAPI.createBooking(
			token,
			eventId,
			name,
			email,
			phone,
			quantity,
		);

		const id = await createBookingAPI.getBookingId(
			createBookingResponse,
		);

		const cancelBookingAPI = new CancelBookingAPI(request);
		const cancelBookingResponse =
			await cancelBookingAPI.cancelBookingById(token, id);

		expect(cancelBookingResponse.ok()).toBeTruthy();

		const cancelBookingResponseBody =
			await cancelBookingResponse.json();

		expect(cancelBookingResponseBody.success).toBeTruthy();
		expect(cancelBookingResponseBody.message).toBe('Booking cancelled');

		const getBookingByIdAPI = new GetBookingByIdAPI(request);
		const bookingResponse = await getBookingByIdAPI.getBookingById(
			token,
			id,
		);

		expect(bookingResponse.ok()).toBeFalsy();

		const getEventResponseBody = await bookingResponse.json();

		expect(getEventResponseBody.success).toBeFalsy();
		expect(getEventResponseBody.error).toBe(
			`Booking with id ${id} not found`,
		);
	},
);

test(
	'Cancel booking with id details that does not exist',
	{ tag: '@CancelBookingByIdAPITest' },
	async ({ request }) => {
		const token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);
		const cancelBookingAPI = new CancelBookingAPI(request);
		const cancelBookingResponse =
			await cancelBookingAPI.cancelBookingById(token, 0);

		expect(cancelBookingResponse.ok()).toBeFalsy();

		const cancelBookingResponseBody =
			await cancelBookingResponse.json();

		expect(cancelBookingResponseBody.success).toBeFalsy();
		expect(cancelBookingResponseBody.error).toBe(
			'Booking with id 0 not found',
		);
	},
);

test(
	'Cancel booking with no token test',
	{ tag: '@CancelBookingByIdAPITest' },
	async ({ request }) => {
		const cancelBookingAPI = new CancelBookingAPI(request);
		const cancelBookingResponse =
			await cancelBookingAPI.cancelBookingById('', 0);

		expect(cancelBookingResponse.ok()).toBeFalsy();

		const responseBody = await cancelBookingResponse.json();

		expect(responseBody.success).toBeFalsy();
	},
);
