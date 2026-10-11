# Addis Eats — Authentication and Authorization

## Overview

Day 42 introduced authentication and authorization to Addis Eats. The goal was to understand how sign-in, sessions, protected routes, order ownership, and staff permissions work together.

The implementation includes:

- Sign in with email and password
- Sign out
- Server-side sessions
- Session cookies
- Protected routes
- User-owned orders
- Staff-only access
- Server-side authorization checks
- Safe redirects after sign-in

This is a learning project. Its current authentication and storage choices have limitations that must be addressed before production use.

## Demo Users

The application defines demo users in `lib/users.js`.

For privacy and security, demo credentials are intentionally not reproduced in this documentation. Consult the local development data when you need to test the sign-in flow.

**Security note:** The current demo implementation uses plain-text passwords. Real applications must use an appropriate password-hashing algorithm and must never store passwords in plain text.

## How Sign-In Works

The sign-in flow is:

```text
Sign-In Form
     ↓
signIn Server Action
     ↓
Find user by email
     ↓
Check password
     ↓
Create session
     ↓
Set session cookie
     ↓
Redirect to requested page
```

After successful authentication, the server creates a session containing basic user information:

```text
id
name
email
role
```

The password is not included in the session.

## Sessions

Session logic is implemented in:

```text
lib/session.js
```

The main functions are:

```text
createSession()
getSession()
destroySession()
```

The application generates a random session ID and stores the associated session data on the server. The browser receives the session ID through a cookie.

```text
Browser
   ↓
Session cookie
   ↓
Session ID
   ↓
Server-side session store
   ↓
User information
```

The current session store is an in-memory `Map`. Sessions are lost when the server process restarts, and the store is not shared across multiple server instances.

A production application needs persistent session storage or another suitable authentication architecture.

## Session Cookie

The session cookie is named:

```text
session
```

Its intended configuration includes:

```js
{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/"
}
```

These settings serve different purposes:

- **`httpOnly`** — prevents browser JavaScript from reading the cookie directly.
- **`secure`** — requires HTTPS when enabled in production.
- **`sameSite: "lax"`** — provides some protection against cross-site request scenarios.
- **`maxAge`** — sets a seven-day cookie lifetime.
- **`path: "/"`** — makes the cookie available across application routes.

The `httpOnly` setting can be checked in the browser because the session cookie should not appear in `document.cookie`. This alone does not prove that the complete authentication system is secure.

## Protected Routes

The application protects these routes:

```text
/checkout
/orders
/orders/[id]
```

The root `proxy.js` provides an early navigation guard. When a signed-out user requests a protected route, the application redirects them to a sign-in URL such as:

```text
/signin?next=/checkout
```

After successful sign-in, the application can return the user to the requested internal page.

**The proxy is not the complete security boundary.** Authorization must also be enforced in the relevant Server Components, Server Actions, and Route Handlers.

A request can bypass the visible interface, so hiding a link or redirecting in the proxy is not sufficient protection by itself.

## Order Ownership

Orders must be associated with the authenticated user on the server.

When an order is created, the server derives its owner from the session rather than trusting a user ID submitted by the browser.

The order-related helpers include:

```text
getOrdersByUser(userId)
getOrderForUser(orderId, userId)
```

When a user requests an individual order, the server checks whether that order belongs to the current user.

Changing an order ID in the URL must not grant access to another user's order.

## Cancelling Orders

The `cancelOrder()` Server Action must verify authorization on the server before changing an order.

The essential checks are:

1. Retrieve the current session.
2. Confirm the order exists and belongs to the authenticated user.
3. Perform the cancellation only when the authorization checks pass.

The client interface is not a trusted source of authorization. A disabled button or hidden control cannot replace server-side checks.

## Order API Security

### `POST /api/orders`

Order creation validates the request on the server.

Expected outcomes include:

| Status | Meaning |
|---|---|
| `201 Created` | Order created successfully |
| `401 Unauthorized` | Authentication is required |
| `422 Unprocessable Entity` | Submitted data is invalid |

The server must derive the order owner's ID from the authenticated session, not from a client-supplied `userId`.

