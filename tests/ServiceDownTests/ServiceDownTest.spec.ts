/** @format */

import { test, expect } from '@playwright/test';
import { TestData } from '../../TestData/TestData';
import { RegisterAPI } from '../../api-methods/RegisterAPI';
import { PageManager } from '../../pageObjects/PageManager';
import { faker } from '@faker-js/faker';
import { RegisterPage } from '../../pageObjects/RegisterPage';
import { HomePage } from '../../pageObjects/HomePage';
import { LoginPage } from '../../pageObjects/LoginPage';
import { LoginAPI } from '../../api-methods/LoginAPI';
import { CreateEventAPI } from '../../api-methods/CreateEventAPI';
import { GetEventListAPI } from '../../api-methods/GetEventsListAPI';
import { GetEventByIdAPI } from '../../api-methods/GetEventByIdAPI';
import { UpdateEventAPI } from '../../api-methods/UpdateEventAPI';
import { CreateBookingsAPI } from '../../api-methods/CreateBookingsAPI';
import { GetBookingByRefIdAPI } from '../../api-methods/GetBookingByRefIdAPI';
import { EventsPage } from '../../pageObjects/EventsPage';
import { EventBookingPage } from '../../pageObjects/EventBookingPage';
import { MyBookingsPage } from '../../pageObjects/MyBookingsPage';
import { BookingDetailsPage } from '../../pageObjects/BookingDetailsPage';

test(
	'Login when login api is down',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);

		await page.route('**/auth/login', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					error: 'Internal Server Error',
				}),
			});
		});
		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await loginPage.isInternalServerErrorDisplayed();
	},
);

test(
	'Login when there is network error',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);

		await page.route('**/auth/login', async (route) => {
			await route.abort('failed');
		});

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await loginPage.isNetworkErrorDisplayed();
	},
);

test(
	'Register when there is network error',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);

		await page.route('**/auth/register', async (route) => {
			await route.abort('failed');
		});

		const registerPage: RegisterPage =
			PageManager.getRegisterPage(page);
		await registerPage.goto();

		const email: string = faker.internet.email();
		const password: string = faker.internet.password({
			length: 12,
			memorable: false,
			pattern: /[A-Za-z0-9!@#$%^&*]/,
			prefix: 'Aa1!',
		});
		await registerPage.register(email, password, password);
		await loginPage.isNetworkErrorDisplayed();
	},
);

test(
	'Register when service is down',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);

		await page.route('**/auth/register', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					error: 'Internal Server Error',
				}),
			});
		});

		const registerPage: RegisterPage =
			PageManager.getRegisterPage(page);
		await registerPage.goto();

		const email: string = faker.internet.email();
		const password: string = faker.internet.password({
			length: 12,
			memorable: false,
			pattern: /[A-Za-z0-9!@#$%^&*]/,
			prefix: 'Aa1!',
		});
		await registerPage.register(email, password, password);
		await loginPage.isInternalServerErrorDisplayed();
	},
);

test(
	'Get events in home page when there is network error',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);

		await page.route('**/events**', async (route) => {
			await route.abort('failed');
		});

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);
		await page.waitForTimeout(1000);
		expect(await homePage.getEventsCount()).toBe(0);
	},
);

test(
	'Get events in home page when service is down',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);

		await page.route('**/events**', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					success: false,
					error: 'Resource not found',
				}),
			});
		});

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);
		await page.waitForTimeout(1000);
		expect(await homePage.getEventsCount()).toBe(0);
	},
);

test(
	'Get events in events page when there is network error',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);

		await page.route('**/events?page=1&limit=12', async (route) => {
			await route.abort('failed');
		});

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);
		await homePage.gotoEventsPage();
		await page.waitForTimeout(1000);
		expect(await homePage.getEventsCount()).toBe(0);
	},
);

test(
	'Get events in events page when service is down',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);

		await page.route('**/events?page=1&limit=12', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					success: false,
					error: 'Resource not found',
				}),
			});
		});

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);
		await homePage.gotoEventsPage();
		await page.waitForTimeout(1000);
		expect(await homePage.getEventsCount()).toBe(0);
	},
);

