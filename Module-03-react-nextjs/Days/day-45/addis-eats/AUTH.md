# Addis Eats — Authentication and Authorization

## Overview

Day 45 consolidates authentication and authorization concepts from Days 42–44 into the Addis Eats Next.js application.

The authentication system demonstrates:

- Sign-in and sign-out
- Customer account registration
- Server-side sessions
- HTTP-only session cookies
- Protected routes
- User-owned orders
- Staff-only access
- Server-side authorization
- Safe redirects after sign-in
- Server-side validation for sensitive operations

This is a learning project. Its current in-memory storage and authentication design are not suitable for production use without further security and persistence improvements.

## Authentication Routes

| Route | Access | Purpose |
|---|---|---|
| `/signin` | Public | Sign in to an existing account |
| `/signup` | Public | Create a customer account |
| `/checkout` | Signed in | Submit an order |
| `/orders` | Signed in | View the current user's orders |
| `/orders/[id]` | Signed in + owner | View an individual order |
| `/kitchen` | Staff only | Access kitchen functionality |

The homepage, menu, and individual dish pages remain public.

## Demo Users and Registration

Demo user data is defined in:

```text
lib/users.js
```

A user contains fields such as:

```js
{
  id,
  name,
  email,
  password,
  role
}
```

The application distinguishes between customer and staff roles.

The registration flow collects a name, email address, and password. Registration validation should reject invalid input, require a password of at least eight characters, and prevent duplicate email addresses.

Newly registered accounts receive the customer role. Registration must not allow a user to assign themselves a staff role.

Demo credentials are intentionally omitted from this documentation.

**Security limitation:** The current learning implementation stores passwords in plain text and uses in-memory user data. Production authentication must use a suitable password-hashing algorithm, persistent storage, and additional protections against abuse.

## How Sign-In Works

The sign-in flow is:

```text
Sign-In Form
     ↓
signIn Server Action
     ↓
Find user by email
     ↓
Verify submitted password
     ↓
Create session
     ↓
Set session cookie
     ↓
Redirect to a safe internal destination
```

The sign-in Server Action is implemented in:

```text
app/actions.js
```

After successful authentication, the session contains basic user information:

```js
{
  id,
  name,
  email,
  role
}
```

The password must not be included in the session.

Invalid credentials should return an appropriate error without creating a session.

## Account Registration

The registration interface belongs in:

```text
app/signup/page.js
app/signup/SignUpForm.jsx
```

The registration Server Action validates submitted data on the server before creating an account.

The intended flow is:

```text
Registration Form
        ↓
signUp Server Action
        ↓
Validate name, email, and password
        ↓
Check for an existing email
        ↓
Create customer account
        ↓
Redirect to sign in
```

The server must perform validation independently of browser-side constraints. A client can bypass HTML validation and submit requests directly.

Registration should not create a staff account or accept a client-supplied role.

The user store is currently in memory. Accounts created during a running process may not survive a server restart and may not be shared across separate server instances.

## Sessions

Session logic is implemented in:

```text
lib/session.js
```

The primary functions are:

```js
createSession()
getSession()
destroySession()
```

The application generates a random session identifier and associates it with session data stored on the server.

```text
Browser
   ↓
Session cookie
   ↓
Session ID
   ↓
Server-side session store
   ↓
Authenticated user
```

The current session store is an in-memory `Map`.

This has important limitations:

- Sessions are lost when the server process restarts.
- Session data is not automatically shared between server instances.
- It does not provide persistent session management.

A production application needs persistent session storage or another suitable authentication architecture.

## Session Cookie

The session cookie is named:

```text
session
```

Its configuration includes:

```js
{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/"
}
```

The options serve different purposes:

- `httpOnly` prevents ordinary browser JavaScript from reading the cookie.
- `secure` restricts cookie transmission to HTTPS when enabled in production.
- `sameSite: "lax"` helps mitigate certain cross-site request scenarios.
- `maxAge` sets a seven-day cookie lifetime.
- `path: "/"` makes the cookie available across application routes.

The cookie should not appear in:

```js
document.cookie
```

This is consistent with the `httpOnly` setting, but it does not independently prove that the entire authentication system is secure.

Cookie configuration also does not eliminate the need to consider CSRF protection, session expiration, and session invalidation.

## Protected Routes

The application protects these routes:

```text
/checkout
/orders
/orders/[id]
/kitchen
```

The root `proxy.js` provides an early navigation guard for the protected route patterns configured in its matcher.

When a signed-out user requests a protected route, the application can redirect them to a sign-in URL such as:

```text
/signin?next=/checkout
```

After successful sign-in, the user can return to the requested internal destination.

The proxy checks for a session cookie. It does not replace complete session validation or authorization checks.

**The proxy is a navigation guard, not the final security boundary.**

Protected Server Components, Server Actions, and Route Handlers must perform their own appropriate server-side checks.

## Order Ownership

Orders must be associated with the authenticated user on the server.

The relevant helpers include:

```js
getOrdersByUser(userId)
getOrderForUser(orderId, userId)
```

When creating an order, the server derives the owner from the current session rather than trusting a user ID submitted by the browser.

```js
userId: session.id
```

When a user requests an individual order, the server verifies that the order belongs to the authenticated user.

