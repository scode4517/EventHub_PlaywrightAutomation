/** @format */

import { expect, Page, Locator } from '@playwright/test';
import { EventsPage } from './EventsPage';

export class MyBookingsPage {
	page: Page;
	myBookingsPageText: Locator;
	bookingCards: Locator;
	noBookingsText: Locator;
	noBookingsSubtext: Locator;
	browseEventsButton: Locator;
	clearAllBookingsButton: Locator;
	bookingRefId: Locator;
	bookingStatus: Locator;
	bookingId: Locator;
	viewDetailsButton: Locator;
	cancelBookingButton: Locator;
	confirmCancelButton: Locator;
	cancelButtonInConfirmModel: Locator;
	cancelDialog: Locator;
	cancelDialogText: Locator;
	eventName: Locator;
	eventDate: Locator;
	seatsBooked: Locator;
	eventCity: Locator;
	bookedDate: Locator;
	totalCost: Locator;

	constructor(page: Page) {
		this.page = page;
		this.myBookingsPageText = this.page.getByRole('heading', {
			name: 'My Bookings',
		});
		this.bookingCards = this.page.locator('#booking-card');
		this.noBookingsText = this.page.getByText('No bookings yet');
		this.noBookingsSubtext = this.page.getByText(
			"You haven't booked any events yet. Browse upcoming events and grab your tickets!",
		);
		this.browseEventsButton = this.page.getByRole('button', {
			name: 'Browse Events',
		});
		this.clearAllBookingsButton = this.page.getByRole('button', {
			name: 'Clear all bookings',
		});
		this.bookingRefId = this.bookingCards
			.nth(0)
			.locator('span.booking-ref');
		this.bookingStatus = this.bookingCards
			.nth(0)
			.getByText('confirmed');
		this.bookingId = this.bookingCards.nth(0).locator('#booking-id');
		this.viewDetailsButton = this.bookingCards
			.nth(0)
			.getByRole('button', { name: 'View Details' });
		this.cancelBookingButton = this.bookingCards
			.nth(0)
			.getByRole('button', { name: 'Cancel Booking' });
		this.confirmCancelButton = this.page.getByRole('button', {
			name: 'Yes, cancel it',
		});
		this.cancelButtonInConfirmModel = this.page.getByRole('button', {
			name: 'Cancel',
		});
		this.cancelDialog = this.page.getByRole('dialog', {
			name: 'Cancel this booking?',
		});
		this.cancelDialogText =
			this.cancelDialog.locator('.leading-relaxed');
		this.eventName = this.bookingCards
			.nth(0)
			.locator('.font-semibold')
			.nth(1);
		this.eventDate = this.bookingCards
			.nth(0)
			.locator('.flex-wrap')
			.nth(1)
			.locator('span')
			.nth(0);
		this.seatsBooked = this.bookingCards
			.nth(0)
			.locator('.flex-wrap')
			.nth(1)
			.locator('span')
			.nth(1);
		this.eventCity = this.bookingCards
			.nth(0)
			.locator('.flex-wrap')
			.nth(1)
			.locator('span')
			.nth(2);
		this.bookedDate = this.bookingCards
			.nth(0)
			.locator('.flex-wrap')
			.nth(1)
			.locator('span')
			.nth(3);
		this.totalCost = this.bookingCards
			.nth(0)
			.locator('.text-indigo-700');
	}

	async isNavigatedToMyBookingsPage() {
		await expect(this.myBookingsPageText).toBeVisible();
		await expect(this.page).toHaveURL(
			'https://eventhub.rahulshettyacademy.com/bookings',
		);
	}

	async verifyNoBookingsTextIsDisplayed() {
		const bookingsCount = await this.bookingCards.count();
		if (bookingsCount != 0) await this.clearAllBookings();
		await expect(this.noBookingsText).toBeVisible();
		await expect(this.noBookingsSubtext).toBeVisible();
		await expect(this.browseEventsButton).toBeVisible();
	}

	async clickOnBrowseEventsButton() {
		const eventsPage = new EventsPage(this.page);
		await this.browseEventsButton.click();
		await eventsPage.isNavigatedToEventsPage();
	}

	async clickOnClearAllBookingsButton() {
		await this.clearAllBookingsButton.click();
	}

	async clearAllBookings() {
		await this.page.waitForTimeout(2000);
		const initialBookingsCount = await this.bookingCards.count();

		this.page.on('dialog', (dialog) => dialog.accept());
		await this.clearAllBookingsButton.click();

		await this.page.waitForTimeout(4000);
		const bookingsCountAfterClearing = await this.bookingCards.count();
		expect(initialBookingsCount).toBeGreaterThan(
			bookingsCountAfterClearing,
		);
		expect(bookingsCountAfterClearing).toEqual(0);
	}

	async cancelBooking() {
		await this.page.waitForTimeout(2000);
		const bookingRefId = await this.bookingRefId.textContent();
		const initialBookingsCount = await this.bookingCards.count();
		await this.cancelBookingButton.click();
		await expect(this.cancelDialog).toBeVisible();
		await expect(this.cancelDialogText).toHaveText(
			`This will cancel ${bookingRefId} and release 1 seat(s) back to the event. This action cannot be undone.`,
		);
		await this.confirmCancelButton.click();
		await this.page.waitForTimeout(2000);
		const bookingsCountAfterClearing = await this.bookingCards.count();

		expect(bookingsCountAfterClearing).toEqual(
			initialBookingsCount - 1,
		);
	}

	async viewBooking() {
		const bookingId = await this.bookingId.textContent();
		await this.viewDetailsButton.click();
		await expect(this.page).toHaveURL(
			`https://eventhub.rahulshettyacademy.com/bookings/${bookingId?.replace('#', '')}`,
		);
	}

	async getEventBookingId(): Promise<string> {
		const bookingId = await this.bookingId.textContent();
		return bookingId ? bookingId.trim() : '';
	}

	async verifyBookingDetails(
		eventName: string,
		eventDate: string,
		eventLocation: string,
		eventCost: string,
		seatsBooked: number,
		todayDate: string,
		bookingRefId: string,
	) {
		await expect(this.bookingStatus).toHaveText('confirmed');
		await expect(this.eventName).toHaveText(eventName);
		await expect(this.eventCity).toContainText(
			eventLocation
				.slice(eventLocation.lastIndexOf(',') + 1)
				.trim(),
		);
		const normalizedEventDate = this.normalizeEventDate(eventDate);
		await expect(this.eventDate).toContainText(normalizedEventDate);
		await expect(this.totalCost).toContainText(eventCost);
		await expect(this.seatsBooked).toContainText(
			`${seatsBooked} ticket`,
		);
		await expect(this.bookedDate).toContainText(`Booked ${todayDate}`);
		await expect(this.bookingRefId).toContainText(bookingRefId);
	}

	private normalizeEventDate(eventDate: string) {
		const cleaned = eventDate.replace(/^[A-Za-z]+,\s*/, '').trim();
		if (/\d{4}$/.test(cleaned)) {
			return cleaned;
		}
		return `${cleaned} ${new Date().getFullYear()}`;
	}
}