test(
	'Get event when there is network error',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		const eventBookingPage: EventBookingPage =
			PageManager.getEventBookingPage(page);

		await page.route('**/api/events/**', async (route) => {
			await route.abort('failed');
		});

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);
		await homePage.readEventDetailsAndClickOnEventCardByName(
			'Dilli Diwali Mela',
		);

		await page.waitForTimeout(1000);
		await eventBookingPage.verifyEventNotFoundIsDisplayed();
	},
);

test(
	'Get event when service is down',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		const eventBookingPage: EventBookingPage =
			PageManager.getEventBookingPage(page);

		await page.route('**/api/events/**', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					success: false,
					error: 'Resource not found',
				}),
			});
		});

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);
		await homePage.readEventDetailsAndClickOnEventCardByName(
			'Dilli Diwali Mela',
		);

		await page.waitForTimeout(1000);
		await eventBookingPage.verifyEventNotFoundIsDisplayed();
	},
);

test(
	'Create event when there is network error',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);

		await page.route('**/api/events**', async (route) => {
			await route.abort('failed');
		});

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date
			.future()
			.toISOString()
			.slice(0, 16);
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);

		await homePage.gotoManageEventsPage();
		const manageEventsPage = PageManager.getManageEventsPage(page);

		await manageEventsPage.createNewEvent(
			title,
			description,
			category,
			city,
			venue,
			dateTime,
			seats.toString(),
			price.toString(),
			imageUrl,
		);
		await loginPage.isNetworkErrorDisplayed();

		await manageEventsPage.verifyNoEventsTextIsDisplayed();
	},
);

test(
	'Create event when service is down',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);

		await page.route('**/api/events**', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					success: false,
					error: 'Resource not found',
				}),
			});
		});

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date
			.future()
			.toISOString()
			.slice(0, 16);
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);

		await homePage.gotoManageEventsPage();
		const manageEventsPage = PageManager.getManageEventsPage(page);

		await manageEventsPage.createNewEvent(
			title,
			description,
			category,
			city,
			venue,
			dateTime,
			seats.toString(),
			price.toString(),
			imageUrl,
		);

		await loginPage.isResourceNotFoundErrorDisplayed();
		await manageEventsPage.verifyNoEventsTextIsDisplayed();
	},
);

test(
	'Update event when there is network error',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date
			.future()
			.toISOString()
			.slice(0, 16);
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);

		await homePage.gotoManageEventsPage();
		const manageEventsPage = PageManager.getManageEventsPage(page);

		await manageEventsPage.createNewEvent(
			title,
			description,
			category,
			city,
			venue,
			dateTime,
			seats.toString(),
			price.toString(),
			imageUrl,
		);

		await page.route('**/api/events/**', async (route) => {
			await route.abort('failed');
		});

		const newTitle = faker.word.noun();
		const newDescription = faker.lorem.paragraph();
		const newCategory = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const newCity = faker.location.city();
		const newVenue = faker.location.streetAddress();
		const newDateTime = faker.date.future().toISOString().slice(0, 16);
		const newSeats = faker.number.int({ min: 1, max: 1000 }).toString();
		const newPrice = faker.number.int({ min: 1, max: 1000 }).toString();
		const newImageUrl = faker.image.url();

		await manageEventsPage.editEvent(
			title,
			description,
			category,
			city,
			venue,
			dateTime,
			seats.toString(),
			price.toString(),
			imageUrl,
			newTitle,
			newDescription,
			newCategory,
			newCity,
			newVenue,
			newDateTime,
			newSeats,
			newPrice,
			newImageUrl,
		);

		await loginPage.isNetworkErrorDisplayed();
	},
);

