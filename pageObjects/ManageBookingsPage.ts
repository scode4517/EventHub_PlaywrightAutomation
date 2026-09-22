/** @format */

import { expect, Page, Locator } from '@playwright/test';

export class ManageBookingsPage {
	page: Page;
	manageBookingsPageText: Locator;
	bookingRows: Locator;
	cancelBookingButton: Locator;
	viewBookingButton: Locator;
	cancelModal: Locator;
	cancelButtonInModal: Locator;
	bookingCanceledToast: Locator;
	modalCloseButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.manageBookingsPageText = this.page.getByRole('heading', {
			name: 'Manage Bookings',
		});
		this.bookingRows = this.page.locator('tbody tr');
		this.cancelBookingButton = this.page.getByRole('button', {
			name: 'Cancel',
		});
		this.cancelModal = this.page.getByRole('dialog', {
			name: 'Cancel this booking?',
		});
		this.cancelButtonInModal = this.page.getByRole('button', {
			name: 'Yes, cancel it',
		});
		this.bookingCanceledToast =
			this.page.getByText('Booking Cancelled');
		this.viewBookingButton = this.page.getByRole('button', {
			name: 'View',
		});
		this.modalCloseButton = this.page.getByRole('button', {
			name: 'Close',
		});
	}

	async isNavigatedToManageBookingsPage() {
		await expect(this.manageBookingsPageText).toBeVisible();
		await expect(this.page).toHaveURL(
			'https://eventhub.rahulshettyacademy.com/admin/bookings',
		);
	}

	async manageBookingsPageFormVisualTest() {
		await expect(this.page).toHaveScreenshot('no-bookings.png', {
			threshold: 0.15,
		});
	}

	async cancelBooking(bookingRefId?: string) {
		const initialRowCount = await this.bookingRows.count();
		const bookingRow = this.bookingRows.filter({
			hasText: bookingRefId,
		});

		await bookingRow.locator(this.cancelBookingButton).click();
		await expect(this.cancelModal).toBeVisible();
		// await expect(this.cancelModal).toHaveScreenshot(
		// 	'cancel-booking-modal.png',
		// 	{
		// 		threshold: 0.15,
		// 	},
		// );

		await this.cancelButtonInModal.click();
		await this.page.waitForTimeout(2000);
		const finalRowCount = await this.bookingRows.count();
		expect(finalRowCount).toBeLessThan(initialRowCount);

		await expect(this.bookingCanceledToast).toBeVisible();
	}

	async verifyBookingDetails(
		bookingRefId: string,
		name: string,
		email: string,
		eventName: string,
		seats: number,
		eventCost: string,
		status: string,
		bookingDate: string,
	) {
		const bookingRow = this.bookingRows.filter({
			hasText: bookingRefId,
		});

		expect(bookingRow).toContainText(bookingRefId);
		expect(bookingRow).toContainText(name);
		expect(bookingRow).toContainText(email.toLocaleLowerCase());
		expect(bookingRow).toContainText(eventName);
		expect(bookingRow).toContainText(seats + '');
		expect(bookingRow).toContainText(eventCost);
		expect(bookingRow).toContainText(status);
		expect(bookingRow).toContainText(bookingDate);
	}

	async viewAndVerifyBookingDetails(
		bookingRefId: string,
		name: string,
		email: string,
		phone: string,
		eventName: string,
		seats: number,
		eventCost: string,
		status: string,
		bookingDate: string,
		eventDate: string,
		eventLocation: string,
	) {
		const bookingRow = this.bookingRows.filter({
			hasText: bookingRefId,
		});

		const modalName = 'Booking — ' + bookingRefId;

		await bookingRow.locator(this.viewBookingButton).click();
		const viewModal: Locator = this.page.getByRole('dialog', {
			name: modalName,
		});

		const normalizedEventDate = this.normalizeEventDate(eventDate);

		expect(viewModal).toContainText(bookingRefId);
		expect(viewModal).toContainText(name);
		expect(viewModal).toContainText(email.toLocaleLowerCase());
		expect(viewModal).toContainText(phone);
		expect(viewModal).toContainText(eventName);
		expect(viewModal).toContainText(seats + '');
		expect(viewModal).toContainText(eventCost);
		expect(viewModal).toContainText(status);
		expect(viewModal).toContainText(bookingDate);
		// expect(viewModal).toContainText(normalizedEventDate);
		expect(viewModal).toContainText(
			eventLocation
				.slice(eventLocation.lastIndexOf(',') + 1)
				.trim(),
		);

		await this.modalCloseButton.click();
	}

	private normalizeEventDate(eventDate: string) {
		const cleaned = eventDate.replace(/^[A-Za-z]+,\s*/, '').trim();
		if (/\d{4}$/.test(cleaned)) {
			return cleaned;
		}
		return `${cleaned} ${new Date().getFullYear()}`;
	}
}
