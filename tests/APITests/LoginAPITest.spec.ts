/** @format */

import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { LoginAPI } from '../../api-methods/LoginAPI';

test('Valid login test', { tag: '@LoginAPITest' }, async ({ request }) => {
	const loginResponse = await new LoginAPI(request).callLoginAPI(
		TestData.email,
		TestData.password,
	);
	expect(loginResponse.ok()).toBeTruthy();

	const responseBody = await loginResponse.json();

	expect(responseBody.success).toBeTruthy();
	expect(responseBody.token).toBeDefined();
	expect(responseBody.user.email).toBe(TestData.email);
});

test('Empty login test', { tag: '@LoginAPITest' }, async ({ request }) => {
	const loginResponse = await new LoginAPI(request).callLoginAPI('', '');
	// expect(loginResponse.statusText).toBeTruthy();
	// console.log(loginResponse.status);

	const responseBody = await loginResponse.json();

	expect(responseBody.success).toBeFalsy();
	expect(responseBody.token).toBeUndefined();
	expect(responseBody.details).toBeDefined();
});

test('Invalid login test', { tag: '@LoginAPITest' }, async ({ request }) => {
	const loginResponse = await new LoginAPI(request).callLoginAPI(
		'wert@gmail.com',
		'12312345612345',
	);
	// expect(loginResponse.statusText).toBeTruthy();
	// console.log(loginResponse.status);

	const responseBody = await loginResponse.json();

	expect(responseBody.success).toBeFalsy();
	expect(responseBody.token).toBeUndefined();
	// expect(responseBody.details).toBeFalsy();
	expect(responseBody.error).toBe('Invalid email or password');
});
