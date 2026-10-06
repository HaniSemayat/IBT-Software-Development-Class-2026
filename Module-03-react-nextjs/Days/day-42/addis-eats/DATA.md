# Day 42 — Data & Session Flow

## Overview

Day 42 adds authentication and user-specific order data to Addis Eats.

The application now has several types of data:

```text
Users
Sessions
Dishes
Orders
Validation rules
```

The important part is that user-specific data is always connected to the **current session**.

A client should never be trusted to tell the server which user it is acting as.

---

# Users

Demo users are stored in:

```text
lib/users.js
```

The current demo accounts are:

| Name        | Email                                                   | Role     |
| ----------- | ------------------------------------------------------- | -------- |
| Addis Tesfa | [addistesfa@gmail.com](mailto:addistesfa@gmail.com)     | customer |
| Admin One   | [adminone@addiseats.com](mailto:adminone@addiseats.com) | staff    |

Each user has:

```js
{
  id,
  name,
  email,
  password,
  role
}
```

Example:

```text
user-1
Addis Tesfa
addistesfa@gmail.com
customer
```

and:

```text
staff-1
Admin One
adminone@addiseats.com
staff
```

These accounts are only for the learning project.

The passwords are currently stored directly in the demo user data so the authentication flow is easy to understand.

A real application should use password hashing and a proper user database.

---

# Sessions

Session logic lives in:

```text
lib/session.js
```

When a user successfully signs in, the server creates a random session ID.

The session store maps that ID to the user:

```text
session ID
    ↓
user information
```

For example:

```text
random-session-id → user-1
```

The browser receives only the session ID through the session cookie.

The session data itself remains on the server.

---

# Session Data

The server stores this information for the signed-in user:

```js
{
  id,
  name,
  email,
  role
}
```

This allows the server to answer questions such as:

```text
Who is this user?
What is their user ID?
Are they a customer or staff member?
```

The session does not need to contain the user's password.

---

# Session Cookie

The browser stores the session ID in a cookie named:

```text
session
```

The cookie is configured with:

```js
{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
}
```

The important property is:

```text
httpOnly
```

This means browser JavaScript cannot read the session cookie.

For example:

```js
document.cookie
```

does not expose the session cookie.

The browser still sends the cookie with requests, allowing the server to identify the session.

---

# Session Flow

The complete sign-in flow is:

```text
User enters email + password
          ↓
Sign-in Server Action
          ↓
Find user by email
          ↓
Check password
          ↓
Create session
          ↓
Set httpOnly cookie
          ↓
Redirect user
```

When the user later visits a protected page:

```text
Browser
   ↓
session cookie
   ↓
getSession()
   ↓
session store
   ↓
current user
```

---

# Orders

Order data is currently stored in:

```text
lib/orders.js
```

Each order contains information such as:

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

The most important authentication-related field is:

```text
userId
```

This connects the order to the user who created it.

---

# Order Ownership

The server never trusts a client-provided `userId`.

When an authenticated user creates an order, the server builds the order using:

```js
userId: session.id
```

This means the current session determines the owner.

The client cannot simply send:

```text
userId: "staff-1"
```

and become that user.

---

# Reading Orders

The application has a helper:

```js
getOrdersByUser(userId)
```

It returns only orders belonging to that user.

Conceptually:

```text
All orders
    ↓
Filter by userId
    ↓
Current user's orders
```

For an individual order, the application uses:

```js
getOrderForUser(orderId, userId)
```

This performs two checks:

```text
Does the order exist?
        +
Does the order belong to this user?
```

Only when both are true is the order returned.

---

# Why Ownership Matters

Suppose the database contains:

```text
Order #1 → user-1
Order #2 → staff-1
```

If `user-1` requests:

```text
/orders/2
```

the server must not return Order #2.

Changing an ID in the URL does not change who owns the order.

The server checks:

```text
order.userId === session.id
```

If that fails, the order is treated as unavailable to the current user.

