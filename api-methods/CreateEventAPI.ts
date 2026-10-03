/** @format */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestData } from '../TestData/TestData';

export class CreateEventAPI {
	request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async createEvent(
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
		const response = await this.callCreateEventAPI(
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

	async getEventId(response: APIResponse<any>): Promise<number> {
		return (await response.json()).data.id;
	}

	async callCreateEventAPI(
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
		const registerResponse = await this.request.post(
			TestData.apiUrl + '/events',
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
