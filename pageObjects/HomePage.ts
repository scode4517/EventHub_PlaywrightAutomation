/** @format */

import { expect, Page, Locator } from '@playwright/test';
import { EventsPage } from './EventsPage';
import { MyBookingsPage } from './MyBookingsPage';
import { ManageEventsPage } from './ManageEventsPage';
import { ManageBookingsPage } from './ManageBookingsPage';

export class HomePage {
	page: Page;
	browseEventsButton: Locator;
	myBookingsButton: Locator;
	homeButtonInHeader: Locator;
	eventsButtonInHeader: Locator;
	myBookingsButtonInHeader: Locator;
	adminButtonInHeader: Locator;
	manageEventsButtonInAdmin: Locator;
	manageBookingsButtonInAdmin: Locator;
	userEmailInHeader: Locator;
	logoutButton: Locator;
	logo: Locator;
	navigationBar: Locator;
	viewAllButton: Locator;
	exploreAllEventsButton: Locator;
	eventCards: Locator;
	eventName: Locator;
	eventDate: Locator;
	eventLocation: Locator;
	eventCost: Locator;
	eventSeatsLeft: Locator;
	eventBookButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.navigationBar = this.page.locator('.backdrop-blur');
		this.browseEventsButton = this.page.getByRole('link', {
			name: 'Browse Events →',
		});
		this.myBookingsButton = this.page.getByRole('button', {
			name: 'My Bookings',
		});
		this.homeButtonInHeader = this.navigationBar.getByRole('link', {
			name: 'Home',
		});
		this.eventsButtonInHeader =
			this.navigationBar.locator('#nav-events');
		this.myBookingsButtonInHeader = this.navigationBar.getByRole(
			'link',
			{
				name: 'My Bookings',
			},
		);
		this.adminButtonInHeader = this.navigationBar.getByRole('button', {
			name: 'Admin',
		});
		this.manageEventsButtonInAdmin = this.navigationBar.getByRole(
			'link',
			{
				name: 'Manage Events',
			},
		);
		this.manageBookingsButtonInAdmin = this.navigationBar.getByRole(
			'link',
			{
				name: 'Manage Bookings',
			},
		);
		this.userEmailInHeader = this.navigationBar.locator(
			'#user-email-display',
		);
		this.logoutButton = this.navigationBar.locator('#logout-btn');
		this.logo = this.navigationBar.getByText('EventHub');
		this.viewAllButton = this.page.getByRole('link', {
			name: 'View all →',
		});
		this.exploreAllEventsButton = this.page.getByRole('link', {
			name: 'Explore All Events',
		});
		this.eventCards = this.page.locator('#event-card');
		this.eventName = this.eventCards.locator('h3.leading-snug');
		this.eventDate = this.eventCards.locator('div.text-gray-500 span');
		this.eventLocation = this.eventCards.locator(
			'div.text-gray-500 span',
		);
		this.eventCost = this.eventCards.locator('p');
		this.eventSeatsLeft = this.eventCards.locator(
			'span.text-amber-600',
		);
		this.eventBookButton = this.eventCards.getByRole('link', {
			name: 'Book Now',
		});
	}

	async goto() {
		await this.page.goto('');
	}

	async isNavigatedToHomePage(email: string) {
		await expect(this.page).toHaveURL(
			'https://eventhub.rahulshettyacademy.com/',
		);
		await this.isUserLoggedIn(email);
	}

	async logout() {
		await this.logoutButton.click();
	}

	async gotoEventsPage() {
		const eventsPage = new EventsPage(this.page);
		await this.eventsButtonInHeader.click();
		await eventsPage.isNavigatedToEventsPage();
	}

	async gotoMyBookingsPage() {
		const myBookingsPage = new MyBookingsPage(this.page);
		await this.myBookingsButtonInHeader.click();
		await myBookingsPage.isNavigatedToMyBookingsPage();
	}

	async gotoManageEventsPage() {
		const manageEventsPage = new ManageEventsPage(this.page);
		await this.adminButtonInHeader.click();
		await this.manageEventsButtonInAdmin.click();
		await manageEventsPage.isNavigatedToManageEventsPage();
	}

	async gotoManageBookingsPage() {
		const manageBookingsPage = new ManageBookingsPage(this.page);
		await this.adminButtonInHeader.click();
		await this.manageBookingsButtonInAdmin.click();
		await manageBookingsPage.isNavigatedToManageBookingsPage();
	}

	async isUserLoggedIn(email: string) {
		await expect(this.userEmailInHeader).toHaveText(email);
	}

	async isUserLoggedOut() {
		await expect(this.userEmailInHeader).toHaveCount(0);
	}

	async clickOnLogo() {
		await this.logo.click();
	}

	async gotoHomePage() {
		await this.homeButtonInHeader.click();
	}

	async clickOnBrowseEventsButton() {
		const eventsPage = new EventsPage(this.page);
		await this.browseEventsButton.click();
		await eventsPage.isNavigatedToEventsPage();
	}

	async clickOnMyBookingsButton() {
		const myBookingsPage = new MyBookingsPage(this.page);
		await this.myBookingsButtonInHeader.click();
		await myBookingsPage.isNavigatedToMyBookingsPage();
	}

	async clickOnViewAllButton() {
		const eventsPage = new EventsPage(this.page);
		await this.viewAllButton.click();
		await eventsPage.isNavigatedToEventsPage();
	}

	async clickOnExploreAllEventsButton() {
		const eventsPage = new EventsPage(this.page);
		await this.exploreAllEventsButton.click();
		await eventsPage.isNavigatedToEventsPage();
	}

	async readEventDetailsAndClickOnEventCardByName(
		eventName: string,
	): Promise<string[]> {
		const numberOfEvents = await this.eventCards.count();
		console.log('Number of events: ' + numberOfEvents);
		const eventDetails: string[] = [];
		if (eventName === 'RND') {
			const index: number = Math.floor(
				Math.random() * numberOfEvents,
			);
			console.log(index);

			eventDetails.push(await this.getEventName(index));
			eventDetails.push(await this.getEventDate(index));
			eventDetails.push(await this.getEventLocation(index));
			eventDetails.push(await this.getEventCost(index));
			eventDetails.push(await this.getEventSeatsLeft(index));

			await this.clickOnEventCardByIndex(index);
		}
		return eventDetails;
	}

	async clickOnEventCardByIndex(index: number) {
		await this.eventBookButton.nth(index).click();
	}

	async getEventName(index: number): Promise<string> {
		let name = await this.eventName.nth(index).textContent();
		if (!name) {
			throw new Error(
				`No event name found for card at index ${index}`,
			);
		}
		return name;
	}

	async getEventDate(index: number): Promise<string> {
		let date = await this.eventCards
			.nth(index)
			.locator('div.text-gray-500 span')
			.first()
			.textContent();
		if (!date) {
			throw new Error(
				`No event date found for card at index ${index}`,
			);
		}
		return date;
	}

	async getEventLocation(index: number): Promise<string> {
		let location = await this.eventCards
			.nth(index)
			.locator('div.text-gray-500 span')
			.last()
			.textContent();
		if (!location) {
			throw new Error(
				`No event location found for card at index ${index}`,
			);
		}
		return location;
	}

	async getEventCost(index: number): Promise<string> {
		let cost = await this.eventCost.nth(index).textContent();
		if (!cost) {
			throw new Error(
				`No event cost found for card at index ${index}`,
			);
		}
		return cost;
	}

	async getEventSeatsLeft(index: number): Promise<string> {
		let seatsLeft = await this.eventSeatsLeft.nth(index).textContent();
		if (!seatsLeft) {
			throw new Error(
				`No event cost found for card at index ${index}`,
			);
		}
		return seatsLeft;
	}
}