---

# Order Cancellation

Order cancellation happens through the Server Action:

```text
cancelOrder()
```

The flow is:

```text
Cancel request
      ↓
Get current session
      ↓
Reject if signed out
      ↓
Find order for current user
      ↓
Reject if not owned
      ↓
Mark order as cancelled
      ↓
Revalidate order pages
```

The ownership check happens before the write.

This is important because a hidden or disabled button in the browser is not security.

---

# Validation

Order validation is shared in:

```text
lib/schema.js
```

The server validates order information before creating an order.

Current validation includes:

```text
Name is required
Name has a minimum length
Phone number must use the expected Ethiopian format
Delivery area is required
Unavailable phone numbers are rejected
```

Validation happens on the server even if the browser already performs validation.

The reason is simple:

> Browser validation can be bypassed.

A user can send a request directly without using the normal form.

---

# Server Action Data Flow

The checkout form sends its data to:

```text
placeOrder()
```

The Server Action then:

```text
1. Gets the session
2. Rejects signed-out users
3. Builds the order using session.id
4. Validates the order
5. Returns field errors if validation fails
6. Creates the order if valid
7. Revalidates the affected page
```

The browser does not decide the order owner.

The server does.

---

# Order API

The API endpoint:

```text
POST /api/orders
```

also uses the current session.

The flow is:

```text
Request
   ↓
getSession()
   ↓
401 if not signed in
   ↓
Build order with session.id
   ↓
Validate
   ↓
422 if invalid
   ↓
Create order
   ↓
201 Created
```

This means the Server Action and API follow the same basic security rule.

---

# Order API by ID

The endpoint:

```text
GET /api/orders/[id]
```

also checks ownership.

The flow is:

```text
Request
   ↓
getSession()
   ↓
401 if signed out
   ↓
getOrderForUser(id, session.id)
   ↓
404 if not owned
   ↓
Return order
```

This prevents a user from reading another user's order simply by changing the order ID.

---

# Dishes

Dish data remains separate from authentication.

The dish data lives in:

```text
lib/dishes.js
```

The menu can therefore work independently from user accounts.

The application exposes dish data through:

```text
GET /api/dishes
GET /api/dishes/[id]
```

An unknown dish returns:

```text
404 Not Found
```

with:

```json
{
  "error": "No such dish"
}
```

---

# In-Memory Storage

This learning project currently uses in-memory storage for:

```text
Sessions
Orders
```

The data exists while the server process is running.

This makes the architecture easier to understand during the course.

The downside is that restarting the development server can clear the data.

A production application would normally use a persistent database.

---

# Environment Variables

The project has a local environment file:

```text
.env.local
```

It contains placeholders for server-side configuration:

```text
DATABASE_URL=
TELEBIRR_SECRET=
```

The file is ignored by Git.

Secrets should never be committed to the repository or exposed through Client Components.

---

# Data Security Rules

Day 42 follows a few simple rules:

### 1. Get the user from the session

Do not trust the browser to identify the user.

### 2. Scope user data

Orders are filtered by the current user's ID.

### 3. Check ownership before writes

Actions such as cancellation verify ownership before changing data.

### 4. Validate on the server

Client-side validation improves the user experience, but server-side validation provides the actual protection.

### 5. Keep secrets server-side

Database credentials and payment secrets belong in server-side environment variables.

---

# Final Data Flow

The main authenticated data flow is:

```text
                    Sign In
                       ↓
                  Create Session
                       ↓
                Session Cookie
                       ↓
                  getSession()
                       ↓
                  Current User
                       ↓
              ┌────────┴────────┐
              ↓                 ↓
          Create Order       Read Order
              ↓                 ↓
        session.id         session.id
              ↓                 ↓
          userId check     ownership check
              ↓                 ↓
          Save Order        Return Order
```

The key idea is:

> **User identity comes from the server-side session, not from data supplied by the browser.**

That single rule is used throughout the authentication and order flow.
