/** @format */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestData } from '../TestData/TestData';

export class GetEventListAPI {
	request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async getAllEvents(
		token: string,
		category?: string,
		city?: string,
		search?: string,
		page?: string,
		limit?: string,
	): Promise<APIResponse<any>> {
		const response = await this.callGetAllEventsAPI(
			token,
			category,
			city,
			search,
			page,
			limit,
		);
		return response;
	}

	async callGetAllEventsAPI(
		token: string,
		category?: string,
		city?: string,
		search?: string,
		page?: string,
		limit?: string,
	): Promise<APIResponse<any>> {
		const searchParams = new URLSearchParams();
		if (category) searchParams.set('category', category);
		if (city) searchParams.append('city', city);
		if (search) searchParams.append('search', search);
		if (page) searchParams.append('page', page);
		if (limit) searchParams.append('limit', limit);

		const getAllEventsResponse = await this.request.get(
			TestData.apiUrl + '/events',
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: searchParams,
			},
		);
		return getAllEventsResponse;
	}
}
