/** @format */

import { expect, Page, Locator } from '@playwright/test';

export class ManageEventsPage {
    page: Page;
    newEventsText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newEventsText = this.page.getByRole('heading', {
			name: '+ New Event',
		});
    }

    async isNavigatedToManageEventsPage() {
        await expect(this.newEventsText).toBeVisible();
        await expect(this.page).toHaveURL(
			'https://eventhub.rahulshettyacademy.com/admin/events',
		);
    }
}
