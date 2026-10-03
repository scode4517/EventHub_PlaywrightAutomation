/** @format */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestData } from '../TestData/TestData';

export class UpdateEventAPI {
	request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async updateEvent(
		id: number,
		token: string,
		title: string,
		description: string,
		category: string,
		venue: string,
		city: string,
		eventDate: string,
		price: number,
		totalSeats: number,
		imageUrl: string,
	): Promise<APIResponse<any>> {
		const response = await this.callUpdateEventAPI(
			id,
			token,
			title,
			description,
			category,
			venue,
			city,
			eventDate,
			price,
			totalSeats,
			imageUrl,
		);
		return response;
	}

	async callUpdateEventAPI(
		id: number,
		token: string,
		title: string,
		description: string,
		category: string,
		venue: string,
		city: string,
		eventDate: string,
		price: number,
		totalSeats: number,
		imageUrl: string,
	): Promise<APIResponse<any>> {
		const event = {
			title: title,
			description: description,
			category: category,
			venue: venue,
			city: city,
			eventDate: eventDate,
			price: price,
			totalSeats: totalSeats,
			imageUrl: imageUrl,
		};
		const registerResponse = await this.request.put(
			TestData.apiUrl + `/events/${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				data: event,
			},
		);
		return registerResponse;
	}
}
