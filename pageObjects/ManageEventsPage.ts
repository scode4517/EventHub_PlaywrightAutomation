/** @format */

import { expect, Page, Locator } from '@playwright/test';

export class ManageEventsPage {
	page: Page;
	newEventsText: Locator;
	newEventsForm: Locator;
	newEventTitleInput: Locator;
	titleErrorText: Locator;
	newEventDescriptionInput: Locator;
	newEventCategoryDropdown: Locator;
	newEventCityInput: Locator;
	cityErrorText: Locator;
	newEventVenueInput: Locator;
	venueErrorText: Locator;
	newEventDateTimeInput: Locator;
	dateTimeErrorText: Locator;
	newEventPriceInput: Locator;
	priceErrorText: Locator;
	newEventSeatsInput: Locator;
	seatsErrorText: Locator;
	newEventImageInput: Locator;
	newEventFormSubmitButton: Locator;
	eventTableRows: Locator;
	eventCreationToast: Locator;
	editEventButton: Locator;
	deleteEventButton: Locator;
	deleteEventDialog: Locator;
	deleteEventButtonInDialog: Locator;
	eventDeletedToast: Locator;
	updateEventButton: Locator;
	eventUpdatedToast: Locator;

	constructor(page: Page) {
		this.page = page;
		this.newEventsText = this.page.getByRole('heading', {
			name: '+ New Event',
		});
		this.newEventsForm = this.page.locator('section').nth(0);
		this.newEventTitleInput = this.page.getByRole('textbox', {
			name: 'Title*',
		});
		this.titleErrorText = this.page.getByText('Title is required');
		this.newEventDescriptionInput = this.page.getByRole('textbox', {
			name: 'Describe the event…',
		});
		this.newEventCategoryDropdown = this.page.getByRole('combobox', {
			name: 'Category*',
		});
		this.newEventCityInput = this.page.getByRole('textbox', {
			name: 'City*',
		});
		this.cityErrorText = this.page.getByText('City is required');
		this.newEventVenueInput = this.page.getByRole('textbox', {
			name: 'Venue*',
		});
		this.venueErrorText = this.page.getByText('Venue is required');
		this.newEventDateTimeInput = this.page.locator(
			'[id="event-date-&-time"]',
		);
		this.dateTimeErrorText = this.page.getByText(
			'Event date is required',
		);
		this.newEventPriceInput = this.page.getByRole('spinbutton', {
			name: 'Price ($)*',
		});
		this.priceErrorText = this.page.getByText(
			'Enter a valid price (≥ 0)',
		);
		this.newEventSeatsInput = this.page.getByRole('spinbutton', {
			name: 'Total Seats*',
		});
		this.seatsErrorText = this.page.getByText(
			'Must have at least 1 seat',
		);
		this.newEventImageInput = this.page.getByRole('textbox', {
			name: 'Image URL (optional)',
		});
		this.newEventFormSubmitButton = this.page.getByRole('button', {
			name: '+ Add Event',
		});
		this.eventTableRows = this.page.getByTestId('event-table-row');
		this.eventCreationToast = this.page.getByText('Event created!');
		this.deleteEventButton = this.page.getByRole('button', {
			name: 'Delete',
		});
		this.editEventButton = this.page.getByRole('button', {
			name: 'Edit',
		});
		this.deleteEventDialog = this.page.getByRole('dialog', {
			name: 'Delete this event?',
		});
		this.deleteEventButtonInDialog = this.page.getByRole('button', {
			name: 'Delete event',
		});
		this.eventDeletedToast = this.page.getByText('Event deleted');
		this.updateEventButton = this.page.getByRole('button', {
			name: '💾 Update Event',
		});
		this.eventUpdatedToast = this.page.getByText('Event updated!');
	}

	async isNavigatedToManageEventsPage() {
		await expect(this.newEventsText).toBeVisible();
		await expect(this.page).toHaveURL(
			'https://eventhub.rahulshettyacademy.com/admin/events',
		);
	}

	async manageEventsPageFormVisualTest() {
		await expect(this.newEventsForm).toHaveScreenshot(
			'new-event-form.png',
			{
				threshold: 0.15,
			},
		);
	}

	async createNewEvent(
		title?: string,
		description?: string,
		category?: string,
		city?: string,
		venue?: string,
		dateTime?: string,
		seats?: string,
		price?: string,
		imageUrl?: string,
	) {
		const initialRowCount: number = await this.eventTableRows.count();
		if (title) {
			await this.newEventTitleInput.fill(title);
		}
		if (description) {
			await this.newEventDescriptionInput.fill(description);
		}
		if (category) {
			await this.newEventCategoryDropdown.selectOption(category);
		}
		if (city) {
			await this.newEventCityInput.fill(city);
		}
		if (venue) {
			await this.newEventVenueInput.fill(venue);
		}
		if (dateTime) {
			await this.newEventDateTimeInput.fill(dateTime);
		}
		if (seats) {
			await this.newEventSeatsInput.fill(seats);
		}
		if (price) {
			await this.newEventPriceInput.fill(price);
		}
		if (imageUrl) {
			await this.newEventImageInput.fill(imageUrl);
		}
		await this.newEventFormSubmitButton.click();

		await expect(this.eventCreationToast).toBeVisible();
		await expect(this.eventCreationToast).toHaveScreenshot(
			'event-creation-toast.png',
			{
				threshold: 0.15,
			},
		);
		const finalRowCount: number = await this.eventTableRows.count();
		expect(finalRowCount).toBeGreaterThan(initialRowCount);
	}