### `GET /api/orders/[id]`

The handler must authenticate the request and check order ownership before returning private order information.

A request for another user's order can return `404 Not Found`, avoiding disclosure of whether that order exists.

## Staff Authorization

The `/kitchen` route is intended for staff users.

The session role distinguishes the supported account types:

```text
customer
staff
```

The authorization flow is:

```text
Signed out
    ↓
Sign in

Signed in as customer
    ↓
Access denied

Signed in as staff
    ↓
Kitchen dashboard
```

The role must be checked on the server. Customers must not gain staff access simply by manually entering `/kitchen` or manipulating client-side UI.

## Safe `next` Redirects

The sign-in flow supports returning users to an internal route they originally requested.

For example:

```text
/checkout
    ↓
/signin?next=/checkout
    ↓
/checkout after successful sign-in
```

The redirect destination must be validated. External destinations such as:

```text
https://example.com
//example.com
```

must not be accepted as internal navigation paths.

Rejecting unsafe destinations helps prevent open-redirect vulnerabilities. The application should use a safe fallback, such as `/`, when the supplied destination is invalid.

## Security Verification Checklist

Use these cases when verifying the implementation.

### Authentication and sessions

- [ ] Valid demo credentials sign the user in.
- [ ] Invalid credentials are rejected.
- [ ] Sign-out destroys the active session.
- [ ] The session cookie is `httpOnly`.
- [ ] The session cookie is not readable through `document.cookie`.
- [ ] Restarting the server demonstrates the limitation of in-memory sessions.

### Route protection

- [ ] Signed-out users cannot access protected pages.
- [ ] Public pages such as `/menu` remain accessible.
- [ ] The proxy provides the expected navigation redirect.
- [ ] Server-side checks protect sensitive operations independently of the proxy.

### Order ownership

- [ ] A user can retrieve their own orders.
- [ ] A user cannot retrieve another user's order by changing its ID.
- [ ] A user cannot cancel another user's order.
- [ ] The server derives ownership from the authenticated session.

### Staff authorization

- [ ] Customers cannot access staff-only functionality.
- [ ] Staff users can access the kitchen functionality.
- [ ] Authorization is enforced on the server.

### Redirect safety

- [ ] Valid internal `next` paths work.
- [ ] External URLs are rejected.
- [ ] Protocol-relative URLs such as `//example.com` are rejected.

These are verification cases, not a claim that every test has been rerun against the current code.

## Environment Variables

Local environment variables belong in `.env.local`, which should remain untracked by Git.

The project also provides `.env.example` as a template for configuration. It includes placeholders such as:

```text
DATABASE_URL
TELEBIRR_SECRET
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_MAP_KEY
```

A placeholder does not necessarily mean the corresponding integration is implemented or active.

Server secrets must not be exposed to Client Components or browser JavaScript. Variables prefixed with `NEXT_PUBLIC_` are intended to be exposed to the browser and must not contain secrets.

## Current Limitations

This implementation is for learning and demonstration. Before production use, it would need further work, including:

- Secure password hashing
- Persistent session and user storage
- A production database for users and orders
- Rate limiting and abuse protection for sign-in
- Secure secret management
- HTTPS in production
- More complete account, session-expiration, and recovery flows
- Thorough automated security tests

## Key Lessons

```text
Authentication
      +
Sessions
      +
Protected Routes
      +
Authorization
      +
Data Ownership
      +
Server-Side Security
```

The central lesson is that authentication establishes who the user is, while authorization determines what that user is allowed to do. Both must be enforced on the server for sensitive operations.


## Private Routes and Search Crawling — Day 44

The application's `robots.txt` disallows crawling of private or operational routes, including:

- `/cart`
- `/checkout`
- `/orders`
- `/kitchen`
- `/api/`

These rules help guide compliant crawlers, but **`robots.txt` is not an access-control mechanism**. It does not prevent a visitor from opening a URL directly. Authentication and authorization must continue to be enforced by the server.

Private routes are also excluded from the generated sitemap. Sitemap exclusion and crawler directives are SEO configuration, not substitutes for protecting private data.