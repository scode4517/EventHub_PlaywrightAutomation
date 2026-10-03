/** @format */

import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { LoginAPI } from '../../api-methods/LoginAPI';
import { AuthMeAPI } from '../../api-methods/AuthMeAPI';

test('Valid token test', { tag: '@AuthMeAPITest' }, async ({ request }) => {
	const token = await new LoginAPI(request).getToken(
		TestData.email,
		TestData.password,
	);

	const loginResponse = await new LoginAPI(request).callLoginAPI(
		TestData.email,
		TestData.password,
	);

	const authenticationResponse = await new AuthMeAPI(
		request,
	).authenticateUser(token);

	expect(authenticationResponse.ok()).toBeTruthy();

	const responseBody = await authenticationResponse.json();

	expect(responseBody.success).toBeTruthy();
	expect(responseBody.user.email).toBe(TestData.email);
	expect(responseBody.user.id).toBe(
		(await loginResponse.json()).user.userId,
	);
});

test('Invalid token test', { tag: '@AuthMeAPITest' }, async ({ request }) => {
	const authenticationResponse = await new AuthMeAPI(
		request,
	).authenticateUser('');

	expect(authenticationResponse.ok()).toBeFalsy();

	const responseBody = await authenticationResponse.json();

	expect(responseBody.success).toBeFalsy();
	expect(responseBody.error).toBeDefined();
});
