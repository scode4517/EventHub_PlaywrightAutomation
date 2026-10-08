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

test(
	'Register a user from API and login using UI',
	{ tag: '@IntegrationTest' },
	async ({ request, page }) => {
		const email: string = faker.internet.email();
		const password: string = faker.internet.password({
			length: 12,
			memorable: false,
			pattern: /[A-Za-z0-9!@#$%^&*]/,
			prefix: 'Aa1!',
		});

		const registerResponse = await new RegisterAPI(
			request,
		).registerUser(email, password);
		expect(registerResponse.ok()).toBeTruthy();

		const responseBody = await registerResponse.json();

		expect(responseBody.success).toBeTruthy();
		expect(responseBody.token).toBeDefined();
		expect(responseBody.user.email).toBe(email);
		expect(responseBody.user.id).toBeDefined();

		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		await loginPage.goto();
		await loginPage.login(email, password);
		await homePage.isNavigatedToHomePage(email);
	},
);

test(
	'Register a user from UI and login using API',
	{ tag: '@IntegrationTest' },
	async ({ request, page }) => {
		const registerPage: RegisterPage =
			PageManager.getRegisterPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		await registerPage.goto();

		const email: string = faker.internet.email();
		const password: string = faker.internet.password({
			length: 12,
			memorable: false,
			pattern: /[A-Za-z0-9!@#$%^&*]/,
			prefix: 'Aa1!',
		});
		await registerPage.register(email, password, password);
		await homePage.isNavigatedToHomePage(email);

		const loginResponse = await new LoginAPI(request).callLoginAPI(
			email,
			password,
		);
		expect(loginResponse.ok()).toBeTruthy();

		const responseBody = await loginResponse.json();

		expect(responseBody.success).toBeTruthy();
		expect(responseBody.token).toBeDefined();
		expect(responseBody.user.email).toBe(email);
	},
);

test(
	'Create a event from api and verify details in UI',
	{ tag: '@IntegrationTest' },
	async ({ request, page }) => {
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

		expect(createEventResponse.ok()).toBeTruthy();

		const responseBody = await createEventResponse.json();
		const eventId: number = responseBody.data.id;

		expect(responseBody.success).toBeTruthy();
		expect(responseBody.message).toBe('Event created successfully');
		expect(responseBody.data).toBeDefined();
		expect(responseBody.data.id).toBeDefined();
		expect(responseBody.data.title).toBe(title);
		expect(responseBody.data.description).toBe(description);
		expect(responseBody.data.category).toBe(category);
		expect(responseBody.data.venue).toBe(venue);
		expect(responseBody.data.city).toBe(city);
		expect(responseBody.data.eventDate).toBe(dateTime);
		expect(responseBody.data.price).toBe(price.toString());
		expect(responseBody.data.totalSeats).toBe(seats);

		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);

		await homePage.clickOnBrowseEventsButton();

		const eventDetails: string[] =
			await homePage.readEventDetailsAndClickOnEventCardByName(
				title,
			);
		await page.waitForLoadState('networkidle');
		const [
			eventName,
			eventDate,
			eventLocation,
			eventCost,
			eventSeatsLeft,
		] = eventDetails;

		const eventBookingPage = PageManager.getEventBookingPage(page);
		await eventBookingPage.isNavigatedToEventBookingPage(
			title,
			dateTime,
			venue,
			price.toString(),
			seats.toString(),
		);
	},
);

test(
	'Create a event from ui and verify details in api',
	{ tag: '@IntegrationTest' },
	async ({ request, page }) => {
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
		const dateTime: string = faker.date
			.future()
			.toISOString()
			.slice(0, 16);
		const seats: number = faker.number.int({ min: 1, max: 1000 });
		const price: number = faker.number.int({ min: 1, max: 1000 });
		const imageUrl: string = faker.image.url();

		const loginPage = PageManager.getLoginPage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		const homePage = PageManager.getHomePage(page);
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

		const getAllEventsAPIResponse = await new GetEventListAPI(
			request,
		).getAllEvents(token, category, city, title);

		expect(getAllEventsAPIResponse.ok()).toBeTruthy();

		const responseBody = await getAllEventsAPIResponse.json();

		expect(responseBody.success).toBeTruthy();
		const id: number = responseBody.data[0].id;

		const getEventByIdResponse = await new GetEventByIdAPI(
			request,
		).getEventById(token, id);

		expect(getEventByIdResponse.ok()).toBeTruthy();

		const getEventsResponseBody = await getEventByIdResponse.json();

		expect(getEventsResponseBody.data.title).toBe(title);
		expect(getEventsResponseBody.data.description).toBe(description);
		expect(getEventsResponseBody.data.category).toBe(category);
		expect(getEventsResponseBody.data.venue).toBe(venue);
		expect(getEventsResponseBody.data.city).toBe(city);
		// expect(getEventsResponseBody.data.eventDate).toBe(dateTime);
		expect(getEventsResponseBody.data.price).toBe(price.toString());
		expect(getEventsResponseBody.data.totalSeats).toBe(seats);
		expect(getEventsResponseBody.data.imageUrl).toBe(imageUrl);
	},
);

test(
	'Update a event from api and verify details in UI',
	{ tag: '@IntegrationTest' },
	async ({ request, page }) => {
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

		expect(createEventResponse.ok()).toBeTruthy();

		const responseBody = await createEventResponse.json();
		const eventId: number = responseBody.data.id;

		const updateEventResponse = await new UpdateEventAPI(
			request,
		).updateEvent(
			eventId,
			token,
			title,
			description,
			category,
			venue,
			city,
			dateTime,
			price + 1,
			seats,
			imageUrl,
		);

		expect(updateEventResponse.ok()).toBeTruthy();

		const updateEventResponseBody = await updateEventResponse.json();

		expect(updateEventResponseBody.data.title).toBe(title);
		expect(updateEventResponseBody.data.description).toBe(description);
		expect(updateEventResponseBody.data.category).toBe(category);
		expect(updateEventResponseBody.data.venue).toBe(venue);
		expect(updateEventResponseBody.data.city).toBe(city);
		expect(updateEventResponseBody.data.eventDate).toBe(dateTime);
		expect(updateEventResponseBody.data.price).toBe(
			(price + 1).toString(),
		);
		expect(updateEventResponseBody.data.totalSeats).toBe(seats);

		const loginPage: LoginPage = PageManager.getLoginPage(page);
		const homePage: HomePage = PageManager.getHomePage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);

		await homePage.clickOnBrowseEventsButton();

		const eventDetails: string[] =
			await homePage.readEventDetailsAndClickOnEventCardByName(
				title,
			);
		await page.waitForLoadState('networkidle');
		const [
			eventName,
			eventDate,
			eventLocation,
			eventCost,
			eventSeatsLeft,
		] = eventDetails;

		const eventBookingPage = PageManager.getEventBookingPage(page);
		await eventBookingPage.isNavigatedToEventBookingPage(
			title,
			dateTime,
			venue,
			(price + 1).toString(),
			seats.toString(),
		);
	},
);