Changing an order ID in the URL must not grant access to another user's order.

The same ownership rule applies to order cancellation and private order API responses.

## Cancelling Orders

The `cancelOrder()` Server Action must authorize the request before changing an order.

The expected sequence is:

1. Retrieve the current session.
2. Reject the request if authentication is required but no session exists.
3. Retrieve the order using the authenticated user's ID.
4. Reject access if the order does not belong to that user.
5. Cancel the authorized order.
6. Revalidate the affected pages.

A hidden or disabled button is not a substitute for server-side authorization.

## Order API Security

### `POST /api/orders`

Order creation requires authentication and server-side validation.

| Status | Meaning |
|---|---|
| `201 Created` | Order created successfully |
| `400 Bad Request` | Malformed request body |
| `401 Unauthorized` | Authentication required |
| `422 Unprocessable Entity` | Submitted data is invalid |

The server must derive order ownership from the authenticated session and calculate trusted order values on the server.

A client-supplied `userId` must not determine who owns an order.

### `GET /api/orders/[id]`

The handler must authenticate the request and check order ownership before returning private order information.

An order that does not exist or is not available to the current user can return `404 Not Found`, avoiding unnecessary disclosure about another user's data.

## Staff Authorization

The `/kitchen` route is intended for staff users.

Supported roles are:

```text
customer
staff
```

The authorization check uses the authenticated session:

```js
session.role === "staff"
```

The intended access behavior is:

```text
Signed out
    ↓
Sign in required

Signed in as customer
    ↓
Access denied

Signed in as staff
    ↓
Kitchen dashboard
```

The server must enforce staff permissions. Customers must not gain access by entering `/kitchen` directly or manipulating browser-side state.

In a production system, role assignments must come from trusted server-side user records and must not be controlled by registration input.

## Safe `next` Redirects

The sign-in flow supports returning users to an internal route.

For example:

```text
/checkout
    ↓
/signin?next=/checkout
    ↓
/checkout after successful sign-in
```

The redirect destination must be validated before redirection.

Unsafe examples include:

```text
https://example.com
//example.com
```

The application rejects external and protocol-relative destinations and uses `/` as a safe fallback when the supplied destination is invalid.

This helps prevent open-redirect vulnerabilities.

## Security Verification Checklist

These are verification cases, not a claim that every test has been rerun against the current code.

### Authentication and Registration

- [ ] Valid demo credentials sign the user in.
- [ ] Invalid credentials are rejected.
- [ ] Sign-out destroys the active session.
- [ ] Valid registration creates a customer account.
- [ ] Duplicate email addresses are rejected.
- [ ] Invalid email addresses are rejected.
- [ ] Passwords shorter than the minimum length are rejected.
- [ ] Newly registered users can sign in.
- [ ] Registration cannot assign a staff role.
- [ ] The session cookie is `httpOnly`.
- [ ] The session cookie is not readable through `document.cookie`.

### Route Protection

- [ ] Signed-out users cannot access protected operations.
- [ ] Public pages such as `/menu` remain accessible.
- [ ] The proxy provides the expected navigation redirect.
- [ ] Server-side checks protect sensitive operations independently of the proxy.
- [ ] Customers cannot access staff-only functionality.
- [ ] Authorized staff can access the kitchen functionality.

### Order Ownership

- [ ] A user can retrieve their own orders.
- [ ] A user cannot retrieve another user's order by changing its ID.
- [ ] A user cannot cancel another user's order.
- [ ] The server derives ownership from the authenticated session.
- [ ] Signed-out order creation is rejected.

### Redirect Safety

- [ ] Valid internal `next` paths work.
- [ ] External URLs are rejected.
- [ ] Protocol-relative URLs such as `//example.com` are rejected.
- [ ] Invalid destinations fall back to a safe internal route.

## Environment Variables

Server-side environment variables belong in:

```text
.env.local
```

The local environment file should remain untracked by Git.

The project includes `.env.example` as a template for configuration. It may contain placeholders such as:

```text
DATABASE_URL
TELEBIRR_SECRET
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_MAP_KEY
```

A placeholder does not necessarily mean the corresponding integration is implemented or active.

Variables prefixed with `NEXT_PUBLIC_` are intended to be exposed to browser code and must not contain secrets.

## Current Limitations

Before production use, the authentication system would need further work, including:

- Secure password hashing
- Persistent user, session, and order storage
- Production-grade session management and expiration
- Rate limiting and sign-in abuse protection
- Secure secret management
- HTTPS in production
- Account recovery and other lifecycle flows
- Appropriate CSRF protections
- Automated authentication and authorization tests
- Persistent, trusted role management

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
Server-Side Validation
      +
Server-Side Security
```

Authentication establishes who the user is. Authorization determines what that user is allowed to do.

Both must be enforced on the server for sensitive operations.

## Private Routes and Search Crawling — Day 44

The application's `robots.txt` provides crawler directives for private or operational routes, including:

- `/cart`
- `/checkout`
- `/orders`
- `/kitchen`
- `/api/`

These directives guide compliant crawlers but do not prevent direct access to a URL.

Private routes and data must remain protected by authentication and authorization. Private routes are also excluded from the generated sitemap; neither sitemap exclusion nor crawler directives are access-control mechanisms.
