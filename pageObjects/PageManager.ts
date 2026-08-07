/** @format */

import { Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { ManageEventsPage } from './ManageEventsPage';
import { EventsPage } from './EventsPage';
import { ManageBookingsPage } from './ManageBookingsPage';
import { MyBookingsPage } from './MyBookingsPage';
import { EventBookingPage } from './EventBookingPage';

export class PageManager {
	static getHomePage(page: Page): HomePage {
		return new HomePage(page);
	}

	static getLoginPage(page: Page): LoginPage {
		return new LoginPage(page);
	}

	static getRegisterPage(page: Page): RegisterPage {
		return new RegisterPage(page);
	}

	static getManageEventsPage(page: Page): ManageEventsPage {
		return new ManageEventsPage(page);
	}

	static getEventsPage(page: Page): EventsPage {
		return new EventsPage(page);
	}

	static getManageBookingsPage(page: Page): ManageBookingsPage {
		return new ManageBookingsPage(page);
	}

	static getMyBookingsPage(page: Page): MyBookingsPage {
		return new MyBookingsPage(page);
	}

	static getEventBookingPage(page: Page): EventBookingPage {
		return new EventBookingPage(page);
	}
}
