/** @format */

import { expect, Page, Locator } from '@playwright/test';
import { EventsPage } from './EventsPage.spec';
import { MyBookingsPage } from './MyBookingsPage.spec';
import { ManageEventsPage } from './ManageEventsPage.spec';
import { ManageBookingsPage } from './ManageBookingsPage.spec';

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

	constructor(page: Page) {
		this.page = page;
		this.navigationBar = page.locator('.backdrop-blur');
		this.browseEventsButton = page.getByRole('link', {
			name: 'Browse Events →',
		});
		this.myBookingsButton = this.navigationBar.getByRole('button', {
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
}
