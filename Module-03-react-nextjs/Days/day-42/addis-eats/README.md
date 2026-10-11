# Addis Eats — Day 42

## Next.js Authentication & Authorization

Addis Eats is a food-ordering application built while learning Next.js App Router.

Day 42 focuses on taking the application from a normal Next.js project to one that understands **users, sessions, private routes, ownership, and roles**.

The main goal is not just making a sign-in form.

The server must also make sure that users can only access and change data they are actually allowed to access.

---

## What Day 42 Adds

* Sign in and sign out
* Server-side sessions
* Secure session cookie
* Protected routes
* Next.js 16 `proxy.js`
* Safe `next` redirects
* User-specific orders
* Order ownership checks
* Protected Server Actions
* Protected Route Handlers
* Staff-only kitchen dashboard
* Server-side validation
* Authorization checks
* Authentication security testing

---

## Routes

| Route          | Access            | Purpose                 |
| -------------- | ----------------- | ----------------------- |
| `/`            | Public            | Home page               |
| `/menu`        | Public            | Browse dishes           |
| `/menu/[id]`   | Public            | View a dish             |
| `/cart`        | Public            | Manage the cart         |
| `/signin`      | Public            | Sign in                 |
| `/checkout`    | Signed in         | Place an order          |
| `/orders`      | Signed in         | View your orders        |
| `/orders/[id]` | Signed in + owner | View one of your orders |
| `/kitchen`     | Staff only        | Kitchen dashboard       |

---

## Authentication Flow

The sign-in process works like this:

```text
User
 ↓
Sign-in form
 ↓
Server Action
 ↓
Check email + password
 ↓
Create session
 ↓
Set httpOnly cookie
 ↓
Redirect to requested page
```

The browser receives a session ID.

The actual session information stays on the server.

---

## Demo Accounts

### Customer

```text
Email: addistesfa@gmail.com
Password: 123456
Role: customer
```

### Staff

```text
Email: adminone@addiseats.com
Password: 123456
Role: staff
```

These credentials are only for this learning project.

---

## Session Security

The session cookie uses:

```js
{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
}
```

The `httpOnly` setting prevents normal browser JavaScript from reading the session cookie.

The `secure` setting is enabled automatically in production.

---

## Protected Routes

`proxy.js` provides a fast redirect for:

```text
/checkout
/orders
/orders/*
```

A signed-out user is redirected to:

```text
/signin?next=/requested/path
```

For example:

```text
/checkout
```

becomes:

```text
/signin?next=/checkout
```

After successful sign-in, the user can return to `/checkout`.

---

## Proxy Is Not the Security Boundary

The proxy is only the first layer.

The application also checks the session inside protected pages, Server Actions, and Route Handlers.

The architecture is:

```text
Proxy
 ↓
Page protection
 ↓
Server Action / Route Handler
 ↓
Authorization
 ↓
Protected operation
```

The server makes the final security decision.

---

## Order Ownership

Orders belong to the user who created them.

The server sets:

```js
userId: session.id
```

instead of trusting a user ID sent by the browser.

When reading an individual order, the application checks:

```text
order exists
+
order belongs to current user
```

This prevents a user from changing an order ID and accessing somebody else's order.

---

## Staff Authorization

The kitchen dashboard requires:

```text
session.role === "staff"
```

A signed-in customer cannot access the staff area.

The server performs this check instead of simply hiding the kitchen link from customers.

---

## Safe Redirects

The sign-in page supports a `next` parameter:

```text
/signin?next=/checkout
```

Only internal paths are accepted.

External redirect targets such as:

```text
https://evil.com
```

and:

```text
//evil.com
```

are rejected.

This prevents an open redirect vulnerability.

---

## API

### Dishes

```text
GET /api/dishes
```

Returns all dishes.

```text
GET /api/dishes/[id]
```

Returns one dish.

Unknown dishes return:

```text
404 Not Found
```

---

### Orders

```text
POST /api/orders
```

Creates an order for the currently signed-in user.

Possible responses:

```text
201 Created
401 Unauthorized
422 Validation Failed
```

---

### Individual Order

```text
GET /api/orders/[id]
```

The server checks the current session and order ownership.

Possible responses:

```text
200 OK
401 Unauthorized
404 Not Found
```

---

## Server Actions

The main authentication-related Server Actions are:

```text
signIn()
signOut()
placeOrder()
cancelOrder()
```

Each protected action gets the current session on the server.

For example, `cancelOrder()`:

```text
Get session
 ↓
Reject signed-out user
 ↓
Find order for current user
 ↓
Reject if not owner
 ↓
Cancel order
```

---

## Validation

Order validation is shared in:

```text
lib/schema.js
```

The server validates:

* name
* phone number
* delivery area
* other order information

Server-side validation is required because browser validation can be bypassed.

---

## Data Storage

For this course project, sessions and orders are stored in memory.

This keeps the authentication flow simple and easy to understand.

The trade-off is that the data can disappear when the server process restarts.

A production application would normally use a persistent database.

---

## Environment Variables

Local server configuration belongs in:

```text
.env.local
```

The current project contains placeholders for:

```text
DATABASE_URL=
TELEBIRR_SECRET=
```

`.env.local` is ignored by Git.

No server secret should be exposed to Client Components or committed to the repository.

---

## Security Tests

Day 42 was tested against several important cases.

### Signed-out request

Trying to access a protected route while signed out redirects to sign in.

### Signed-out API request

Calling the order API without a session returns:

```text
401 Unauthorized
```

### Wrong order owner

An authenticated user requesting another user's order receives:

```text
404 Not Found
```

### Open redirect

Unsafe `next` values such as:

```text
https://evil.com
```

are rejected.

### Staff authorization

A customer attempting to access `/kitchen` receives an access-denied response.

### Session cookie

The session cookie cannot be read through:

```js
document.cookie
```

because it is `httpOnly`.

---

## Project Structure

```text
addis-eats/
├── app/
│   ├── api/
│   │   ├── dishes/
│   │   └── orders/
│   ├── cart/
│   ├── checkout/
│   ├── kitchen/
│   ├── menu/
│   ├── orders/
│   ├── signin/
│   ├── actions.js
│   ├── layout.js
│   ├── Providers.jsx
│   └── UserMenu.jsx
│
├── lib/
│   ├── dishes.js
│   ├── orders.js
│   ├── schema.js
│   ├── session.js
│   └── users.js
│
├── proxy.js
├── AUTH.md
├── BOUNDARY.md
├── DATA.md
├── README.md
└── STRATEGY.md
```

---

## Documentation

The Day 42 architecture is documented in:

```text
AUTH.md
```

Authentication and Server/Client boundaries:

```text
BOUNDARY.md
```

Rendering and security decisions:

```text
STRATEGY.md
```

Data and session flow:

```text
DATA.md
```

---

## Running the Project

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## Production Build

The project should be checked with:

```powershell
npm run build
```

A successful build confirms that the Next.js application can compile for production.

---

## Tech Stack

* Next.js
* React
* JavaScript
* Next.js App Router
* Server Components
* Client Components
* Server Actions
* Route Handlers
* Tailwind CSS
* Git / GitHub

---

## Final Lesson

Day 42 brings together the most important authentication ideas:

```text
Authentication
      +
Sessions
      +
Cookies
      +
Protected Routes
      +
Authorization
      +
Ownership
      +
Server Actions
      +
Route Handlers
      +
Server Validation
```

The biggest lesson is:

> **The browser controls the interface. The server controls access.**

That is the foundation of the authentication architecture in Addis Eats.
