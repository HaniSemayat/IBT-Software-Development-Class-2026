# Addis Eats — Data and Session Flow

## Overview

Day 42 introduced authentication and user-specific order data to Addis Eats. Day 43 builds on that foundation with server-rendered initial menu data.

The application manages several kinds of data:

- Users
- Sessions
- Dishes
- Orders
- Validation rules

The central security rule is that user identity comes from the server-side session. The browser must not be trusted to decide which user it represents.

## Users

Demo user data is defined in:

```text
lib/users.js
```

Each demo user has fields such as:

```js
{
  id,
  name,
  email,
  password,
  role
}
```

The application distinguishes customer and staff roles.

Demo credentials are intentionally omitted from this document to avoid unnecessarily publishing account details.

**Learning limitation:** The current demo implementation stores passwords in plain text. A production application must use secure password hashing and appropriate user storage.

## Sessions

Session logic is implemented in:

```text
lib/session.js
```

When a user successfully signs in, the server creates a random session ID and associates it with the user's session data.

Conceptually:

```text
Session ID
    |
    v
Server-side session store
    |
    v
User information
```

The browser receives the session ID through a cookie. The actual session data remains on the server.

The current session store uses an in-memory `Map`. Session data is lost when the server process restarts and is not shared across multiple server instances.

## Session Data

The server keeps basic information for the authenticated user:

```js
{
  id,
  name,
  email,
  role
}
```

This allows the server to determine:

- Who is signed in
- The user's ID
- Whether the user has the customer or staff role

The password should not be included in the session.

## Session Cookie

The browser stores the session ID in a cookie named:

```text
session
```

The cookie configuration includes:

```js
{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/"
}
```

The `httpOnly` option prevents browser JavaScript from reading the cookie directly. Therefore, the session cookie should not appear in:

```js
document.cookie
```

The browser can still send the cookie with requests so that the server can resolve the session.

Cookie settings are one part of session security; server-side authentication and authorization checks are still required.

## Sign-In and Session Flow

The sign-in process follows this sequence:

```text
User enters email and password
              |
              v
Sign-in Server Action
              |
              v
Find user and check password
              |
              v
Create session
              |
              v
Set session cookie
              |
              v
Redirect user
```

When the user later requests a protected page:

```text
Browser
   |
   v
Session cookie
   |
   v
getSession()
   |
   v
Session store
   |
   v
Current user
```

## Orders

Order data is implemented in:

```text
lib/orders.js
```

An order contains information such as:

```js
{
  id,
  userId,
  status,
  name,
  phone,
  area,
  notes,
  items,
  total
}
```

The `userId` field associates the order with its owner.

## Order Ownership

The server must not trust a `userId` supplied by the browser.

When an authenticated user creates an order, the server derives the owner from the current session:

```js
userId: session.id
```

A client cannot become another user simply by submitting a different user ID.

## Reading Orders

The application uses this helper to retrieve orders for a user:

```js
getOrdersByUser(userId)
```

Conceptually:

```text
All orders
    |
    v
Filter by user ID
    |
    v
Current user's orders
```

For an individual order, the application uses:

```js
getOrderForUser(orderId, userId)
```

The server checks whether the order exists and belongs to the requested user before returning it.

For example, if an order belongs to one customer, another customer must not be able to retrieve it by changing the URL.

The ownership check compares the order owner with the authenticated user's ID.

## Order Cancellation

Order cancellation is handled by the `cancelOrder()` Server Action.

The expected flow is:

```text
Cancellation request
         |
         v
Get current session
         |
         v
Check authentication
         |
         v
Find order for current user
         |
         v
Verify ownership
         |
         v
Cancel order
         |
         v
Revalidate affected pages
```

Ownership must be checked before the order is changed. Hiding or disabling a button in the browser is not a substitute for server-side authorization.

## Validation

Shared order validation is defined in:

```text
lib/schema.js
```

The server validates order information before creating an order. Current validation includes:

- Name is required.
- Name must meet the minimum length.
- The phone number must use the expected Ethiopian format.
- Delivery area is required.
- Unavailable phone numbers are rejected.

Browser validation improves the user experience, but it can be bypassed. The server must validate incoming data independently.

## Server Action Data Flow

The checkout form submits data to:

```text
placeOrder()
```

The Server Action is responsible for:

1. Retrieving the current session.
2. Rejecting unauthenticated requests when authentication is required.
3. Building the order using the authenticated user's ID.
4. Validating the order data.
5. Returning field errors when validation fails.
6. Creating the order when valid.
7. Revalidating affected pages.

