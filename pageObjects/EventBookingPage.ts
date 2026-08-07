/** @format */

import { expect, Page, Locator } from '@playwright/test';
import { EventsPage } from './EventsPage';
import { MyBookingsPage } from './MyBookingsPage';
import { ManageEventsPage } from './ManageEventsPage';
import { ManageBookingsPage } from './ManageBookingsPage';

export class EventBookingPage {
	page: Page;
	eventName: Locator;
	eventDate: Locator;
	eventTime: Locator;
	eventLocation: Locator;
	eventCity: Locator;
	eventCost: Locator;
	eventSeatsLeft: Locator;

	constructor(page: Page) {
		this.page = page;
		this.eventName = this.page.locator('h1.font-bold');
		this.eventDate = this.page
			.locator('div.mb-6 div.flex div p')
			.nth(1);
		this.eventTime = this.page
			.locator('div.mb-6 div.flex div p')
			.nth(3);
		this.eventLocation = this.page
			.locator('div.mb-6 div.flex div p')
			.nth(5);
		this.eventCity = this.page
			.locator('div.mb-6 div.flex div p')
			.nth(7);
		this.eventSeatsLeft = this.page
			.locator('div.mb-6 div.flex div p')
			.nth(9);
		this.eventCost = this.page
			.locator('div.mb-6 div.flex div p')
			.nth(11);
	}

	async isNavigatedToEventBookingPage(
		eventName: string,
		eventDate: string,
		eventLocation: string,
		eventCost: string,
		eventSeatsLeft: string,
	) {
		await expect(this.eventName).toHaveText(eventName);

		const lastCommaIndex = eventLocation.lastIndexOf(',');

		const location = eventLocation.slice(0, lastCommaIndex);
		const city = eventLocation.slice(lastCommaIndex + 1).trim();
		eventSeatsLeft = eventSeatsLeft.split(' ')[0];

		const year = new Date().getFullYear();

		const date = new Date(`${eventDate} ${year}`);

		const parts = new Intl.DateTimeFormat('en-GB', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
		}).formatToParts(date);

		const weekdayPart = parts.find((p) => p.type === 'weekday');
		const dayPart = parts.find((p) => p.type === 'day');
		const monthPart = parts.find((p) => p.type === 'month');

		if (!weekdayPart || !dayPart || !monthPart) {
			throw new Error('Unable to format event date');
		}

		const weekday = weekdayPart.value;
		const day = dayPart.value;
		const month = monthPart.value;

		const formattedDate = `${weekday}, ${day} ${month}`;

		await expect(this.eventDate).toHaveText(formattedDate);
		await expect(this.eventLocation).toHaveText(location);
		await expect(this.eventCity).toHaveText(city);
		await expect(this.eventCost).toHaveText(eventCost);
		await expect(this.eventSeatsLeft).toContainText(eventSeatsLeft);
	}
}
