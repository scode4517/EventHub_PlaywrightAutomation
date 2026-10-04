/** @format */

import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { LoginAPI } from '../../api-methods/LoginAPI';
import { CreateEventAPI } from '../../api-methods/CreateEventAPI';
import { faker } from '@faker-js/faker';
import { CreateBookingsAPI } from '../../api-methods/CreateBookingsAPI';
import { GetBookingByRefIdAPI } from '../../api-methods/GetBookingByRefIdAPI';
import { GetBookingByIdAPI } from '../../api-methods/GetBookingByIdAPI';

test(
	'Get booking with booking id details',
	{ tag: '@GetBookingByIdAPITest' },
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

		const createBookingAPI = new CreateBookingsAPI(request);
		const getBookingByIdAPI = new GetBookingByIdAPI(request);

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

		const createBookingResponse = await createBookingAPI.createBooking(
			token,
			eventId,
			name,
			email,
			phone,
			quantity,
		);

		expect(createBookingResponse.ok()).toBeTruthy();

		const Id = await createBookingAPI.getBookingId(
			createBookingResponse,
		);

		const bookingResponse = await getBookingByIdAPI.getBookingById(
			token,
			Id,
		);

		expect(bookingResponse.ok()).toBeTruthy();

		const createBookingResponseBody = await bookingResponse.json();

		expect(createBookingResponseBody.success).toBeTruthy();
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
	},
);

test(
	'Get booking with id details that does not exist',
	{ tag: '@GetBookingByIdAPITest' },
	async ({ request }) => {
		const token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const getBookingByIdAPI = new GetBookingByIdAPI(request);
		const bookingResponse = await getBookingByIdAPI.getBookingById(
			token,
			0,
		);

		expect(bookingResponse.ok()).toBeFalsy();

		const getEventResponseBody = await bookingResponse.json();

		expect(getEventResponseBody.success).toBeFalsy();
		expect(getEventResponseBody.error).toBe(
			'Booking with id 0 not found',
		);
	},
);

test(
	'Get booking with no token test',
	{ tag: '@GetBookingByIdAPITest' },
	async ({ request }) => {
		const getBookingByRefAPI = new GetBookingByIdAPI(request);
		const bookingResponse = await getBookingByRefAPI.getBookingById(
			'',
			0,
		);

		expect(bookingResponse.ok()).toBeFalsy();

		const responseBody = await bookingResponse.json();

		expect(responseBody.success).toBeFalsy();
	},
);
