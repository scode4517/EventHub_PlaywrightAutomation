/** @format */

import { expect, Page, Locator } from '@playwright/test';

export class HomePage {
	page: Page;
	browseEventsButton: Locator;
	myBookingsButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.browseEventsButton = page.getByRole('link', {
			name: 'Browse Events →',
		});
		this.myBookingsButton = page.getByRole('button', {
			name: 'My Bookings',
		});
	}

	async goto() {
		await this.page.goto('');
		await this.isNavigatedToHomePage();
	}

	async isNavigatedToHomePage() {
		await expect(this.page).toHaveURL(
			'https://eventhub.rahulshettyacademy.com/',
		);
		await expect(this.browseEventsButton).toBeVisible();
		await expect(this.myBookingsButton).toBeVisible();
	}
}
