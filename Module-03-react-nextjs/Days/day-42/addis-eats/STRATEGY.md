# Day 42 — Authentication & Authorization Strategy

## Overview

Day 42 takes the Addis Eats application from a normal food-ordering application to one that understands **who is using it and what that user is allowed to do**.

The main goal is not just adding a sign-in page.

The application needs to protect private pages, protect data operations, check order ownership, and keep authentication logic on the server.

The basic flow is:

```text
Sign in
   ↓
Create session
   ↓
Store session ID in secure cookie
   ↓
Identify user on the server
   ↓
Check authorization
   ↓
Allow or reject the operation
```

---

## Authentication Strategy

Addis Eats uses a simple server-side session model.

When a user signs in:

1. The email and password are checked.
2. A random session ID is generated.
3. The session ID is stored in the server-side session store.
4. The session ID is placed in an `httpOnly` cookie.
5. The user is redirected to the page they originally requested.

The browser therefore stores only the session identifier.

The actual user information remains on the server.

---

## Why Use a Session?

There are two common approaches to authentication:

```text
Database session
        OR
Signed token / JWT
```

For this learning project, we use a **server-side session**.

The application creates a random session ID and maps it to the current user.

Conceptually:

```text
session-abc123 → user-1
session-def456 → staff-1
```

When a request arrives, the server reads the session cookie and looks up the session.

This makes it easy to understand where the authentication state lives.

---

## Session Cookie

The session cookie is configured with:

```js
{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
}
```

### `httpOnly`

JavaScript running in the browser cannot read the session cookie.

This was verified with:

```js
document.cookie
```

The session cookie does not appear there.

### `secure`

In production, the cookie is sent only over HTTPS.

Local development does not require the `secure` flag because the application runs over HTTP.

### `sameSite`

`lax` provides a reasonable default for this application and helps reduce unwanted cross-site cookie requests.

### `maxAge`

The session lasts for seven days unless it is destroyed earlier.

---

## Private Routes

The application has routes that should only be available to signed-in users.

Current private routes include:

```text
/checkout
/orders
/orders/[id]
```

The staff-only route is:

```text
/kitchen
```

The sign-in page is public:

```text
/signin
```

The menu and other public parts of the application remain accessible without an account.

---

## Proxy Strategy

Next.js 16 uses `proxy.js` for this request-level routing layer.

The proxy matcher is intentionally narrow:

```js
export const config = {
  matcher: ["/checkout", "/orders/:path*"],
};
```

The proxy checks whether a session cookie exists.

If there is no session, the request is redirected to the sign-in page.

For example:

```text
/checkout
```

becomes:

```text
/signin?next=/checkout
```

This provides a good user experience because the user can sign in and continue where they left off.

---

## Why the Proxy Is Not Enough

The proxy only checks whether a session cookie exists.

It does not perform the complete authorization logic for every operation.

A request could potentially reach a Server Action or Route Handler directly.

Therefore:

> The proxy is a navigation guard, not the final security boundary.

The server still checks the session inside protected pages, actions, and handlers.

The application uses three layers:

```text
             Proxy
               ↓
        Page / Layout
               ↓
    Server Action / Handler
```

Each layer has a different responsibility.

---

## Page-Level Protection

Protected pages call:

```js
const session = await getSession();
```

If no session exists, the page redirects to sign in.

For example, the orders page checks the session before loading orders.

This also makes the page itself responsible for protecting its content.

---

## Order Ownership

Authentication alone is not enough.

A signed-in user should only see and modify their own orders.

For that reason, order queries are scoped by both:

```text
order ID
+
current user's ID
```

The helper:

```js
getOrderForUser(orderId, userId)
```

returns the order only when the order belongs to that user.

Conceptually:

```text
Request
  ↓
Get session
  ↓
Get current user ID
  ↓
Find order
  ↓
Check order.userId === session.id
  ↓
Allow or reject
```

This protects against an important attack:

```text
User A → changes /orders/1 to /orders/2
```

Changing the ID must not reveal User B's order.

---

## Protecting Writes

Every important write operation checks authentication again.

For example, `cancelOrder()` does not trust the client.

It:

1. Gets the current session.
2. Rejects signed-out users.
3. Looks up the requested order for that user.
4. Rejects the request when the order is not owned by that user.
5. Cancels the order only after those checks pass.

