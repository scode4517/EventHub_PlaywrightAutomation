<!-- @format -->

# EventHub Playwright Automation

This repository contains an end-to-end Playwright automation suite for the EventHub application hosted at <https://eventhub.rahulshettyacademy.com>.

The project verifies both the browser UI and the EventHub REST API. It includes:

- User registration and login
- Event discovery, filtering, creation, updating, and deletion
- Event ticket booking and booking cancellation
- User and administrator booking-management flows
- API tests for authentication, events, and bookings
- API-and-UI integration scenarios
- Service-down and error-handling scenarios
- Screenshot and visual comparison tests
- End-to-end UI and API workflows

## Technology Stack

- Node.js
- TypeScript
- Playwright Test
- Faker (`@faker-js/faker`) for generated test data
- HTML Playwright reporter
- Azure Playwright Workspaces support
- GitHub Actions for scheduled and pull-request test runs

## Project Structure

```text
tests/
  APITests/             REST API test specifications
  UITests/              Browser and page-object tests
  APIUIIntegration/     Cross-layer integration tests
  ServiceDownTests/     API/UI failure and service-down scenarios
  TestSetup.ts          Authenticated Playwright test fixture
api-methods/            API action classes
pageObjects/            Page Object Model classes and PageManager
TestData/               Shared users and test data
scripts/                Tag-based test execution script
specs/                  Test plans
playwright.config.js    Main local Playwright configuration
playwright.service.config.js
                        Azure Playwright Workspaces configuration
.github/workflows/      GitHub Actions workflows
```

The main Playwright configuration:

- Runs tests from `./tests`
- Uses Chromium
- Targets <https://eventhub.rahulshettyacademy.com>
- Uses the API base URL <https://api.eventhub.rahulshettyacademy.com/api>
- Runs tests in headed or headless mode according to the command/configuration
- Retains traces and failure videos
- Generates an HTML report
- Retries each failed test once locally

## Prerequisites

Before running the suite, install:

- Node.js LTS
- npm, included with Node.js
- Git, optional for cloning
- Internet access to the EventHub web and API endpoints

For local Windows PowerShell use, no application server is required because the tests run against the hosted EventHub environment.

## Installation

Clone the repository and enter the project directory:

```powershell
git clone https://github.com/santhoshsai4517/EventHub_PlaywrightAutomation.git
cd EventHub_PlaywrightAutomation
```

Install the exact npm dependencies recorded in `package-lock.json`:

```powershell
npm ci
```

Install the Chromium browser used by the test suite:

```powershell
npx playwright install chromium
```

If required for operating-system dependencies on Linux or WSL, install Playwright dependencies:

```powershell
npx playwright install --with-deps chromium
```

## Test Data and Authentication

Shared test values are stored in [TestData/TestData.ts](TestData/TestData.ts). The suite uses the configured test account and the generated API URLs by default. New users and event data are often created dynamically with Faker.

Do not store real credentials or secrets in test files or repository configuration. For CI environments, use GitHub repository secrets and variables for SMTP and Azure settings.

## Running the Tests

Run the complete suite:

```powershell
npm test
```

This executes:

```powershell
npx playwright test
```

Open Playwright Test UI mode:

```powershell
npm run test:ui
```

Run tests in headed mode:

```powershell
npx playwright test --headed
```

Run one or more browser spec files:

```powershell
npx playwright test tests/UITests/LoginPageTests.spec.ts
npx playwright test tests/APITests/LoginAPITest.spec.ts
```

Run tests by Playwright tag:

```powershell
npx playwright test --grep "@Login"
npx playwright test --grep "@CreateEventAPITest"
npx playwright test --grep "@E2EAPITest"
```

The package also provides a comma-separated tag runner:

```powershell
npm run tags -- "@LoginTest,@LoginErrorTest"
```

The script converts commas to Playwright grep alternatives and opens the HTML report after execution.

Run tests against a specific project/browser:

```powershell
npx playwright test --project=chromium
```

Limit execution to a worker count:

```powershell
npx playwright test --workers=4
```

## Common Tag Examples

The suite uses tags such as:

- `@Login`, `@LoginTest`, `@LoginErrorTest`, `@LoginAPITest`
- `@RegisterTest`, `@RegisterErrorTest`, `@RegisterAPITest`
- `@HomePageTest`
- `@EventsPageTest`
- `@EventBookingPageTest`
- `@ManageEventsPageTest`
- `@ManageBookingsPageTest`
- `@MyBookingsPageTest`
- `@BookingDetailsPageTest`
- `@End2EndUITest`
- `@E2EAPITest`
- `@IntegrationTest`
- `@ServiceDownTest`
- API operation tags including `@CreateEventAPITest`, `@CreateBookingAPITest`, `@GetAllBookingsAPITest`, `@CancelBookingByIdAPITest`, and `@DeleteEventByIdAPITest`

Use `npx playwright test --grep "<tag>"` to execute tests for a tag.

## HTML Report

The default reporter writes to `playwright-report/`.

Open the report generated by the latest run:

```powershell
npx playwright show-report
```

Trace and video artifacts are written under `test-results/` when Playwright generates or retains them.

## Visual Snapshot Tests

Some UI tests compare screenshots. If the application intentionally changes and snapshots need updating, run the relevant test with Playwright's snapshot update option:

```powershell
npx playwright test tests/UITests/LoginPageTests.spec.ts --update-snapshots
```

Replace the spec path with the test file containing the intended visual change. Review all updated snapshot images before committing them.

## Azure Playwright Workspaces

The optional [playwright.service.config.js](playwright.service.config.js) configuration extends the local configuration with Azure Playwright support.

Run it when Azure credentials and `PLAYWRIGHT_SERVICE_URL` are configured:

```powershell
npx playwright test --config=playwright.service.config.js --grep "@Login" --workers=4
```

Azure authentication uses `DefaultAzureCredential`. Configure credentials through one of Azure's supported local or CI authentication methods.

Required for the service workflow:

- `AZURE_CREDENTIALS` GitHub secret for Azure login
- `PLAYWRIGHT_SERVICE_URL` GitHub variable
- Azure access for the Playwright service

## GitHub Actions

The workflow in [.github/workflows/playwright.yml](.github/workflows/playwright.yml):

- Runs on pushes and pull requests to `main` or `master`
- Runs on a weekday schedule
- Supports manual workflow dispatch
- Installs npm dependencies
- Logs in to Azure
- Executes tagged tests through the Playwright service configuration
- Uploads `playwright-report/` as an artifact
- Sends an optional SMTP email notification

Configure GitHub Actions secrets and variables:

| Name                     | Type     | Purpose                       |
| ------------------------ | -------- | ----------------------------- |
| `AZURE_CREDENTIALS`      | Secret   | Azure login credentials       |
| `SMTP_USERNAME`          | Secret   | SMTP account and sender       |
| `SMTP_PASSWORD`          | Secret   | SMTP password or app password |
| `PLAYWRIGHT_SERVICE_URL` | Variable | Azure Playwright service URL  |
| `REPORT_EMAIL_TO`        | Variable | Report recipient              |

Keep credentials in GitHub Actions secrets and never commit them to source control.

## Troubleshooting

### Browser executable is missing

Run:

```powershell
npx playwright install chromium
```

### Hosted application or API is unavailable

Verify that the URLs in [playwright.config.js](playwright.config.js) and [TestData/TestData.ts](TestData/TestData.ts) are reachable. Service-down tests may also intentionally exercise unavailable-service behavior.

### Login or authentication failures

Confirm the EventHub test account values in [TestData/TestData.ts](TestData/TestData.ts) still exist and that the API is reachable.

### Report does not open

Generate a test run first, then open the report:

```powershell
npx playwright test
npx playwright show-report
```
