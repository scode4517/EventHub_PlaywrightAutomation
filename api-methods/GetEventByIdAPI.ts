/** @format */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestData } from '../TestData/TestData';

export class GetEventByIdAPI {
	request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async getEventById(token: string, id: number): Promise<APIResponse<any>> {
		const response = await this.callGetEventByIdAPI(token, id);
		return response;
	}

	async callGetEventByIdAPI(
		token: string,
		id: number,
	): Promise<APIResponse<any>> {
		const getEventResponse = await this.request.get(
			TestData.apiUrl + `/events/${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return getEventResponse;
	}
}