test(
	'Update a event from ui and verify details in api',
	{ tag: '@IntegrationTest' },
	async ({ request, page }) => {
		const loginPage = PageManager.getLoginPage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		const homePage = PageManager.getHomePage(page);
		await homePage.gotoManageEventsPage();

		const manageEventsPage = PageManager.getManageEventsPage(page);
		const title = faker.word.noun();
		const description = faker.lorem.paragraph();
		const category = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city = faker.location.city();
		const venue = faker.location.streetAddress();
		const dateTime = faker.date.future().toISOString().slice(0, 16);
		const seats = faker.number.int({ min: 1, max: 1000 }).toString();
		const price = faker.number.int({ min: 1, max: 1000 }).toString();
		const imageUrl = faker.image.url();
		await manageEventsPage.createNewEvent(
			title,
			description,
			category,
			city,
			venue,
			dateTime,
			seats,
			price,
			imageUrl,
		);

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
			seats,
			price,
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

		const token: string = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const getAllEventsAPIResponse = await new GetEventListAPI(
			request,
		).getAllEvents(token, newCategory, newCity, newTitle);

		expect(getAllEventsAPIResponse.ok()).toBeTruthy();

		const responseBody = await getAllEventsAPIResponse.json();

		expect(responseBody.success).toBeTruthy();
		const id: number = responseBody.data[0].id;

		const getEventByIdResponse = await new GetEventByIdAPI(
			request,
		).getEventById(token, id);

		expect(getEventByIdResponse.ok()).toBeTruthy();

		const getEventsResponseBody = await getEventByIdResponse.json();

		expect(getEventsResponseBody.data.title).toBe(newTitle);
		expect(getEventsResponseBody.data.description).toBe(newDescription);
		expect(getEventsResponseBody.data.category).toBe(newCategory);
		expect(getEventsResponseBody.data.venue).toBe(newVenue);
		expect(getEventsResponseBody.data.city).toBe(newCity);
		// expect(getEventsResponseBody.data.eventDate).toBe(dateTime);
		expect(getEventsResponseBody.data.price).toBe(newPrice.toString());
		expect(getEventsResponseBody.data.totalSeats.toString()).toBe(
			newSeats,
		);
		expect(getEventsResponseBody.data.imageUrl).toBe(newImageUrl);
	},
);

