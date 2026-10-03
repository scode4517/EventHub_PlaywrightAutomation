/** @format */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestData } from '../TestData/TestData';

export class AuthMeAPI {
	request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async authenticateUser(token: string): Promise<APIResponse<any>> {
		const response = await this.callAuthenticateAPI(token);
		return response;
	}

	async callAuthenticateAPI(token: string): Promise<APIResponse<any>> {
		const response = await this.request.get(
			TestData.apiUrl + '/auth/me',
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return response;
	}
}
