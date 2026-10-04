/** @format */

import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { LoginAPI } from '../../api-methods/LoginAPI';
import { CreateEventAPI } from '../../api-methods/CreateEventAPI';
import { faker } from '@faker-js/faker';
import { CreateBookingsAPI } from '../../api-methods/CreateBookingsAPI';
import { GetAllBookingsAPI } from '../../api-methods/GetAllBookingsAPI';

test(
	'Create booking with valid details',
	{ tag: '@CreateBookingAPITest' },
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

		expect(createBookingResponse.ok()).toBeTruthy();

		const createBookingResponseBody =
			await createBookingResponse.json();

		expect(createBookingResponseBody.success).toBeTruthy();
		expect(createBookingResponseBody.message).toBe(
			'Booking confirmed!',
		);
		expect(createBookingResponseBody.data.id).toBeDefined();
		expect(createBookingResponseBody.data.eventId).toBe(eventId);
		expect(createBookingResponseBody.data.customerName).toBe(name);
		expect(createBookingResponseBody.data.customerEmail).toBe(
			email.toLowerCase(),
		);
		expect(createBookingResponseBody.data.customerPhone).toBe(phone);
		expect(createBookingResponseBody.data.quantity).toBe(quantity);
		expect(createBookingResponseBody.data.totalPrice).toBe(
			(quantity * price).toString(),
		);
		expect(createBookingResponseBody.data.status).toBe('confirmed');
		expect(createBookingResponseBody.data.bookingRef).toBeDefined();

		expect(createBookingResponseBody.data.event.id).toBeDefined();
		expect(createBookingResponseBody.data.event.title).toBe(title);
		expect(createBookingResponseBody.data.event.description).toBe(
			description,
		);
		expect(createBookingResponseBody.data.event.category).toBe(
			category,
		);
		expect(createBookingResponseBody.data.event.venue).toBe(venue);
		expect(createBookingResponseBody.data.event.city).toBe(city);
		expect(createBookingResponseBody.data.event.eventDate).toBe(
			dateTime,
		);
		expect(createBookingResponseBody.data.event.price).toBe(
			price.toString(),
		);
		expect(createBookingResponseBody.data.event.totalSeats).toBe(seats);
		// expect(createBookingResponseBody.data.event.availableSeats).toBe(
		// 	seats - quantity,
		// );

		const bookingId = await createBookingAPI.getBookingId(
			createBookingResponse,
		);

		const getAllBookingsAPI = new GetAllBookingsAPI(request);
		const getAllBookingsResponse =
			await getAllBookingsAPI.getAllBookings(token);

		expect(getAllBookingsResponse.ok()).toBeTruthy();

		const getAllBookingsResponseBody =
			await getAllBookingsResponse.json();

		for (let i = 0; i < getAllBookingsResponseBody.data.length; i++) {
			if (getAllBookingsResponseBody.data[i].id == bookingId) {
				expect(
					getAllBookingsResponseBody.data[i].id,
				).toBeDefined();
				expect(getAllBookingsResponseBody.data[i].eventId).toBe(
					eventId,
				);
				expect(
					getAllBookingsResponseBody.data[i].customerName,
				).toBe(name);
				expect(
					getAllBookingsResponseBody.data[i].customerEmail,
				).toBe(email.toLowerCase());
				expect(
					getAllBookingsResponseBody.data[i].customerPhone,
				).toBe(phone);
				expect(
					getAllBookingsResponseBody.data[i].quantity,
				).toBe(quantity);
				expect(
					getAllBookingsResponseBody.data[i].totalPrice,
				).toBe((quantity * price).toString());
				expect(getAllBookingsResponseBody.data[i].status).toBe(
					'confirmed',
				);
				expect(
					getAllBookingsResponseBody.data[i].bookingRef,
				).toBeDefined();

				expect(
					getAllBookingsResponseBody.data[i].event.id,
				).toBeDefined();
				expect(
					getAllBookingsResponseBody.data[i].event.title,
				).toBe(title);
				expect(
					getAllBookingsResponseBody.data[i].event
						.description,
				).toBe(description);
				expect(
					getAllBookingsResponseBody.data[i].event.category,
				).toBe(category);
				expect(
					getAllBookingsResponseBody.data[i].event.venue,
				).toBe(venue);
				expect(
					getAllBookingsResponseBody.data[i].event.city,
				).toBe(city);
				expect(
					getAllBookingsResponseBody.data[i].event
						.eventDate,
				).toBe(dateTime);
				expect(
					getAllBookingsResponseBody.data[i].event.price,
				).toBe(price.toString());
				expect(
					getAllBookingsResponseBody.data[i].event
						.totalSeats,
				).toBe(seats);
				// expect(
				// 	createBookingResponseBody.data[i].event
				// 		.availableSeats,
				// ).toBe(seats - quantity);
			}
		}
	},
);

test(
	'Create Booking with no token test',
	{ tag: '@CreateBookingAPITest' },
	async ({ request }) => {
		const email = faker.internet.email();
		const name = faker.person.fullName();
		const phone = '1234567890';
		const quantity = faker.number.int({ min: 1, max: 10 });

		const createBookingAPI = new CreateBookingsAPI(request);

		const createBookingResponse = await createBookingAPI.createBooking(
			'',
			285,
			name,
			email,
			phone,
			quantity,
		);

		expect(createBookingResponse.ok()).toBeFalsy();

		const responseBody = await createBookingResponse.json();

		expect(responseBody.success).toBeFalsy();
	},
);

test(
	'Create booking with invalid details',
	{ tag: '@CreateBookingAPITest' },
	async ({ request }) => {
		const token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);
		const createBookingAPI = new CreateBookingsAPI(request);

		const createBookingResponse = await createBookingAPI.createBooking(
			token,
			285,
			'',
			'',
			'',
			0,
		);

		expect(createBookingResponse.ok()).toBeFalsy();

		const responseBody = await createBookingResponse.json();

		expect(responseBody.success).toBeFalsy();
		expect(responseBody.error).toBe('Validation failed');
	},
);

test(
	'Create booking with event id details that does not exist',
	{ tag: '@CreateBookingAPITest' },
	async ({ request }) => {
		const token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);
		const email = faker.internet.email();
		const name = faker.person.fullName();
		const phone = '1234567890';
		const quantity = faker.number.int({ min: 1, max: 10 });

		const createBookingAPI = new CreateBookingsAPI(request);

		const createBookingResponse = await createBookingAPI.createBooking(
			token,
			1,
			name,
			email,
			phone,
			quantity,
		);

		expect(createBookingResponse.ok()).toBeFalsy();

		const getEventResponseBody = await createBookingResponse.json();

		expect(getEventResponseBody.success).toBeFalsy();
		expect(getEventResponseBody.error).toBe(
			'Event with id 1 not found',
		);
	},
);

test(
	'Create booking with seat count more then available seats',
	{ tag: '@CreateBookingAPITest' },
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
		const seats = faker.number.int({ min: 1, max: 5 });
		const price = faker.number.int({ min: 1, max: 1000 });
		const imageUrl = faker.image.url();

		const email = faker.internet.email();
		const name = faker.person.fullName();
		const phone = '1234567890';
		const quantity = faker.number.int({ min: 6, max: 10 });

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

		expect(createBookingResponse.ok()).toBeFalsy();

		const createBookingResponseBody =
			await createBookingResponse.json();

		expect(createBookingResponseBody.success).toBeFalsy();
		expect(createBookingResponseBody.error).toBe(
			`Only ${seats} seat(s) available, but ${quantity} requested`,
		);
	},
);
