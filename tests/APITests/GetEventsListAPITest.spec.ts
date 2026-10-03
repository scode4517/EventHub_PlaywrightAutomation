/** @format */

import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { LoginAPI } from '../../api-methods/LoginAPI';
import { GetEventListAPI } from '../../api-methods/GetEventsListAPI';

test(
	'Get events with no filters test',
	{ tag: '@GetAllEventsAPITest' },
	async ({ request }) => {
		const token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const getAllEventsAPIResponse = await new GetEventListAPI(
			request,
		).getAllEvents(token);

		expect(getAllEventsAPIResponse.ok()).toBeTruthy();

		const responseBody = await getAllEventsAPIResponse.json();

		expect(responseBody.success).toBeTruthy();
	},
);

test(
	'Get events with filters test',
	{ tag: '@GetAllEventsAPITest' },
	async ({ request }) => {
		const token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const getAllEventsAPIResponse = await new GetEventListAPI(
			request,
		).getAllEvents(
			token,
			'Conference',
			'Hyderabad',
			'summit',
			'1',
			'3',
		);

		expect(getAllEventsAPIResponse.ok()).toBeTruthy();

		const responseBody = await getAllEventsAPIResponse.json();

		expect(responseBody.success).toBeTruthy();
	},
);

test(
	'Get events with no token test',
	{ tag: '@GetAllEventsAPITest' },
	async ({ request }) => {
		const token = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const getAllEventsAPIResponse = await new GetEventListAPI(
			request,
		).getAllEvents('', 'Conference', 'Hyderabad', 'summit', '1', '3');

		expect(getAllEventsAPIResponse.ok()).toBeFalsy();

		const responseBody = await getAllEventsAPIResponse.json();

		expect(responseBody.success).toBeFalsy();
	},
);
