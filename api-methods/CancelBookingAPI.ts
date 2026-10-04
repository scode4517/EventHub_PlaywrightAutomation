/** @format */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestData } from '../TestData/TestData';

export class CancelBookingAPI {
	request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async cancelBookingById(
		token: string,
		id: number,
	): Promise<APIResponse<any>> {
		const response = await this.callCancelBookingByIdAPI(token, id);
		return response;
	}

	async callCancelBookingByIdAPI(
		token: string,
		id: number,
	): Promise<APIResponse<any>> {
		const getEventResponse = await this.request.delete(
			TestData.apiUrl + `/bookings/${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return getEventResponse;
	}
}
