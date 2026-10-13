/** @format */
import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { LoginAPI } from '../../api-methods/LoginAPI';
import { GetAllBookingsAPI } from '../../api-methods/GetAllBookingsAPI';

test.describe('Get All Booking API', () => {
	let token: string;

	test.beforeEach(async ({ request }) => {
		token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);
	});

	test(
		'Get all bookings with no filters test',
		{ tag: '@GetAllBookingsAPITest' },
		async ({ request }) => {
			const getAllBookingsAPIResponse = await new GetAllBookingsAPI(
				request,
			).getAllBookings(token);

			expect(getAllBookingsAPIResponse.ok()).toBeTruthy();

			const responseBody = await getAllBookingsAPIResponse.json();

			expect(responseBody.success).toBeTruthy();
		},
	);

	test(
		'Get all bookings with filters test',
		{ tag: '@GetAllBookingsAPITest' },
		async ({ request }) => {
			const getAllBookingsAPIResponse = await new GetAllBookingsAPI(
				request,
			).getAllBookings(token, 12453, 'Confirmed');

			expect(getAllBookingsAPIResponse.ok()).toBeTruthy();

			const responseBody = await getAllBookingsAPIResponse.json();

			expect(responseBody.success).toBeTruthy();
		},
	);

	test(
		'Get all bookings with no token test',
		{ tag: '@GetAllBookingsAPITest' },
		async ({ request }) => {
			const getAllBookingsAPIResponse = await new GetAllBookingsAPI(
				request,
			).getAllBookings('', 12453, 'Confirmed');

			expect(getAllBookingsAPIResponse.ok()).toBeFalsy();

			const responseBody = await getAllBookingsAPIResponse.json();

			expect(responseBody.success).toBeFalsy();
		},
	);
});