	async verifyThatAllErrorsAreDisplayed() {
		await expect(this.titleErrorText).toBeVisible();
		await expect(this.cityErrorText).toBeVisible();
		await expect(this.venueErrorText).toBeVisible();
		await expect(this.dateTimeErrorText).toBeVisible();
		await expect(this.priceErrorText).toBeVisible();
		await expect(this.seatsErrorText).toBeVisible();
	}

	async deleteEvent(title?: string) {
		const initialRowCount: number = await this.eventTableRows.count();
		if (!title) {
			const lastEventRow = this.eventTableRows.last();
			await lastEventRow
				.getByRole('button', {
					name: 'Delete',
				})
				.click();
		} else {
			const eventRow = this.eventTableRows.filter({
				hasText: title,
			});
			await eventRow
				.getByRole('button', {
					name: 'Delete',
				})
				.click();
		}
		await expect(this.deleteEventDialog).toBeVisible();
		await expect(this.deleteEventDialog).toHaveScreenshot(
			'delete-event-dialog.png',
			{
				threshold: 0.15,
			},
		);
		await this.deleteEventButtonInDialog.click();
		await expect(this.eventDeletedToast).toBeVisible();
		await expect(this.eventDeletedToast).toHaveScreenshot(
			'event-deleted-toast.png',
			{
				threshold: 0.15,
			},
		);
		const finalRowCount: number = await this.eventTableRows.count();
		expect(finalRowCount).toBeLessThan(initialRowCount);
	}

	async verifyEventDetails(
		title: string,
		category: string,
		city: string,
		dateTime: string,
		price: string,
	) {
		const eventRow = this.eventTableRows.filter({
			hasText: title,
		});
		await expect(eventRow).toBeVisible();
		await expect(eventRow).toContainText(category);
		await expect(eventRow).toContainText(city);
		const [year, month, day] = dateTime.slice(0, 10).split('-');

		const formattedDate = new Intl.DateTimeFormat('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}).format(new Date(Number(year), Number(month) - 1, Number(day)));

		await expect(eventRow).toContainText(formattedDate);

		const formattedPrice = `$${Number(price).toLocaleString('en-US')}`;
		await expect(eventRow).toContainText(formattedPrice);
	}

	async editEvent(
		title: string,
		description: string,
		category: string,
		city: string,
		venue: string,
		dateTime: string,
		seats: string,
		price: string,
		imageUrl: string,
		newTitle: string,
		newDescription: string,
		newCategory: string,
		newCity: string,
		newVenue: string,
		newDateTime: string,
		newSeats: string,
		newPrice: string,
		newImageUrl: string,
	) {
		const eventRow = this.eventTableRows.filter({
			hasText: title,
		});
		await eventRow.getByRole('button', { name: 'Edit' }).click();

		const currentTitle = await this.newEventTitleInput.inputValue();
		const currentDescription =
			await this.newEventDescriptionInput.inputValue();
		const currentCategory =
			await this.newEventCategoryDropdown.inputValue();
		const currentCity = await this.newEventCityInput.inputValue();
		const currentVenue = await this.newEventVenueInput.inputValue();
		const currentDateTime =
			await this.newEventDateTimeInput.inputValue();
		const currentSeats = await this.newEventSeatsInput.inputValue();
		const currentPrice = await this.newEventPriceInput.inputValue();
		const currentImageUrl = await this.newEventImageInput.inputValue();

		expect(currentTitle).toBe(title);
		expect(currentDescription).toBe(description);
		expect(currentCategory).toBe(category);
		expect(currentCity).toBe(city);
		expect(currentVenue).toBe(venue);
		expect(currentDateTime).toBe(dateTime);
		expect(currentSeats).toBe(seats);
		expect(currentPrice).toBe(price);
		expect(currentImageUrl).toBe(imageUrl);

		const initialRowCount: number = await this.eventTableRows.count();
		if (newTitle) {
			await this.newEventTitleInput.fill(newTitle);
		}
		if (newDescription) {
			await this.newEventDescriptionInput.fill(newDescription);
		}
		if (newCategory) {
			await this.newEventCategoryDropdown.selectOption(newCategory);
		}
		if (newCity) {
			await this.newEventCityInput.fill(newCity);
		}
		if (newVenue) {
			await this.newEventVenueInput.fill(newVenue);
		}
		if (newDateTime) {
			await this.newEventDateTimeInput.fill(newDateTime);
		}
		if (newSeats) {
			await this.newEventSeatsInput.fill(newSeats);
		}
		if (newPrice) {
			await this.newEventPriceInput.fill(newPrice);
		}
		if (newImageUrl) {
			await this.newEventImageInput.fill(newImageUrl);
		}
		await this.updateEventButton.click();

		await expect(this.eventUpdatedToast).toBeVisible();
		await expect(this.eventUpdatedToast).toHaveScreenshot(
			'event-updated-toast.png',
			{
				threshold: 0.15,
			},
		);
		const finalRowCount: number = await this.eventTableRows.count();
		expect(finalRowCount).toBe(initialRowCount);
	}
}
