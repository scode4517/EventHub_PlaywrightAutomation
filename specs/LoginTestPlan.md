# EventHub Login UI and API Test Plan

## Application Overview

Explore and test EventHub login at https://eventhub.rahulshettyacademy.com/login and the documented authentication endpoint POST https://api.eventhub.rahulshettyacademy.com/api/auth/login. Every scenario starts from a fresh unauthenticated browser context or a standalone API request. Use a dedicated test account; keep credentials and JWTs out of committed files and logs. The observed UI validation messages are 'Enter a valid email' and 'Password must be at least 6 characters'; invalid credentials display 'Invalid email or password'. Swagger documents HTTP 200 success, 400 wrong password/validation error, and 404 for an unknown account.

## Test Scenarios

### 1. Login UI

**Seed:** `tests/seed.spec.ts`

#### 1.1. Login page renders with expected controls

**File:** `tests/UITests/LoginPageTests.spec.ts`

**Steps:**
  1. Start a fresh unauthenticated browser context and navigate to /login.
    - expect: The URL is /login.
  2. Inspect the login heading, Email and Password inputs, Sign In button, and Register link.
    - expect: The expected heading and controls are visible and usable.
    - expect: Password input masks any entered characters.

#### 1.2. Successful login with seeded test account

**File:** `tests/UITests/LoginPageTests.spec.ts`

**Steps:**
  1. Start a fresh unauthenticated browser context and navigate to /login.
    - expect: The login form is shown without a pre-existing authenticated session.
  2. Enter the approved seeded test account's valid email and password, then select Sign In.
    - expect: Authentication succeeds and the app routes to its signed-in/home view.
    - expect: The signed-in view identifies the expected account; no login error is visible.

#### 1.3. Empty credentials show field validation

**File:** `tests/UITests/LoginPageTests.spec.ts`

**Steps:**
  1. Start a fresh unauthenticated browser context; navigate to /login and leave both fields empty.
    - expect: The login form is shown with no prior validation or authentication state.
  2. Select Sign In.
    - expect: Email validation displays 'Enter a valid email'.
    - expect: Password validation displays 'Password must be at least 6 characters'.
    - expect: The browser remains on /login and no authenticated state is created.

#### 1.4. Malformed email is rejected

**File:** `tests/UITests/LoginPageTests.spec.ts`

**Steps:**
  1. Start a fresh unauthenticated browser context and navigate to /login.
  2. Enter a malformed email and a password of at least six characters, then select Sign In.
    - expect: 'Enter a valid email' is displayed.
    - expect: No authenticated navigation occurs.

#### 1.5. Too-short password is rejected

**File:** `tests/UITests/LoginPageTests.spec.ts`

**Steps:**
  1. Start a fresh unauthenticated browser context and navigate to /login.
  2. Enter a valid-format email and a password shorter than six characters, then select Sign In.
    - expect: 'Password must be at least 6 characters' is displayed.
    - expect: No authenticated navigation occurs.

#### 1.6. Valid-format but incorrect credentials are rejected

**File:** `tests/UITests/LoginPageTests.spec.ts`

**Steps:**
  1. Start a fresh unauthenticated browser context and navigate to /login.
  2. Enter a valid-format unknown email or the seeded account email with an incorrect password, then select Sign In.
    - expect: The UI displays 'Invalid email or password'.
    - expect: The browser remains on /login; no authenticated state or sensitive token is exposed.

### 2. Login API

**Seed:** `tests/seed.spec.ts`

#### 2.1. Valid login returns token and user

**File:** `tests/APITests/LoginAPITest.spec.ts`

**Steps:**
  1. Start an independent API test with no browser session; POST JSON containing the approved seeded email and password to /auth/login.
    - expect: HTTP 200.
    - expect: Response indicates success and includes a non-empty JWT and user identity matching the test account.
    - expect: Do not print or persist the token in artifacts.

#### 2.2. Wrong password is rejected

**File:** `tests/APITests/LoginAPITest.spec.ts`

**Steps:**
  1. Start an independent API request; POST the seeded account email and an incorrect password to /auth/login.
    - expect: HTTP 400 per Swagger.
    - expect: Response indicates failure and has no usable token.
    - expect: Error payload follows the documented schema.

#### 2.3. Unknown email is rejected

**File:** `tests/APITests/LoginAPITest.spec.ts`

**Steps:**
  1. Start an independent API request; POST a unique, syntactically valid but unregistered email and a non-empty password to /auth/login.
    - expect: HTTP 404 per Swagger.
    - expect: Response indicates failure and contains no usable token.

#### 2.4. Missing and empty credentials are rejected

**File:** `tests/APITests/LoginAPITest.spec.ts`

**Steps:**
  1. Start an independent API request; POST empty email and password, then repeat with email omitted and password omitted.
    - expect: Each request is rejected with HTTP 400 as a validation error.
    - expect: No response contains a usable token.
    - expect: The API remains available for an independent valid login.

#### 2.5. Login token authenticates user profile

**File:** `tests/APITests/LoginAPITest.spec.ts`

**Steps:**
  1. Start an independent API flow; obtain a token by logging in with the seeded account, then GET /auth/me with the token in the documented Authorization header.
    - expect: The profile request succeeds.
    - expect: The returned profile identity matches the login response.
    - expect: The token is not emitted in test output.
