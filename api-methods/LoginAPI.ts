/** @format */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestData } from '../TestData/TestData';

export class LoginAPI {
	request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async getToken(email: string, password: string): Promise<string> {
		const response = await this.callLoginAPI(email, password);
		return (await response.json()).token;
	}

	async callLoginAPI(
		email: string,
		password: string,
	): Promise<APIResponse<any>> {
		const user = {
			email: email,
			password: password,
		};
		const loginResponse = await this.request.post(
			TestData.apiUrl + '/auth/login',
			{ data: user },
		);
		return loginResponse;
	}
}
