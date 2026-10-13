/** @format */
import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { LoginAPI } from '../../api-methods/LoginAPI';
import { CreateEventAPI } from '../../api-methods/CreateEventAPI';
import { faker } from '@faker-js/faker';
import { CreateBookingsAPI } from '../../api-methods/CreateBookingsAPI';
import { CancelBookingAPI } from '../../api-methods/CancelBookingAPI';
import { GetBookingByIdAPI } from '../../api-methods/GetBookingByIdAPI';

test.describe('Cancel Booking API Test', () => {
	let token: string;

	test.beforeEach(async ({ request }) => {
		token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);
	});

	test(
		'Cancel booking with event id details',
		{ tag: '@CancelBookingByIdAPITest' },
		async ({ request }) => {
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
			const email: string = faker.internet.email();
			const name: string = faker.person.fullName();
			const phone: string = '1234567890';
			const quantity: number = faker.number.int({
				min: 1,
				max: 10,
			});

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

			const createBookingResponse =
				await createBookingAPI.createBooking(
					token,
					eventId,
					name,
					email,
					phone,
					quantity,
				);

			const id: number = await createBookingAPI.getBookingId(
				createBookingResponse,
			);

			const cancelBookingAPI = new CancelBookingAPI(request);

			const cancelBookingResponse =
				await cancelBookingAPI.cancelBookingById(token, id);

			expect(cancelBookingResponse.ok()).toBeTruthy();

			const cancelBookingResponseBody =
				await cancelBookingResponse.json();

			expect(cancelBookingResponseBody.success).toBeTruthy();
			expect(cancelBookingResponseBody.message).toBe(
				'Booking cancelled',
			);

			const getBookingByIdAPI = new GetBookingByIdAPI(request);

			const bookingResponse =
				await getBookingByIdAPI.getBookingById(token, id);

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
});
