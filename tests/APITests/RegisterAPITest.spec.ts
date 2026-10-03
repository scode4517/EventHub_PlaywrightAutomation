/** @format */

import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { RegisterAPI } from '../../api-methods/RegisterAPI';
import { faker } from '@faker-js/faker';

test(
	'Valid register test',
	{ tag: '@RegisterAPITest' },
	async ({ request }) => {
		const email = faker.internet.email();
		const password = faker.internet.password({
			length: 12,
			memorable: false,
			pattern: /[A-Za-z0-9!@#$%^&*]/,
			prefix: 'Aa1!',
		});

		const registerResponse = await new RegisterAPI(
			request,
		).registerUser(email, password);
		expect(registerResponse.ok()).toBeTruthy();

		const responseBody = await registerResponse.json();

		expect(responseBody.success).toBeTruthy();
		expect(responseBody.token).toBeDefined();
		expect(responseBody.user.email).toBe(email);
		expect(responseBody.user.id).toBeDefined();
	},
);

test(
	'User exists register test',
	{ tag: '@RegisterAPITest' },
	async ({ request }) => {
		const registerResponse = await new RegisterAPI(
			request,
		).registerUser(TestData.email, TestData.password);
		expect(registerResponse.ok()).toBeFalsy;

		const responseBody = await registerResponse.json();

		expect(responseBody.success).toBeFalsy();
		expect(responseBody.error).toBeDefined();
	},
);

test(
	'Empty register test',
	{ tag: '@RegisterAPITest' },
	async ({ request }) => {
		const registerResponse = await new RegisterAPI(
			request,
		).registerUser('', '');

		const responseBody = await registerResponse.json();

		expect(responseBody.success).toBeFalsy();
		expect(responseBody.token).toBeUndefined();
		expect(responseBody.details).toBeDefined();
	},
);