test(
	'Update event when service is down',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date
			.future()
			.toISOString()
			.slice(0, 16);
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);

		await homePage.gotoManageEventsPage();
		const manageEventsPage = PageManager.getManageEventsPage(page);

		await manageEventsPage.createNewEvent(
			title,
			description,
			category,
			city,
			venue,
			dateTime,
			seats.toString(),
			price.toString(),
			imageUrl,
		);

		await page.route('**/api/events/**', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					success: false,
					error: 'Resource not found',
				}),
			});
		});

		const newTitle = faker.word.noun();
		const newDescription = faker.lorem.paragraph();
		const newCategory = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const newCity = faker.location.city();
		const newVenue = faker.location.streetAddress();
		const newDateTime = faker.date.future().toISOString().slice(0, 16);
		const newSeats = faker.number.int({ min: 1, max: 1000 }).toString();
		const newPrice = faker.number.int({ min: 1, max: 1000 }).toString();
		const newImageUrl = faker.image.url();

		await manageEventsPage.editEvent(
			title,
			description,
			category,
			city,
			venue,
			dateTime,
			seats.toString(),
			price.toString(),
			imageUrl,
			newTitle,
			newDescription,
			newCategory,
			newCity,
			newVenue,
			newDateTime,
			newSeats,
			newPrice,
			newImageUrl,
		);

		await loginPage.isResourceNotFoundErrorDisplayed();
	},
);

test(
	'Delete event when there is network error',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date
			.future()
			.toISOString()
			.slice(0, 16);
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);

		await homePage.gotoManageEventsPage();
		const manageEventsPage = PageManager.getManageEventsPage(page);

		await manageEventsPage.createNewEvent(
			title,
			description,
			category,
			city,
			venue,
			dateTime,
			seats.toString(),
			price.toString(),
			imageUrl,
		);

		await page.route('**/api/events/**', async (route) => {
			await route.abort('failed');
		});

		await manageEventsPage.deleteEvent(title);

		await loginPage.isNetworkErrorDisplayed();
	},
);

test(
	'Delete event when service is down',
	{ tag: '@ServiceDownTest' },
	async ({ page }) => {
		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date
			.future()
			.toISOString()
			.slice(0, 16);
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);

		await homePage.gotoManageEventsPage();
		const manageEventsPage = PageManager.getManageEventsPage(page);

		await manageEventsPage.createNewEvent(
			title,
			description,
			category,
			city,
			venue,
			dateTime,
			seats.toString(),
			price.toString(),
			imageUrl,
		);

		await page.route('**/api/events/**', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					success: false,
					error: 'Resource not found',
				}),
			});
		});

		await manageEventsPage.deleteEvent(title);

		await loginPage.isResourceNotFoundErrorDisplayed();
	},
);

test(
	'Get bookings in my bookings page and manage bookings page when there is network error',
	{ tag: '@ServiceDownTest' },
	async ({ page, request }) => {
		const token: string = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date.future().toISOString();
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		const email: string = faker.internet.email();
		const name: string = faker.person.fullName();
		const phone: string = '1234567890';
		const quantity: number = faker.number.int({ min: 1, max: 10 });

		const createEventResponse = await new CreateEventAPI(
			request,
		).createEvent(
			token,
			title,
			description,
			category,
			venue,
			city,
			dateTime,
			price,
			seats,
			imageUrl,
		);

		const responseBody = await createEventResponse.json();
		const eventId: number = responseBody.data.id;

		const createBookingAPI = new CreateBookingsAPI(request);

		await createBookingAPI.createBooking(
			token,
			eventId,
			name,
			email,
			phone,
			quantity,
		);

		await page.route('**/api/bookings**', async (route) => {
			await route.abort('failed');
		});

		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		const myBookingsPage: MyBookingsPage =
			PageManager.getMyBookingsPage(page);

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);
		await homePage.gotoMyBookingsPage();

		await page.waitForTimeout(1000);
		await myBookingsPage.verifyErrorTextIsDisplayed();

		await homePage.gotoManageBookingsPage();

		await page.waitForTimeout(1000);
		await myBookingsPage.verifyErrorTextIsDisplayed();
	},
);