test(
	'Delete a event from ui and verify details in api',
	{ tag: '@IntegrationTest' },
	async ({ request, page }) => {
		const loginPage = PageManager.getLoginPage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);
		const homePage = PageManager.getHomePage(page);
		await homePage.gotoManageEventsPage();

		const manageEventsPage = PageManager.getManageEventsPage(page);
		const title = faker.word.noun();
		const description = faker.lorem.paragraph();
		const category = faker.helpers.arrayElement(
			TestData.eventCategories,
		);
		const city = faker.location.city();
		const venue = faker.location.streetAddress();
		const dateTime = faker.date.future().toISOString().slice(0, 16);
		const seats = faker.number.int({ min: 1, max: 1000 }).toString();
		const price = faker.number.int({ min: 1, max: 1000 }).toString();
		const imageUrl = faker.image.url();
		await manageEventsPage.createNewEvent(
			title,
			description,
			category,
			city,
			venue,
			dateTime,
			seats,
			price,
			imageUrl,
		);
		await manageEventsPage.deleteEvent(title);

		const token: string = await new LoginAPI(request).getToken(
			TestData.email,
			TestData.password,
		);

		const getAllEventsAPIResponse = await new GetEventListAPI(
			request,
		).getAllEvents(token, category, city, title);

		expect(getAllEventsAPIResponse.ok()).toBeTruthy();

		const responseBody = await getAllEventsAPIResponse.json();

		expect(responseBody.success).toBeTruthy();
		expect(responseBody.pagination.total).toBe(0);
	},
);

test(
	'Create a booking from api and verify details in UI',
	{ tag: '@IntegrationTest' },
	async ({ request, page }) => {
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

		expect(createEventResponse.ok()).toBeTruthy();

		const responseBody = await createEventResponse.json();
		const eventId: number = responseBody.data.id;

		const createBookingAPI = new CreateBookingsAPI(request);

		const createBookingResponse = await createBookingAPI.createBooking(
			token,
			eventId,
			name,
			email,
			phone,
			quantity,
		);

		expect(createBookingResponse.ok()).toBeTruthy();

		const createBookingResponseBody =
			await createBookingResponse.json();

		expect(createBookingResponseBody.success).toBeTruthy();
		expect(createBookingResponseBody.message).toBe(
			'Booking confirmed!',
		);
		expect(createBookingResponseBody.data.id).toBeDefined();
		expect(createBookingResponseBody.data.eventId).toBe(eventId);
		expect(createBookingResponseBody.data.customerName).toBe(name);
		expect(createBookingResponseBody.data.customerEmail).toBe(
			email.toLowerCase(),
		);
		expect(createBookingResponseBody.data.customerPhone).toBe(phone);
		expect(createBookingResponseBody.data.quantity).toBe(quantity);
		expect(createBookingResponseBody.data.totalPrice).toBe(
			(quantity * price).toString(),
		);
		expect(createBookingResponseBody.data.status).toBe('confirmed');
		expect(createBookingResponseBody.data.bookingRef).toBeDefined();

		expect(createBookingResponseBody.data.event.id).toBeDefined();
		expect(createBookingResponseBody.data.event.title).toBe(title);
		expect(createBookingResponseBody.data.event.description).toBe(
			description,
		);
		expect(createBookingResponseBody.data.event.category).toBe(
			category,
		);
		expect(createBookingResponseBody.data.event.venue).toBe(venue);
		expect(createBookingResponseBody.data.event.city).toBe(city);
		expect(createBookingResponseBody.data.event.eventDate).toBe(
			dateTime,
		);
		expect(createBookingResponseBody.data.event.price).toBe(
			price.toString(),
		);
		expect(createBookingResponseBody.data.event.totalSeats).toBe(seats);

		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const myBookingsPage = PageManager.getMyBookingsPage(page);

		const loginPage = PageManager.getLoginPage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);

		await homePage.gotoMyBookingsPage();

		const bookingRefId =
			await createBookingResponseBody.data.bookingRef;

		const todayDate = new Intl.DateTimeFormat('en-GB', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		}).format(new Date());
		await myBookingsPage.verifyBookingDetails(
			title,
			dateTime,
			venue + ',' + city,
			(price * quantity).toString(),
			quantity,
			todayDate,
			bookingRefId,
		);
	},
);

