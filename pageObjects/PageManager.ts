/** @format */

import { Page } from '@playwright/test';
import { HomePage } from './HomePage.spec';
import { LoginPage } from './LoginPage.spec';
import { RegisterPage } from './RegisterPage.spec';
import { ManageEventsPage } from './ManageEventsPage.spec';
import { EventsPage } from './EventsPage.spec';
import { ManageBookingsPage } from './ManageBookingsPage.spec';
import { MyBookingsPage } from './MyBookingsPage.spec';

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
}
