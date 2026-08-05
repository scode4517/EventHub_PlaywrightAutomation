/** @format */

import { expect, Page, Locator } from '@playwright/test';

export class EventsPage {
	page: Page;
	eventsPageText: Locator;

	constructor(page: Page) {
		this.page = page;
		this.eventsPageText = page.getByRole('heading', {
			name: 'Upcoming Events',
		});
	}

	async isNavigatedToEventsPage() {
		await expect(this.eventsPageText).toBeVisible();
		await expect(this.page).toHaveURL(
			'https://eventhub.rahulshettyacademy.com/events',
		);
	}
}