test(
	'Create a booking from ui and verify details in api',
	{ tag: '@IntegrationTest' },
	async ({ request, page }) => {
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

		expect(createEventResponse.ok()).toBeTruthy();

		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);

		const loginPage = PageManager.getLoginPage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);

		await homePage.gotoEventsPage();
		const [
			eventName,
			eventDate,
			eventLocation,
			eventCost,
			eventSeatsLeft,
		] = await homePage.readEventDetailsAndClickOnEventCardByName(title);
		await page.waitForTimeout(2000);

		await eventBookingPage.bookEvent(name, email, '1234567890');
		await page.waitForTimeout(1000);
		const bookingRefId = await eventBookingPage.getBookingRefId();

		const getBookingByRefIdAPI = new GetBookingByRefIdAPI(request);
		const bookingResponse =
			await getBookingByRefIdAPI.getBookingByRefId(
				token,
				bookingRefId,
			);

		expect(bookingResponse.ok()).toBeTruthy();

		const createBookingResponseBody = await bookingResponse.json();

		expect(createBookingResponseBody.success).toBeTruthy();
		expect(createBookingResponseBody.data.customerName).toBe(name);
		expect(createBookingResponseBody.data.customerEmail).toBe(
			email.toLowerCase(),
		);
		expect(createBookingResponseBody.data.customerPhone).toBe(
			'1234567890',
		);
		expect(createBookingResponseBody.data.quantity).toBe(1);
		expect(createBookingResponseBody.data.totalPrice).toBe(
			price.toString(),
		);
		expect(createBookingResponseBody.data.status).toBe('confirmed');
		expect(createBookingResponseBody.data.bookingRef).toBeDefined();

		expect(createBookingResponseBody.data.event.id).toBeDefined();
		expect(createBookingResponseBody.data.event.title).toBe(title);
		expect(createBookingResponseBody.data.event.description).toBe(
			description,
		);
		expect(createBookingResponseBody.data.event.category).toBe(
			category,
		);
		expect(createBookingResponseBody.data.event.venue).toBe(venue);
		expect(createBookingResponseBody.data.event.city).toBe(city);
		expect(createBookingResponseBody.data.event.eventDate).toBe(
			dateTime,
		);
		expect(createBookingResponseBody.data.event.price).toBe(
			price.toString(),
		);
		expect(createBookingResponseBody.data.event.totalSeats).toBe(seats);
	},
);

test(
	'Cancel a booking from ui and verify details in api',
	{ tag: '@IntegrationTest' },
	async ({ request, page }) => {
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

		expect(createEventResponse.ok()).toBeTruthy();

		const eventBookingPage = PageManager.getEventBookingPage(page);
		const homePage = PageManager.getHomePage(page);
		const myBookingsPage = PageManager.getMyBookingsPage(page);

		const loginPage = PageManager.getLoginPage(page);
		await loginPage.goto();
		await loginPage.login(TestData.email, TestData.password);

		await homePage.gotoEventsPage();
		await homePage.readEventDetailsAndClickOnEventCardByName(title);
		await page.waitForTimeout(2000);

		await eventBookingPage.bookEvent(name, email, '1234567890');
		await page.waitForTimeout(1000);
		const bookingRefId = await eventBookingPage.getBookingRefId();
		await eventBookingPage.clickOnViewMyBookingsButton();
		await myBookingsPage.cancelBooking();

		const getBookingByRefIdAPI = new GetBookingByRefIdAPI(request);
		const bookingResponse =
			await getBookingByRefIdAPI.getBookingByRefId(
				token,
				bookingRefId,
			);

		expect(bookingResponse.ok()).toBeFalsy();

		const getEventResponseBody = await bookingResponse.json();

		expect(getEventResponseBody.success).toBeFalsy();
		expect(getEventResponseBody.error).toBe(
			`Booking with reference \"${bookingRefId}\" not found`,
		);
	},
);
