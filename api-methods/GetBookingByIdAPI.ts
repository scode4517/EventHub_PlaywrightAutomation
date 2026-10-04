/** @format */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestData } from '../TestData/TestData';

export class GetBookingByIdAPI {
	request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async getBookingById(
		token: string,
		Id: number,
	): Promise<APIResponse<any>> {
		const response = await this.callGetBookingByIdAPI(token, Id);
		return response;
	}

	async callGetBookingByIdAPI(
		token: string,
		Id: number,
	): Promise<APIResponse<any>> {
		const getBookingResponse = await this.request.get(
			TestData.apiUrl + `/bookings/${Id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return getBookingResponse;
	}
}
