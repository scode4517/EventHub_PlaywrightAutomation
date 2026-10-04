/** @format */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestData } from '../TestData/TestData';

export class CreateBookingsAPI {
	request: APIRequestContext;

	constructor(request: APIRequestContext) {
		this.request = request;
	}

	async createBooking(
		token: string,
		eventId: number,
		customerName: string,
		customerEmail: string,
		customerPhone: string,
		quantity: number,
	): Promise<APIResponse<any>> {
		const response = await this.callCreateBookingAPI(
			token,
			eventId,
			customerName,
			customerEmail,
			customerPhone,
			quantity,
		);
		return response;
	}

	async getBookingId(response: APIResponse<any>): Promise<number> {
		return (await response.json()).data.id;
	}

	async getBookingRefId(response: APIResponse<any>): Promise<string> {
		return (await response.json()).data.bookingRef;
	}

	async callCreateBookingAPI(
		token: string,
		eventId: number,
		customerName: string,
		customerEmail: string,
		customerPhone: string,
		quantity: number,
	): Promise<APIResponse<any>> {
		const event = {
			eventId: eventId,
			customerName: customerName,
			customerEmail: customerEmail,
			customerPhone: customerPhone,
			quantity: quantity,
		};
		const registerResponse = await this.request.post(
			TestData.apiUrl + '/bookings',
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
