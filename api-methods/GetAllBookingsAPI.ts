/** @format */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestData } from '../TestData/TestData';

export class GetAllBookingsAPI {
	request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async getAllBookings(
		token: string,
		eventId?: number,
		status?: string,
		page?: string,
		limit?: string,
	): Promise<APIResponse<any>> {
		const response = await this.callGetAllBookingsAPI(
			token,
			eventId,
			status,
			page,
			limit,
		);
		return response;
	}

	async callGetAllBookingsAPI(
		token: string,
		eventId?: number,
		status?: string,
		page?: string,
		limit?: string,
	): Promise<APIResponse<any>> {
		const searchParams = new URLSearchParams();
		if (eventId) searchParams.set('eventId', eventId.toString());
		if (status) searchParams.append('status', status);
		if (page) searchParams.append('page', page);
		if (limit) searchParams.append('limit', limit);

		const getAllBookingsResponse = await this.request.get(
			TestData.apiUrl + '/bookings',
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: searchParams,
			},
		);
		return getAllBookingsResponse;
	}
}