test(
	'Get bookings in my bookings page when service is down',
	{ tag: '@ServiceDownTest' },
	async ({ page, request }) => {
		const token: string = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date.future().toISOString();
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		const email: string = faker.internet.email();
		const name: string = faker.person.fullName();
		const phone: string = '1234567890';
		const quantity: number = faker.number.int({ min: 1, max: 10 });

		const createEventResponse = await new CreateEventAPI(
			request,
		).createEvent(
			token,
			title,
			description,
			category,
			venue,
			city,
			dateTime,
			price,
			seats,
			imageUrl,
		);

		const responseBody = await createEventResponse.json();
		const eventId: number = responseBody.data.id;

		const createBookingAPI = new CreateBookingsAPI(request);

		await createBookingAPI.createBooking(
			token,
			eventId,
			name,
			email,
			phone,
			quantity,
		);

		await page.route('**/api/bookings**', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					success: false,
					error: 'Resource not found',
				}),
			});
		});

		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		const myBookingsPage: MyBookingsPage =
			PageManager.getMyBookingsPage(page);

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);
		await homePage.gotoMyBookingsPage();

		await page.waitForTimeout(1000);
		await myBookingsPage.verifyErrorTextIsDisplayed();

		await homePage.gotoManageBookingsPage();

		await page.waitForTimeout(1000);
		await myBookingsPage.verifyErrorTextIsDisplayed();
	},
);

test(
	'Create booking when there is network error',
	{ tag: '@ServiceDownTest' },
	async ({ page, request }) => {
		const token: string = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date.future().toISOString();
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		const email: string = faker.internet.email();
		const name: string = faker.person.fullName();

		await new CreateEventAPI(request).createEvent(
			token,
			title,
			description,
			category,
			venue,
			city,
			dateTime,
			price,
			seats,
			imageUrl,
		);

		await page.route('**/api/bookings', async (route) => {
			await route.abort('failed');
		});

		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		const eventBookingPage: EventBookingPage =
			PageManager.getEventBookingPage(page);

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);

		await homePage.gotoEventsPage();
		await homePage.readEventDetailsAndClickOnEventCardByName(title);
		await page.waitForTimeout(2000);

		await eventBookingPage.bookEvent(name, email, '1234567890');
		await page.waitForTimeout(1000);

		await loginPage.isNetworkErrorDisplayed();
	},
);

test(
	'Create booking when service is down',
	{ tag: '@ServiceDownTest' },
	async ({ page, request }) => {
		const token: string = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date.future().toISOString();
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		const email: string = faker.internet.email();
		const name: string = faker.person.fullName();

		await new CreateEventAPI(request).createEvent(
			token,
			title,
			description,
			category,
			venue,
			city,
			dateTime,
			price,
			seats,
			imageUrl,
		);

		await page.route('**/api/bookings', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					success: false,
					error: 'Resource not found',
				}),
			});
		});

		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		const eventBookingPage: EventBookingPage =
			PageManager.getEventBookingPage(page);

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);

		await homePage.gotoEventsPage();
		await homePage.readEventDetailsAndClickOnEventCardByName(title);
		await page.waitForTimeout(2000);

		await eventBookingPage.bookEvent(name, email, '1234567890');
		await page.waitForTimeout(1000);

		await loginPage.isResourceNotFoundErrorDisplayed();
	},
);

test(
	'View booking when there is network error',
	{ tag: '@ServiceDownTest' },
	async ({ page, request }) => {
		const token: string = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date.future().toISOString();
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		const email: string = faker.internet.email();
		const name: string = faker.person.fullName();
		const phone: string = '1234567890';
		const quantity: number = faker.number.int({ min: 1, max: 10 });

		const createEventResponse = await new CreateEventAPI(
			request,
		).createEvent(
			token,
			title,
			description,
			category,
			venue,
			city,
			dateTime,
			price,
			seats,
			imageUrl,
		);

		const responseBody = await createEventResponse.json();
		const eventId: number = responseBody.data.id;

		const createBookingAPI = new CreateBookingsAPI(request);

		await createBookingAPI.createBooking(
			token,
			eventId,
			name,
			email,
			phone,
			quantity,
		);

		await page.route('**/api/bookings/**', async (route) => {
			await route.abort('failed');
		});

		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		const myBookingsPage: MyBookingsPage =
			PageManager.getMyBookingsPage(page);
		const bookingDetails: BookingDetailsPage =
			PageManager.getBookingDetailsPage(page);

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);
		await homePage.gotoMyBookingsPage();
		await myBookingsPage.viewBooking();
		await page.waitForTimeout(1000);
		await bookingDetails.verifyBookingNotFoundIsDisplayed();
	},
);

