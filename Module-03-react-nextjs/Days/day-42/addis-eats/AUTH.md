# Addis Eats Authentication

## Overview

Day 42 adds authentication and authorization to Addis Eats.

The goal was not just to add a Sign In button, but to understand what actually happens after a user signs in and how the application makes sure that users can only access the things they are allowed to access.

The authentication system currently includes:

* Sign in with email and password
* Sign out
* Server-side sessions
* A secure session cookie
* Protected routes
* User-owned orders
* Staff-only access
* Server-side authorization
* Safe redirects after sign in

This is a learning project, so some parts are intentionally simple compared with a production application.

---

## Demo Accounts

The application currently has two demo users in `lib/users.js`.

### Customer

```text
Email: addistesfa@gmail.com
Password: 123456
Role: customer
ID: user-1
```

### Staff

```text
Email: adminone@addiseats.com
Password: 123456
Role: staff
ID: staff-1
```

These accounts are only for demonstrating the authentication features.

The passwords are currently stored as plain text because the main goal of this project is to learn the authentication and authorization flow. A real production application should never store passwords this way and should use secure password hashing.

---

## How Sign In Works

The sign-in process follows this flow:

```text
Sign In Form
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

After a successful sign-in, the server creates a session for the user.

The session contains basic information about the authenticated user:

```text
id
name
email
role
```

The password is not placed inside the session.

---

## Sessions

Session-related code is kept in:

```text
lib/session.js
```

The main functions are:

```text
createSession()
getSession()
destroySession()
```

When a session is created, the server generates a random session ID and stores the user information on the server.

The browser only receives the session ID through a cookie.

The basic idea is:

```text
Browser
   ↓
session cookie
   ↓
session ID
   ↓
Server session store
   ↓
User information
```

This means the browser does not need to contain the user's role or other trusted authentication information.

---

## Session Cookie

The session cookie is called:

```text
session
```

It is configured with:

```js
{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/"
}
```

### Why these settings matter

**`httpOnly`**

JavaScript running in the browser cannot read the session cookie.

This was tested using:

```js
document.cookie
```

The session cookie does not appear there.

**`secure`**

In production, the cookie is only sent over HTTPS.

During local development, the application runs over HTTP, so `secure` is false.

**`sameSite: "lax"`**

This provides additional protection against certain cross-site request scenarios while still allowing normal navigation.

**`maxAge`**

The session lasts for seven days before the cookie expires.

---

## Where Sessions Are Stored

For this learning project, sessions are stored in an in-memory `Map`.

This keeps the example simple and makes it easier to understand how sessions work.

The downside is that the sessions disappear if the server process restarts.

A production application would normally use a persistent session store or another production-ready authentication system.

---

## Protected Routes

The application has several routes that require authentication:

```text
/checkout
/orders
/orders/[id]
```

The root `proxy.js` checks for the session cookie before these routes are reached.

If the user is not signed in, they are redirected to:

```text
/signin?next=/requested-page
```

For example:

```text
/checkout
```

becomes:

```text
/signin?next=/checkout
```

This allows the application to send the user back to the page they originally wanted after signing in.

---

## The Proxy Is Not the Real Security Boundary

The proxy is useful for quickly redirecting users who are not signed in, but it is not the only security check.

The application follows three layers:

```text
Proxy
  ↓
Fast redirect

Page / Layout
  ↓
Protect the screen

Server Action / Route Handler
  ↓
Actual security check
```

This is important because a user can bypass the user interface and send requests directly.

For that reason, important authorization checks are performed on the server.

---

## Order Ownership

Orders are connected to the user who created them.

When an order is created, the server uses:

```js
userId: session.id
```

The server does not trust a user ID sent by the browser.

This means the application knows which user actually owns the order.

The order list uses:

```text
getOrdersByUser(userId)
```

and individual orders use:

```text
getOrderForUser(orderId, userId)
```

For example, if Order #1 belongs to `user-1`, another user cannot simply change the URL to:

```text
/orders/1
```

and see it.

The server checks the order's owner against the current session.

---

## Cancelling Orders

The `cancelOrder()` Server Action also checks ownership.

Before an order is cancelled, the server:

1. Gets the current session.
2. Checks that the order belongs to that user.
3. Only then cancels the order.

The client interface is not trusted to provide authorization.

Even if someone tries to call the action directly, the server still performs the ownership check.

---

## Order API Security

The order API follows the same idea.

### `POST /api/orders`

Creating an order requires a valid session.

If the user is not signed in:

```text
401 Unauthorized
```

If the order data is invalid:

```text
422 Unprocessable Entity
```

If everything is valid:

```text
201 Created
```

The server gets the user's ID from the session instead of trusting a `userId` sent by the client.

### `GET /api/orders/[id]`

The API also checks ownership when retrieving an individual order.

If a signed-in user tries to access another user's order, the API returns:

```text
404 Not Found
```

This prevents the order data from being exposed.

---

## Staff Authorization

Addis Eats also has a staff-only route:

```text
/kitchen
```

The session contains the user's role.

A customer has:

```text
role: customer
```

while the staff account has:

```text
role: staff
```

The kitchen page checks the role on the server.

The result is:

```text
Not signed in
    ↓
Sign in

Signed in + customer
    ↓
Access denied

Signed in + staff
    ↓
Kitchen Dashboard
```

The staff restriction does not depend on simply hiding a link from customers.

A customer can manually type `/kitchen`, but the server still refuses access.

---

## Safe `next` Redirects

The application supports returning users to the page they originally requested.

For example:

```text
/checkout
```

can redirect to:

```text
/signin?next=/checkout
```

After successful authentication, the user returns to `/checkout`.

However, external URLs are not accepted.

Examples such as:

```text
https://evil.com
```

or:

```text
//evil.com
```

are rejected and the user is sent to:

```text
/
```

This prevents the application from becoming an open redirect.

---

## Security Tests

The authentication system was tested against the main cases from Day 42.

### Private routes

* Signed-out users are redirected to sign in.
* `/checkout` is protected.
* `/orders` is protected.
* `/orders/[id]` is protected.
* Public routes such as `/menu` remain accessible.

### Order ownership

* A user can see their own orders.
* A user cannot see another user's order by changing the order ID.
* A user cannot cancel another user's order.

### API security

* Signed-out API access returns `401`.
* An authenticated user can access their own order.
* An authenticated user cannot access another user's order.

### Staff authorization

* Customers cannot access `/kitchen`.
* Staff users can access `/kitchen`.
* The role check happens on the server.

### Session security

* The session cookie is `httpOnly`.
* `document.cookie` cannot read the session cookie.
* The session ID is stored in the cookie instead of putting the user's trusted role directly in the browser.

### Redirect security

* Internal `next` paths work.
* External `next` URLs are rejected.
* Protocol-relative URLs such as `//evil.com` are rejected.

---

## Environment Variables

Server-side environment variables are kept in:

```text
.env.local
```

The file is ignored by Git and is not committed to the repository.

The current project has placeholders for:

```text
DATABASE_URL
TELEBIRR_SECRET
```

These are intended for server-side use.

Secrets should never be exposed to Client Components or browser JavaScript.

---

## Current Limitations

This authentication system is designed for learning and demonstration.

There are still things that would need to change before using this exact implementation in a real production application.

The main limitations are:

* Passwords should be securely hashed.
* Sessions should be stored in persistent shared storage instead of memory.
* A real database should be used for users and orders.
* Sign-in attempts should have rate limiting.
* Production secrets should be stored securely.
* HTTPS should be used in production.
* More complete account and session management should be added.

The important goal of Day 42 is understanding the security boundaries:

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

That is the foundation the application can build on later.
