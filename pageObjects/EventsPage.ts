/** @format */

import { TestData } from '../TestData/TestData';
import { expect, Page, Locator } from '@playwright/test';
import { PageManager } from './PageManager';

export class EventsPage {
	page: Page;
	eventsPageText: Locator;
	addNewEventButton: Locator;
	categoryFilter: Locator;
	eventCards: Locator;
	noEventsFoundHeading: Locator;
	noEventsFoundText: Locator;
	clearFiltersButton: Locator;
	cityFilter: Locator;
	eventSearch: Locator;

	constructor(page: Page) {
		this.page = page;
		this.eventsPageText = this.page.getByRole('heading', {
			name: 'Upcoming Events',
		});
		this.addNewEventButton = this.page.getByRole('button', {
			name: 'Add New Event',
		});
		this.categoryFilter = this.page.locator('select').first();
		this.cityFilter = this.page.locator('select').nth(1);
		this.eventCards = this.page.locator('#event-card');
		this.noEventsFoundHeading = this.page.getByRole('heading', {
			name: 'No events found',
		});
		this.noEventsFoundText = this.page.getByText(
			"Try adjusting your filters or search terms to find what you're looking for.",
		);
		this.clearFiltersButton = this.page.getByRole('button', {
			name: 'Clear filters',
		});
		this.eventSearch = this.page.getByRole('textbox', {
			name: 'Search events, venues…',
		});
	}

	async isNavigatedToEventsPage() {
		await expect(this.eventsPageText).toBeVisible();
		await expect(this.page).toHaveURL(
			'https://eventhub.rahulshettyacademy.com/events',
		);
	}

	async clickOnAddNewEventsButton() {
		const manageEvents = PageManager.getManageEventsPage(this.page);
		await this.addNewEventButton.click();
		manageEvents.isNavigatedToManageEventsPage();
	}

	async selectCategory(category: string): Promise<string> {
		if (category === 'RND') {
			category =
				TestData.categoryFilterOptions[
					Math.floor(
						Math.random() *
							TestData.categoryFilterOptions.length,
					)
				];
		}
		console.log(category);
		await this.categoryFilter.selectOption({ value: category });
		await this.page.waitForTimeout(2000);
		return category;
	}

	async verifyCategoryFilterIsApplied(category: string) {
		const filteredEventsCount: number = await this.eventCards.count();
		await expect(this.categoryFilter).toHaveValue(category);
		if (filteredEventsCount == 0) {
			await expect(this.noEventsFoundHeading).toBeVisible();
			await expect(this.noEventsFoundText).toBeVisible();
		} else {
			for (let i = 0; i < filteredEventsCount; i++) {
				const tag: Locator = this.eventCards
					.nth(i)
					.getByText(category);
				await expect(tag).toHaveText(category);
			}
		}
	}

	async verifyClearButtonClearsAllFiltersAndDisplaysAllEvents() {
		await this.page.waitForTimeout(2000);
		const eventCountBefore = await this.eventCards.count();
		await this.selectCategory('RND');
		await this.clearFiltersButton.click();
		await this.page.waitForTimeout(2000);
		const eventCountAfter = await this.eventCards.count();
		expect(eventCountAfter).toEqual(eventCountBefore);
	}

	async selectCity(city: string): Promise<string> {
		if (city === 'RND') {
			city =
				TestData.cityFilterOptions[
					Math.floor(
						Math.random() *
							TestData.cityFilterOptions.length,
					)
				];
		}
		console.log(city);
		await this.cityFilter.selectOption({ value: city });
		await this.page.waitForTimeout(2000);
		return city;
	}

	async verifyCityFilterIsApplied(city: string) {
		const filteredEventsCount: number = await this.eventCards.count();
		await expect(this.cityFilter).toHaveValue(city);
		if (filteredEventsCount == 0) {
			await expect(this.noEventsFoundHeading).toBeVisible();
			await expect(this.noEventsFoundText).toBeVisible();
		} else {
			for (let i = 0; i < filteredEventsCount; i++) {
				const tag: Locator = this.eventCards
					.nth(i)
					.getByText(new RegExp(city));
				await expect(tag).toContainText(city);
			}
		}
	}

	async searchEvent(event: string): Promise<string> {
		if (event === 'RND') {
			event =
				TestData.eventNames[
					Math.floor(
						Math.random() * TestData.eventNames.length,
					)
				];
		}
		console.log(event);
		await this.eventSearch.pressSequentially(event);
		await this.page.waitForTimeout(2000);
		return event;
	}

	async verifySearchEventFilterIsApplied(event: string) {
		const filteredEventsCount: number = await this.eventCards.count();
		await expect(this.eventSearch).toHaveValue(event);
		if (filteredEventsCount == 0) {
			await expect(this.noEventsFoundHeading).toBeVisible();
			await expect(this.noEventsFoundText).toBeVisible();
		} else {
			for (let i = 0; i < filteredEventsCount; i++) {
				const tag: Locator = this.eventCards
					.nth(i)
					.getByText(new RegExp(event));
				await expect(tag).toContainText(event);
			}
		}
	}
}
