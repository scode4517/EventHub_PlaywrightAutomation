/** @format */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestData } from '../TestData/TestData';

export class GetBookingByRefIdAPI {
	request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async getBookingByRefId(
		token: string,
		refId: string,
	): Promise<APIResponse<any>> {
		const response = await this.callGetBookingByRefIdAPI(token, refId);
		return response;
	}

	async callGetBookingByRefIdAPI(
		token: string,
		refId: string,
	): Promise<APIResponse<any>> {
		const getBookingResponse = await this.request.get(
			TestData.apiUrl + `/bookings/ref/${refId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return getBookingResponse;
	}
}
