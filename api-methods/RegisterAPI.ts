/** @format */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestData } from '../TestData/TestData';

export class RegisterAPI {
	request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async registerUser(
		email: string,
		password: string,
	): Promise<APIResponse<any>> {
		const response = await this.callRegisterAPI(email, password);
		return response;
	}

	async getToken(email: string, password: string): Promise<string> {
		const response = await this.callRegisterAPI(email, password);
		return (await response.json()).token;
	}

	async callRegisterAPI(
		email: string,
		password: string,
	): Promise<APIResponse<any>> {
		const user = {
			email: email,
			password: password,
		};
		const registerResponse = await this.request.post(
			TestData.apiUrl + '/auth/register',
			{ data: user },
		);
		return registerResponse;
	}
}
