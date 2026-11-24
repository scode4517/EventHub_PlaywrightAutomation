# EventHub Login Test Plan

## Objective and scope
Validate login behavior through the EventHub web UI and the authentication API: successful authentication, input validation, rejected credentials, response contract, and token usability. This plan covers login only; registration is out of scope.

## Application and contract
- Web application: https://eventhub.rahulshettyacademy.com/login
- API base: https://api.eventhub.rahulshettyacademy.com/api
- Login operation: POST /auth/login with a JSON body containing email and password.
- API docs: https://api.eventhub.rahulshettyacademy.com/api/docs
- The UI displays “Sign in to EventHub”, Email and Password fields, and a Sign In button. Observed client validation messages are “Enter a valid email” and “Password must be at least 6 characters”. A rejected login displays “Invalid email or password” and remains on the login page.
- Swagger documents 200 for successful login, 400 for wrong password or validation error, and 404 when no account exists for the email. Validate response fields against the API schema and do not assume undocumented error details.

## Test data and setup
- Use a dedicated, seeded test account with credentials supplied by protected environment variables or the project’s approved test-data mechanism. Do not add credentials or issued tokens to source control, test output, screenshots, or logs.
- Use a unique, syntactically valid unknown email for no-account tests and an incorrect password for a known account. Avoid creating/updating/deleting user accounts during this suite.
- Run against the configured EventHub web and API hosts. Each test starts unauthenticated; clear browser storage/cookies between UI cases so prior login state cannot mask results.

## UI scenarios

### UI-01 — Login page renders
Steps:
1. Navigate to /login.
2. Locate the Sign in to EventHub heading, Email textbox, Password textbox, Sign In button, and Register link.
Checks:
- Page URL is /login and each expected control is visible and enabled.
- Password input masks entered characters.

### UI-02 — Successful login
Steps:
1. Navigate to /login.
2. Enter the seeded account email and password.
3. Select Sign In.
Checks:
- The user is authenticated and routed to the application’s signed-in/home view.
- The signed-in UI identifies the expected account; no login error is visible.
- Refreshing the authenticated page preserves the expected authenticated state if that is the app’s intended session behavior.

### UI-03 — Submit empty credentials
Steps:
1. Navigate to /login with both fields empty.
2. Select Sign In.
Checks:
- Email validation displays “Enter a valid email”.
- Password validation displays “Password must be at least 6 characters”.
- The user remains on /login and is not authenticated.

### UI-04 — Reject malformed email
Steps:
1. Navigate to /login.
2. Enter a malformed email and a password meeting the six-character minimum.
3. Select Sign In.
Checks:
- “Enter a valid email” is displayed.
- No authenticated navigation occurs.

### UI-05 — Reject too-short password
Steps:
1. Navigate to /login.
2. Enter a valid-format email and a password shorter than six characters.
3. Select Sign In.
Checks:
- “Password must be at least 6 characters” is displayed.
- No authenticated navigation occurs.

### UI-06 — Reject valid-format but incorrect credentials
Steps:
1. Navigate to /login.
2. Enter a valid-format unregistered email or a known account with the wrong password.
3. Select Sign In.
Checks:
- “Invalid email or password” is displayed.
- The page remains on /login and the signed-in state is not shown.
- No raw server exception or sensitive credential/token is displayed.

## API scenarios

### API-01 — Login succeeds and returns an auth token
Steps:
1. Send POST /auth/login with the seeded account’s email and password as JSON.
2. Parse the JSON response.
Checks:
- HTTP status is 200.
- Response indicates success and contains a non-empty token and user data identifying the seeded account.
- Token is treated as secret and is not printed or persisted in artifacts.

### API-02 — Wrong password is rejected
Steps:
1. Send POST /auth/login with the seeded email and an incorrect password.
2. Parse the JSON response.
Checks:
- HTTP status is 400 per the API documentation.
- Response indicates failure and contains no usable token.
- Error response matches the documented error schema; do not require private implementation details.

### API-03 — Unknown email is rejected
Steps:
1. Send POST /auth/login with a unique, valid-format email that is not registered and a non-empty password.
2. Parse the JSON response.
Checks:
- HTTP status is 404 per the API documentation.
- Response indicates failure and contains no usable token.

### API-04 — Missing/empty credentials are rejected
Steps:
1. Send POST /auth/login with empty email and password.
2. Repeat with email omitted, then password omitted.
Checks:
- Each request is rejected with HTTP 400.
- Response indicates validation failure and contains no usable token.
- The API remains available for a subsequent valid login.

### API-05 — Token authenticates the user
Steps:
1. Obtain a token from a successful API-01 login.
2. Send GET /auth/me with the token in the Authorization header using the documented scheme.
Checks:
- HTTP response indicates success.
- Returned user identity matches the account returned by login.
- Do not expose the token in test output.

## Cross-surface checks
- A failed UI login and equivalent API credentials both fail without creating an authenticated session.
- Successful UI and API login identify the same seeded test user.
- Keep API tests independent of browser state and UI tests independent of a token created by an API test.

## Existing coverage in this repository
The current UI tests already exercise page rendering, successful login, empty input, malformed email, short password, rejected credentials, and the Register link. Existing API tests cover successful login, empty credentials, and invalid credentials; Auth Me tests cover valid and invalid tokens. Use this plan to align response assertions with the published OpenAPI contract and to add explicit missing-field, unknown-email, token-shape, and token-use checks where needed.