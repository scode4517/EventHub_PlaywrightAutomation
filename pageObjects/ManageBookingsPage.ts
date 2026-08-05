/** @format */

import { expect, Page, Locator } from '@playwright/test';

export class ManageBookingsPage {
	page: Page;
	manageBookingsPageText: Locator;

	constructor(page: Page) {
		this.page = page;
		this.manageBookingsPageText = page.getByRole('heading', {
			name: 'Manage Bookings',
		});
	}

	async isNavigatedToManageBookingsPage() {
		await expect(this.manageBookingsPageText).toBeVisible();
		await expect(this.page).toHaveURL(
			'https://eventhub.rahulshettyacademy.com/admin/bookings',
		);
	}
}
