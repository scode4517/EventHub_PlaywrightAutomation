/** @format */

// /** @format */

import { expect, Page, Locator } from '@playwright/test';
import { PageManager } from './PageManager';
import { MyBookingsPage } from './MyBookingsPage';
import { EventsPage } from './EventsPage';
export class BookingDetailsPage {
	page: Page;
	myBookingsBreadCrumb: Locator;
	cancelBookingButton: Locator;
	backToBookingsButton: Locator;
	bookingRefId: Locator;
	cancelDialog: Locator;
	cancelDialogText: Locator;
	confirmCancelButton: Locator;
	cancelButtonInConfirmModel: Locator;
	canceledToast: Locator;
	bookingStatus: Locator;
	eventNameTitle: Locator;
	eventName: Locator;
	eventCategory: Locator;
	eventDate: Locator;
	eventVenue: Locator;
	eventCity: Locator;
	customerName: Locator;
	customerEmail: Locator;
	customerPhoneNumber: Locator;
	numberOfTickets: Locator;
	pricePerTicket: Locator;
	bookedOn: Locator;
	bookingId: Locator;
	totalCost: Locator;
	checkForRefundButton: Locator;
	eligibleForRefund: Locator;
	notEligibleForRefund: Locator;

	constructor(page: Page) {
		this.page = page;
		this.myBookingsBreadCrumb = this.page
			.getByRole('link', {
				name: 'My Bookings',
			})
			.nth(1);
		this.cancelBookingButton = this.page.getByRole('button', {
			name: 'Cancel Booking',
		});
		this.backToBookingsButton = this.page.getByRole('button', {
			name: '← Back to My Bookings',
		});
		this.bookingRefId = this.page.locator('span.text-indigo-600');

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
		this.canceledToast = this.page.getByText(
			'Booking cancelled successfully',
		);
		this.bookingStatus = this.page.getByText('confirmed');
		this.eventNameTitle = this.page.locator('div h1');
		this.eventName = this.page.locator('span.text-right').nth(0);
		this.eventCategory = this.page.locator('span.text-right').nth(1);
		this.eventDate = this.page.locator('span.text-right').nth(2);
		this.eventVenue = this.page.locator('span.text-right').nth(3);
		this.eventCity = this.page.locator('span.text-right').nth(4);
		this.customerName = this.page.locator('span.text-right').nth(5);
		this.customerEmail = this.page.locator('span.text-right').nth(6);
		this.customerPhoneNumber = this.page
			.locator('span.text-right')
			.nth(7);
		this.numberOfTickets = this.page.locator('span.text-right').nth(8);
		this.pricePerTicket = this.page.locator('span.text-right').nth(9);
		this.bookedOn = this.page.locator('span.text-right').nth(10);
		this.bookingId = this.page.locator('span.text-right').nth(11);
		this.totalCost = this.page.locator('.text-indigo-700');
		this.checkForRefundButton = this.page.getByRole('button', {
			name: 'Check eligibility for refund?',
		});
		this.eligibleForRefund = this.page.getByText(
			'Eligible for refund.',
		);
		this.notEligibleForRefund = this.page.getByText(
			'Not eligible for refund.',
		);
	}

	async cancelBooking() {
		const myBookingsPage = new MyBookingsPage(this.page);
		await this.page.waitForTimeout(2000);
		const bookingRefId = await this.bookingRefId.textContent();
		await this.cancelBookingButton.click();
		await expect(this.cancelDialog).toBeVisible();
		await expect(this.cancelDialogText).toHaveText(
			`Cancelling ${bookingRefId} will release 1 seat(s) back to the event. This cannot be undone.`,
		);
		await this.confirmCancelButton.click();
		await this.page.waitForTimeout(2000);
		await expect(this.canceledToast).toBeVisible();
		await myBookingsPage.isNavigatedToMyBookingsPage();
	}

	async clickOnBackToBookings() {
		const myBookingsPage = new MyBookingsPage(this.page);
		await this.backToBookingsButton.click();
		await myBookingsPage.isNavigatedToMyBookingsPage();
	}

	async clickOnMyBookingBreadCrumb() {
		const myBookingsPage = new MyBookingsPage(this.page);
		await this.backToBookingsButton.click();
		await myBookingsPage.isNavigatedToMyBookingsPage();
	}

	async verifyBookingDetails(
		eventName: string,
		eventDate: string,
		eventLocation: string,
		eventCost: string,
		numberOfTickets: number,
		todayDate: string,
		bookingRefId: string,
		email: string,
		name: string,
		phoneNumber: number,
		bookingId: string,
		totalCost: string,
		eventCategory: string,
	) {
		const lastCommaIndex = eventLocation.lastIndexOf(',');

		const location = eventLocation.slice(0, lastCommaIndex);
		const city = eventLocation.slice(lastCommaIndex + 1).trim();

		await expect(this.bookingRefId).toHaveText(bookingRefId);
		await expect(this.bookingStatus).toBeVisible();
		await expect(this.eventNameTitle).toHaveText(eventName);
		await expect(this.eventName).toHaveText(eventName);
		await expect(this.eventCategory).toHaveText(eventCategory);
		await expect(this.eventDate).toHaveText(
			await this.shortToLongDate(eventDate),
		);
		await expect(this.eventVenue).toHaveText(location);
		await expect(this.eventCity).toHaveText(city);
		await expect(this.customerName).toHaveText(name);
		await expect(this.customerEmail).toHaveText(email.toLowerCase());
		await expect(this.customerPhoneNumber).toHaveText(
			String(phoneNumber),
		);
		await expect(this.numberOfTickets).toHaveText(
			String(numberOfTickets),
		);
		await expect(this.pricePerTicket).toHaveText(eventCost);
		await expect(this.totalCost).toHaveText(totalCost);
		await expect(this.bookedOn).toHaveText(
			await this.shortToFullWeekdayDate(todayDate),
		);
		await expect(this.bookingId).toHaveText(bookingId);

		await expect(this.checkForRefundButton).toBeVisible();
	}

	async shortToLongDate(shortDate: string): Promise<string> {
		const s = shortDate.trim();
		// if already long (e.g., contains a full month name), return as-is
		if (
			/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/.test(
				s,
			)
		) {
			return s;
		}

		const year = new Date().getFullYear();
		const parsed = new Date(`${s} ${year}`);
		if (isNaN(parsed.getTime())) {
			throw new Error(`Invalid short date: "${shortDate}"`);
		}

		return new Intl.DateTimeFormat('en-GB', {
			weekday: 'long',
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		}).format(parsed);
	}

	async shortToFullWeekdayDate(shortDate: string): Promise<string> {
		const s = shortDate.trim();
		// If already long, return as-is
		if (
			/\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/.test(
				s,
			)
		) {
			return s;
		}

		const d = new Date(s);
		if (isNaN(d.getTime())) {
			throw new Error(`Invalid date: "${shortDate}"`);
		}

		return new Intl.DateTimeFormat('en-GB', {
			weekday: 'long',
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		}).format(d);
	}

	async verifyEligibleForRefundIsDisplayed() {
		await this.checkForRefundButton.click();
		await expect(this.eligibleForRefund).toBeVisible({ timeout: 5000 });
	}

	async verifyNotEligibleForRefundIsDisplayed() {
		await this.checkForRefundButton.click();
		await expect(this.notEligibleForRefund).toBeVisible({
			timeout: 5000,
		});
	}
}