test(
	'View booking when service is down',
	{ tag: '@ServiceDownTest' },
	async ({ page, request }) => {
		const token: string = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date.future().toISOString();
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		const email: string = faker.internet.email();
		const name: string = faker.person.fullName();
		const phone: string = '1234567890';
		const quantity: number = faker.number.int({ min: 1, max: 10 });

		const createEventResponse = await new CreateEventAPI(
			request,
		).createEvent(
			token,
			title,
			description,
			category,
			venue,
			city,
			dateTime,
			price,
			seats,
			imageUrl,
		);

		const responseBody = await createEventResponse.json();
		const eventId: number = responseBody.data.id;

		const createBookingAPI = new CreateBookingsAPI(request);

		await createBookingAPI.createBooking(
			token,
			eventId,
			name,
			email,
			phone,
			quantity,
		);

		await page.route('**/api/bookings/**', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					success: false,
					error: 'Resource not found',
				}),
			});
		});

		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		const myBookingsPage: MyBookingsPage =
			PageManager.getMyBookingsPage(page);
		const bookingDetails: BookingDetailsPage =
			PageManager.getBookingDetailsPage(page);

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);
		await homePage.gotoMyBookingsPage();
		await myBookingsPage.viewBooking();
		await page.waitForTimeout(1000);
		await bookingDetails.verifyBookingNotFoundIsDisplayed();
	},
);

test(
	'Cancel booking when there is network error',
	{ tag: '@ServiceDownTest' },
	async ({ page, request }) => {
		const token: string = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date.future().toISOString();
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		const email: string = faker.internet.email();
		const name: string = faker.person.fullName();
		const phone: string = '1234567890';
		const quantity: number = faker.number.int({ min: 1, max: 10 });

		const createEventResponse = await new CreateEventAPI(
			request,
		).createEvent(
			token,
			title,
			description,
			category,
			venue,
			city,
			dateTime,
			price,
			seats,
			imageUrl,
		);

		const responseBody = await createEventResponse.json();
		const eventId: number = responseBody.data.id;

		const createBookingAPI = new CreateBookingsAPI(request);

		await createBookingAPI.createBooking(
			token,
			eventId,
			name,
			email,
			phone,
			quantity,
		);

		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		const myBookingsPage: MyBookingsPage =
			PageManager.getMyBookingsPage(page);

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);
		await homePage.gotoMyBookingsPage();

		await page.route('**/api/bookings/**', async (route) => {
			await route.abort('failed');
		});

		await myBookingsPage.cancelBooking();
		await loginPage.isNetworkErrorDisplayed();
	},
);

test(
	'Cancel booking when service is down',
	{ tag: '@ServiceDownTest' },
	async ({ page, request }) => {
		const token: string = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const title: string = faker.word.noun();
		const description: string = faker.lorem.paragraph();
		const category: string = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city: string = faker.location.city();
		const venue: string = faker.location.streetAddress();
		const dateTime: string = faker.date.future().toISOString();
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		const email: string = faker.internet.email();
		const name: string = faker.person.fullName();
		const phone: string = '1234567890';
		const quantity: number = faker.number.int({ min: 1, max: 10 });

		const createEventResponse = await new CreateEventAPI(
			request,
		).createEvent(
			token,
			title,
			description,
			category,
			venue,
			city,
			dateTime,
			price,
			seats,
			imageUrl,
		);

		const responseBody = await createEventResponse.json();
		const eventId: number = responseBody.data.id;

		const createBookingAPI = new CreateBookingsAPI(request);

		await createBookingAPI.createBooking(
			token,
			eventId,
			name,
			email,
			phone,
			quantity,
		);

		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		const myBookingsPage: MyBookingsPage =
			PageManager.getMyBookingsPage(page);

		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		await homePage.isNavigatedToHomePage(TestData.email);
		await homePage.gotoMyBookingsPage();

		await page.route('**/api/bookings/**', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({
					success: false,
					error: 'Resource not found',
				}),
			});
		});

		await myBookingsPage.cancelBooking();
		await loginPage.isResourceNotFoundErrorDisplayed();
	},
);
