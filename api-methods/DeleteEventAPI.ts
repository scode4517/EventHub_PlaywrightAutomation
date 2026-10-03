/** @format */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestData } from '../TestData/TestData';

export class DeleteEventAPI {
	request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async deleteEventById(
		token: string,
		id: number,
	): Promise<APIResponse<any>> {
		const response = await this.callDeleteEventByIdAPI(token, id);
		return response;
	}

	async callDeleteEventByIdAPI(
		token: string,
		id: number,
	): Promise<APIResponse<any>> {
		const getEventResponse = await this.request.delete(
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
