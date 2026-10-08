/** @format */

import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { TestData } from '../../TestData/TestData';
import { LoginAPI } from '../../api-methods/LoginAPI';
import { RegisterAPI } from '../../api-methods/RegisterAPI';
import { GetEventListAPI } from '../../api-methods/GetEventsListAPI';
import { CreateEventAPI } from '../../api-methods/CreateEventAPI';
import { GetEventByIdAPI } from '../../api-methods/GetEventByIdAPI';
import { CreateBookingsAPI } from '../../api-methods/CreateBookingsAPI';
import { GetAllBookingsAPI } from '../../api-methods/GetAllBookingsAPI';
import { CancelBookingAPI } from '../../api-methods/CancelBookingAPI';
import { GetBookingByIdAPI } from '../../api-methods/GetBookingByIdAPI';
import { DeleteEventAPI } from '../../api-methods/DeleteEventAPI';

test('End2End API test', { tag: '@E2EAPITest' }, async ({ request }) => {
	const email: string = faker.internet.email();
	const password: string = faker.internet.password({
		length: 12,
		memorable: false,
		pattern: /[A-Za-z0-9!@#$%^&*]/,
		prefix: 'Aa1!',
	});

	await new RegisterAPI(request).registerUser(email, password);

	const token: string = await new LoginAPI(request).getToken(
		email,
		password,
	);

	const title: string = faker.word.noun();
	const description: string = faker.lorem.paragraph();
	const category: string = faker.helpers.arrayElement(
		TestData.eventCategories,
	);
	const city: string = faker.location.city();
	const venue: string = faker.location.streetAddress();
	const dateTime: string = faker.date.future().toISOString();
	const seats: number = faker.number.int({ min: 1, max: 1000 });
	const price: number = faker.number.int({ min: 1, max: 1000 });
	const imageUrl: string = faker.image.url();

	const name: string = faker.person.fullName();
	const phone: string = '1234567890';
	const quantity: number = faker.number.int({ min: 1, max: 10 });

	const createEventResponse = await new CreateEventAPI(request).createEvent(
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
			expect(getEventsResponseBody.data[i].category).toBe(category);
			expect(getEventsResponseBody.data[i].venue).toBe(venue);
			expect(getEventsResponseBody.data[i].city).toBe(city);
			expect(getEventsResponseBody.data[i].eventDate).toBe(
				dateTime,
			);
			expect(getEventsResponseBody.data[i].price).toBe(
				price.toString(),
			);
			expect(getEventsResponseBody.data[i].totalSeats).toBe(seats);
		}
	}

	let getEventByIdResponse = await new GetEventByIdAPI(
		request,
	).getEventById(token, eventId);

	expect(getEventByIdResponse.ok()).toBeTruthy();

	const getEventByIdResponseBody = await getEventByIdResponse.json();

	expect(getEventByIdResponseBody.data.title).toBe(title);
	expect(getEventByIdResponseBody.data.description).toBe(description);
	expect(getEventByIdResponseBody.data.category).toBe(category);
	expect(getEventByIdResponseBody.data.venue).toBe(venue);
	expect(getEventByIdResponseBody.data.city).toBe(city);
	expect(getEventByIdResponseBody.data.eventDate).toBe(dateTime);
	expect(getEventByIdResponseBody.data.price).toBe(price.toString());
	expect(getEventByIdResponseBody.data.totalSeats).toBe(seats);

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

	const createBookingResponseBody = await createBookingResponse.json();

	expect(createBookingResponseBody.success).toBeTruthy();
	expect(createBookingResponseBody.message).toBe('Booking confirmed!');
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
	expect(createBookingResponseBody.data.event.category).toBe(category);
	expect(createBookingResponseBody.data.event.venue).toBe(venue);
	expect(createBookingResponseBody.data.event.city).toBe(city);
	expect(createBookingResponseBody.data.event.eventDate).toBe(dateTime);
	expect(createBookingResponseBody.data.event.price).toBe(price.toString());
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

	const getAllBookingsResponseBody = await getAllBookingsResponse.json();

	for (let i = 0; i < getAllBookingsResponseBody.data.length; i++) {
		if (getAllBookingsResponseBody.data[i].id == bookingId) {
			expect(getAllBookingsResponseBody.data[i].id).toBeDefined();
			expect(getAllBookingsResponseBody.data[i].eventId).toBe(
				eventId,
			);
			expect(getAllBookingsResponseBody.data[i].customerName).toBe(
				name,
			);
			expect(getAllBookingsResponseBody.data[i].customerEmail).toBe(
				email.toLowerCase(),
			);
			expect(getAllBookingsResponseBody.data[i].customerPhone).toBe(
				phone,
			);
			expect(getAllBookingsResponseBody.data[i].quantity).toBe(
				quantity,
			);
			expect(getAllBookingsResponseBody.data[i].totalPrice).toBe(
				(quantity * price).toString(),
			);
			expect(getAllBookingsResponseBody.data[i].status).toBe(
				'confirmed',
			);
			expect(
				getAllBookingsResponseBody.data[i].bookingRef,
			).toBeDefined();

			expect(
				getAllBookingsResponseBody.data[i].event.id,
			).toBeDefined();
			expect(getAllBookingsResponseBody.data[i].event.title).toBe(
				title,
			);
			expect(
				getAllBookingsResponseBody.data[i].event.description,
			).toBe(description);
			expect(
				getAllBookingsResponseBody.data[i].event.category,
			).toBe(category);
			expect(getAllBookingsResponseBody.data[i].event.venue).toBe(
				venue,
			);
			expect(getAllBookingsResponseBody.data[i].event.city).toBe(
				city,
			);
			expect(
				getAllBookingsResponseBody.data[i].event.eventDate,
			).toBe(dateTime);
			expect(getAllBookingsResponseBody.data[i].event.price).toBe(
				price.toString(),
			);
			expect(
				getAllBookingsResponseBody.data[i].event.totalSeats,
			).toBe(seats);
			// expect(
			// 	createBookingResponseBody.data[i].event
			// 		.availableSeats,
			// ).toBe(seats - quantity);
		}
	}

	const cancelBookingAPI = new CancelBookingAPI(request);
	const cancelBookingResponse = await cancelBookingAPI.cancelBookingById(
		token,
		bookingId,
	);

	expect(cancelBookingResponse.ok()).toBeTruthy();

	const cancelBookingResponseBody = await cancelBookingResponse.json();

	expect(cancelBookingResponseBody.success).toBeTruthy();
	expect(cancelBookingResponseBody.message).toBe('Booking cancelled');

	const getBookingByIdAPI = new GetBookingByIdAPI(request);
	const bookingResponse = await getBookingByIdAPI.getBookingById(
		token,
		bookingId,
	);

	expect(bookingResponse.ok()).toBeFalsy();

	const getBookingResponseBody = await bookingResponse.json();

	expect(getBookingResponseBody.success).toBeFalsy();
	expect(getBookingResponseBody.error).toBe(
		`Booking with id ${bookingId} not found`,
	);

	const deleteResponse = await new DeleteEventAPI(request).deleteEventById(
		token,
		eventId,
	);

	expect(deleteResponse.ok()).toBeTruthy();

	const deleteResponseBody = await deleteResponse.json();

	expect(deleteResponseBody.success).toBeTruthy();
	expect(deleteResponseBody.message).toBe('Event deleted successfully');

	getEventByIdResponse = await new GetEventByIdAPI(request).getEventById(
		token,
		eventId,
	);

	expect(getEventByIdResponse.ok()).toBeFalsy();

	const getEventResponseBody = await getEventByIdResponse.json();

	expect(getEventResponseBody.success).toBeFalsy();
	expect(getEventResponseBody.error).toBe(
		`Event with id ${eventId} not found`,
	);
});