The browser does not determine the order owner. The server does.

## Order API

The endpoint:

```text
POST /api/orders
```

uses the current session and validates the incoming order.

The expected flow is:

```text
Request
   |
   v
getSession()
   |
   v
401 if not authenticated
   |
   v
Build order using session ID
   |
   v
Validate data
   |
   v
422 if invalid
   |
   v
Create order
   |
   v
201 Created
```

The Server Action and API follow the same basic security principle: authenticate the user, derive ownership on the server, and validate the data.

## Order API by ID

The endpoint:

```text
GET /api/orders/[id]
```

must also check authentication and order ownership.

```text
Request
   |
   v
getSession()
   |
   v
401 if not authenticated
   |
   v
getOrderForUser(id, session.id)
   |
   v
404 if unavailable to this user
   |
   v
Return authorized order
```

This prevents users from reading another user's order by changing its ID.

## Dishes

Dish data is defined separately in:

```text
lib/dishes.js
```

The menu can therefore display dish information independently of user authentication.

The application exposes dish data through:

```text
GET /api/dishes
GET /api/dishes/[id]
```

An unknown dish returns `404 Not Found`, with an error response such as:

```json
{
  "error": "No such dish"
}
```

## Day 43 — Initial Menu Data

Day 43 changes how the initial menu data reaches the interface.

Instead of relying entirely on a client-side request for the initial menu, the menu Server Component retrieves the initial dish data directly and passes it to the client-side search interface.

```text
Menu Server Component
          |
          v
Read initial dish data
          |
          v
Pass initial data as props
          |
          v
Render initial menu
          |
          v
Client-side search and pagination
```

The dishes API remains available for API consumers and interactive operations such as searching or pagination.

This approach avoids an unnecessary request from the server-rendered menu component to its own API for the initial data.

## In-Memory Storage

The learning project currently uses in-memory storage for sessions and orders.

The data exists while the server process is running. Restarting the process can clear this data.

In-memory storage is useful for understanding the data flow, but a production application would normally use persistent storage and appropriate transaction and concurrency handling.

## Environment Variables

Local configuration belongs in:

```text
.env.local
```

The project provides `.env.example` as a configuration template. It includes placeholders such as:

```text
DATABASE_URL
TELEBIRR_SECRET
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_MAP_KEY
```

A placeholder does not necessarily mean that an integration is currently implemented or active.

The local environment file should remain untracked. Server secrets must not be exposed to Client Components or committed to the repository. Variables prefixed with `NEXT_PUBLIC_` are intended for browser exposure and must not contain secrets.

## Data Security Rules

1. **Identify users from the session.** Do not trust client-supplied identity.
2. **Scope user data.** Retrieve only orders the current user is authorized to access.
3. **Check ownership before writes.** Verify permissions before cancellation or other sensitive changes.
4. **Validate on the server.** Do not rely exclusively on browser validation.
5. **Keep secrets server-side.** Never expose private credentials to the browser.
6. **Protect API operations.** Route Handlers need their own authentication and authorization checks.

## Final Data Flow

The main authenticated order flow is:

```text
Sign in
   |
   v
Create session
   |
   v
Session cookie
   |
   v
getSession()
   |
   v
Current user
   |
   +----------------------+
   |                      |
   v                      v
Create order          Read order
   |                      |
   v                      v
Use session ID        Check ownership
   |                      |
   v                      v
Validate and save     Return authorized data
```

The key idea is simple: **user identity comes from the server-side session, not from data supplied by the browser.**


## Day 44 — SEO and Dish Data Flow

The shared dish data in `lib/dishes.js` also supports search metadata and structured data.

```text
lib/dishes.js
      |
      +--------------------+
      |                    |
      v                    v
Dish page             generateMetadata()
      |                    |
      v                    v
Visible dish details   Title and description
      |
      +--------------------+
      |                    |
      v                    v
MenuItem JSON-LD      Open Graph image
                           |
                           v
                    Social sharing preview
```

The generated sitemap uses the available public routes and dish data to list the homepage, menu, and individual dish pages.

The `robots.txt` file points crawlers to the sitemap and provides crawler directives for private and operational routes. These directives do not replace authentication or authorization.

Local verification confirmed that the sitemap is valid XML and contains 11 URLs, including the homepage, menu, and nine dish pages. The sampled dish pages also returned distinct titles, descriptions, and canonical URLs.

Production verification remains necessary to confirm that canonical URLs and social-preview image URLs use the deployed site origin.