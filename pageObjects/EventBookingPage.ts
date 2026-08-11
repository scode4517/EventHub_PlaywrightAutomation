/** @format */

// /** @format */

import { expect, Page, Locator } from '@playwright/test';
import { PageManager } from './PageManager';
import { MyBookingsPage } from './MyBookingsPage';
import { EventsPage } from './EventsPage';
export class EventBookingPage {
	page: Page;
	eventName: Locator;
	eventDate: Locator;
	eventTime: Locator;
	eventLocation: Locator;
	eventCity: Locator;
	eventCost: Locator;
	eventSeatsLeft: Locator;
	breadCrumbLink: Locator;
	tags: Locator;
	featuredText: Locator;
	totalCost: Locator;
	ticketCount: Locator;
	minusButton: Locator;
	plusButton: Locator;
	nameInput: Locator;
	emailInput: Locator;
	phoneNumberInput: Locator;
	confirmBookingButton: Locator;
	bookingConfirmedText: Locator;
	bookingReferenceId: Locator;
	bookingCustomerName: Locator;
	ticketsBooked: Locator;
	bookingCost: Locator;
	nameError: Locator;
	emailError: Locator;
	phoneNumberError: Locator;
	viewMyBookingsButton: Locator;
	browseMoreEventsButton: Locator;

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
		this.breadCrumbLink = this.page
			.getByRole('link', {
				name: 'Events',
			})
			.first();
		this.tags = this.page.locator('span.rounded-full');
		this.featuredText = this.page.getByText(
			'This is a featured event — always available for practice',
		);
		this.totalCost = this.page
			.locator('.border-indigo-200 span')
			.nth(1);
		this.ticketCount = this.page.locator('#ticket-count');
		this.minusButton = this.page.getByRole('button', { name: '−' });
		this.plusButton = this.page.getByRole('button', { name: '+' });
		this.nameInput = this.page.getByRole('textbox', {
			name: 'Full Name*',
		});
		this.emailInput = this.page.getByRole('textbox', {
			name: 'Email*',
		});
		this.phoneNumberInput = this.page.getByRole('textbox', {
			name: 'Phone Number*',
		});
		this.confirmBookingButton = this.page.getByRole('button', {
			name: 'Confirm Booking',
		});
		this.bookingConfirmedText = this.page.getByRole('heading', {
			name: 'Booking Confirmed! 🎉',
		});
		this.bookingReferenceId = this.page
			.locator('div.bg-indigo-50 span')
			.nth(2);
		this.bookingCustomerName = this.page
			.locator('div.bg-indigo-50 span')
			.nth(4);
		this.ticketsBooked = this.page
			.locator('div.bg-indigo-50 span')
			.nth(6);
		this.bookingCost = this.page
			.locator('div.bg-indigo-50 span')
			.nth(8);
		this.nameError = this.page.getByText(
			'Name must be at least 2 chars',
		);
		this.emailError = this.page.getByText('Enter a valid email');
		this.phoneNumberError = this.page.getByText(
			'Enter a valid 10-digit phone',
		);
		this.viewMyBookingsButton = this.page.getByRole('button', {
			name: 'View My Bookings',
		});
		this.browseMoreEventsButton = this.page.getByRole('button', {
			name: 'Browse More Events',
		});
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

	async clickOnEventsBreadCrumb() {
		await this.breadCrumbLink.click();
		await PageManager.getEventsPage(
			this.page,
		).isNavigatedToEventsPage();
	}

	async verifyFeaturedTextForFeaturedEvents() {
		const tagsCount = await this.tags.count();
		if (tagsCount === 2) await expect(this.featuredText).toBeVisible();
		else await expect(this.featuredText).toBeHidden();
	}

	async verifyTotalIs(total: number) {
		const formattedTotal = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
		}).format(total);

		await expect(this.totalCost).toHaveText(formattedTotal);
	}

	async changeTicketCountTo(count: number) {
		const initialCount: number = Number(
			await this.ticketCount.textContent(),
		);
		const difference = initialCount - count;
		if (difference == 0) return;
		else if (difference > 0)
			for (let i = 0; i < difference; i++)
				await this.minusButton.click();
		else
			for (let i = difference; i < 0; i++)
				await this.plusButton.click();
	}

	async bookEvent(email: string, name: string, phoneNumber: string) {
		await this.nameInput.pressSequentially(email);
		await this.emailInput.pressSequentially(name);
		await this.phoneNumberInput.pressSequentially(phoneNumber);
		await this.confirmBookingButton.click();
	}

	async verifyBooking(
		name: string,
		ticketCount: number,
		finalTotal: number,
	) {
		const formattedTotal = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
		}).format(finalTotal);
		await expect(this.bookingConfirmedText).toBeVisible();
		await expect(this.bookingCustomerName).toHaveText(name);
		await expect(this.bookingCost).toHaveText(formattedTotal);
		await expect(this.ticketsBooked).toHaveText(String(ticketCount));
	}

	async verifyErrorsAreDisplayed() {
		await expect(this.nameError).toBeVisible();
		await expect(this.emailError).toBeVisible();
		await expect(this.phoneNumberError).toBeVisible();
	}

	async clickOnViewMyBookingsButton() {
		const myBookingsPage = new MyBookingsPage(this.page);
		await this.viewMyBookingsButton.click();
		await myBookingsPage.isNavigatedToMyBookingsPage();
	}

	async clickOnBrowseMoreEventsButton() {
		const eventsPage = new EventsPage(this.page);
		await this.browseMoreEventsButton.click();
		await eventsPage.isNavigatedToEventsPage();
	}
}