The same principle applies to order creation.

The server sets:

```js
userId: session.id
```

instead of trusting a `userId` supplied by the browser.

This prevents a client from pretending to create an order for another account.

---

## Order API Strategy

The order API follows the same security model.

### Signed out

```text
GET /api/orders/1
```

returns:

```text
401 Unauthorized
```

### Signed in but not the owner

The API returns:

```text
404 Not Found
```

This means the authenticated user cannot retrieve another user's order.

### Owner

The owner receives the requested order.

The important part is that the API performs the ownership check on the server.

---

## Staff Authorization

The kitchen dashboard is different from normal authenticated pages.

Being signed in is not enough.

The server checks:

```js
session.role === "staff"
```

A customer receives an access-denied response/page.

A staff account can access:

```text
/kitchen
```

This is authorization based on role.

The application does not rely on hiding the kitchen link from customers.

The server makes the final decision.

---

## Safe `next` Redirects

The sign-in flow supports:

```text
/signin?next=/checkout
```

After successful authentication, the user can return to `/checkout`.

However, the application does not blindly redirect to whatever value is supplied.

The redirect must be an internal path.

These are rejected:

```text
https://evil.com
//evil.com
```

The check is:

```js
if (!next.startsWith("/") || next.startsWith("//")) {
  redirect("/");
}
```

This prevents the sign-in page from becoming an open redirect.

---

## Rendering Strategy

Day 42 introduces authentication, which means rendering can now depend on the current request.

For example:

```js
const session = await getSession();
```

reads the request's cookies.

Therefore, authenticated pages should be treated as request-dependent rather than assuming they are purely static.

The important distinction is:

```text
Public content
    ↓
Can often be cached or statically rendered

User-specific content
    ↓
Depends on the current session
    ↓
Must be handled on the server
```

Day 42 therefore prioritizes correct authentication behavior over forcing every route into a static rendering strategy.

---

## Data Storage Strategy

The course project currently uses simple in-memory stores for sessions and orders.

This keeps the authentication concepts easy to see without introducing a full database setup.

The trade-off is that data is lost when the server process restarts.

A production application would normally use a persistent database.

The `.env.local` file is prepared for server-side configuration such as:

```text
DATABASE_URL=
TELEBIRR_SECRET=
```

These values are not committed to Git.

---

## Security Testing Strategy

Day 42 includes several deliberate attack tests.

### Attack 1 — Server Action while signed out

Try to call a protected action without a session.

Expected result:

```text
Request rejected
```

The session check inside the Server Action stops it.

---

### Attack 2 — Access another user's order

Sign in as one account and request another account's order ID.

Expected result:

```text
Order not found
```

The ownership check stops the request.

---

### Attack 3 — Open redirect

Try:

```text
/signin?next=https://evil.com
```

or:

```text
/signin?next=//evil.com
```

Expected result:

```text
/
```

The unsafe redirect is rejected.

---

### Attack 4 — Customer accesses staff area

Sign in as a customer and visit:

```text
/kitchen
```

Expected result:

```text
Access denied
```

The server-side role check stops the request.

---

## What the Client Is Allowed to Do

The browser can:

* show the sign-in form
* submit forms
* change cart quantities
* display pending states
* request data
* start Server Actions

But the browser cannot decide:

```text
"this user owns this order"
```

or:

```text
"this user is staff"
```

Those decisions belong to the server.

---

## Final Architecture

The final security architecture is:

```text
                    Browser
                       │
                       ↓
                 Sign-in Form
                       │
                       ↓
                Server Action
                       │
                       ↓
                 Create Session
                       │
                       ↓
              httpOnly Session Cookie
                       │
                       ↓
                    Proxy
                       │
              ┌────────┴────────┐
              ↓                 ↓
        Public Route       Private Route
                                  │
                                  ↓
                            getSession()
                                  │
                                  ↓
                         Authentication
                                  │
                                  ↓
                         Authorization
                                  │
                    ┌─────────────┴─────────────┐
                    ↓                           ↓
              Customer Data                Staff Data
                    │                           │
                    ↓                           ↓
             Ownership Check              Role Check
```

The main lesson from Day 42 is simple:

> **Authentication tells us who the user is. Authorization decides what that user is allowed to do.**

And the server must make those decisions.
