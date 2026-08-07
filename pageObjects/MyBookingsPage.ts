/** @format */

import { expect, Page, Locator } from '@playwright/test';

export class MyBookingsPage {
	page: Page;
	myBookingsPageText: Locator;

	constructor(page: Page) {
		this.page = page;
		this.myBookingsPageText = page.getByRole('heading', {
			name: 'My Bookings',
		});
	}

	async isNavigatedToMyBookingsPage() {
		await expect(this.myBookingsPageText).toBeVisible();
		await expect(this.page).toHaveURL(
			'https://eventhub.rahulshettyacademy.com/bookings',
		);
	}
}
