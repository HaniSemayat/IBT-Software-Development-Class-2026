# Day 39 — API Routes & Server Actions

## Project

**Addis Eats — Next.js**

Day 39 extends Addis Eats with API Route Handlers, server-side validation, Server Actions, `useActionState`, authorization checks, and revalidation.

---

## Objectives

* Build API Route Handlers with Next.js App Router.
* Handle `GET` and `POST` requests.
* Read route parameters and JSON request bodies.
* Return appropriate HTTP status codes.
* Validate input on the server.
* Return predictable validation errors.
* Build checkout submission with a Server Action.
* Use `useActionState` and pending UI.
* Revalidate data after mutations.
* Perform authorization checks on the server.
* Keep server secrets out of client-side code.

---

# Component Boundaries

Day 39 continues the Server/Client boundaries from Day 38.

| File                            | Type   | Reason                     |
| ------------------------------- | ------ | -------------------------- |
| `app/layout.js`                 | Server | Root layout                |
| `app/Providers.jsx`             | Client | Client boundary            |
| `app/menu/page.js`              | Server | Menu data                  |
| `app/menu/CategoryBar.jsx`      | Client | Interactive category state |
| `app/menu/FilterShell.jsx`      | Client | Interactive UI             |
| `app/menu/MenuCounter.jsx`      | Client | `useState`                 |
| `app/menu/DishList.jsx`         | Server | Server-rendered dishes     |
| `app/menu/error.js`             | Client | Error boundary             |
| `app/checkout/page.js`          | Server | Page shell                 |
| `app/checkout/CheckoutForm.jsx` | Client | `useActionState`           |
| `app/actions.js`                | Server | Server Actions             |

Server Components are the default. Client Components are used only where browser interaction or state is required.

---

# Rendering Strategies

| Route        | Strategy      | Reason                          |
| ------------ | ------------- | ------------------------------- |
| `/`          | Static        | No request-specific data        |
| `/menu`      | ISR           | Revalidates every hour          |
| `/menu/[id]` | SSG           | Uses `generateStaticParams`     |
| `/cart`      | Static/Server | No client-only behavior         |
| `/checkout`  | Dynamic       | Explicitly uses `force-dynamic` |

---

# API Route Handlers

Route Handlers are located under:

```text
app/api/
```

They use the standard Web `Request` and `Response` APIs.

## `GET /api/dishes`

Returns the complete menu.

**Status:** `200 OK`

Implementation:

```text
app/api/dishes/route.js
```

---

## `GET /api/dishes/[id]`

Returns one dish using its dynamic route parameter.

Example:

```text
GET /api/dishes/1
```

**Success:** `200 OK`

Unknown dish:

**Status:** `404 Not Found`

```json
{
  "error": "No such dish"
}
```

Implementation:

```text
app/api/dishes/[id]/route.js
```

---

## `POST /api/orders`

Creates an order and validates the request on the server.

**Success:** `201 Created`

**Validation failure:** `422 Unprocessable Entity`

Example:

```json
{
  "error": "Validation failed",
  "fieldErrors": {
    "phone": "Enter a valid Ethiopian phone number."
  }
}
```

Validation includes:

* Name is required.
* Name must contain at least 2 characters.
* Phone is required.
* Phone must match the Ethiopian format.
* Delivery area is required.
* `0911111111` is rejected as unavailable.

Implementation:

```text
app/api/orders/route.js
```

---

# HTTP Status Codes

| Status | Usage                      |
| -----: | -------------------------- |
|  `200` | Successful GET             |
|  `201` | Order successfully created |
|  `404` | Resource not found         |
|  `422` | Validation failed          |
|  `500` | Unexpected server error    |

---

# Shared Server Data

Menu data is stored in:

```text
lib/dishes.js
```

It provides:

* `dishes`
* `getDishes()`
* `getDish(id)`

Both the UI and API use the same data source.

Orders are stored in memory in:

```text
lib/orders.js
```

This is only for the learning project. It is **not a production database** and data can disappear when the server restarts.

---

# Server-Side Validation

Validation is kept in:

```text
lib/schema.js
```

The rules are based on the checkout validation from the earlier React project.

Validation happens on the server because client-side validation can be bypassed with tools such as `curl`.

---

# Server Actions

The checkout submission uses:

```text
app/actions.js
```

with:

```js
"use server";
```

The main action is:

```js
placeOrder()
```

It:

1. Receives form data.
2. Builds the order.
3. Validates it on the server.
4. Returns validation errors when necessary.
5. Creates the order when valid.
6. Calls `revalidatePath()` after a successful write.

The final checkout flow does **not** use client-side `fetch()`.

---

# `useActionState`

`CheckoutForm.jsx` uses:

```js
useActionState(placeOrder, initialState)
```

This provides:

* Server Action state.
* Form action.
* Pending state.

While submitting, the button changes from:

```text
Place Order
```

to:

```text
Placing order...
```

and becomes disabled.

---

# Checkout Flow

```text
Checkout Page
      ↓
CheckoutForm
      ↓
<form action={formAction}>
      ↓
placeOrder()
      ↓
Server Validation
   ↙       ↘
Invalid    Valid
   ↓         ↓
Errors    createOrder()
             ↓
       revalidatePath()
             ↓
          Success
```

The API endpoint was tested independently, while the final checkout UI uses the Server Action directly.

---

# Cancel Order Authorization

The project also demonstrates a protected Server Action:

```js
cancelOrder()
```

Before cancelling an order, it checks:

1. A session exists.
2. The order exists.
3. The order belongs to the current user.

Authorization is performed **inside the Server Action**, not just by hiding a button in the UI.

For this exercise, the session/ownership mechanism is a simple demonstration rather than production authentication.

After cancellation:

```js
revalidatePath("/orders");
```

---

# Revalidation

After placing an order:

```js
revalidatePath("/checkout");
```

After cancelling an order:

```js
revalidatePath("/orders");
```

These tell Next.js to refresh affected route data after server-side mutations.

---

# Environment Variables

Server-side environment variables belong in:

```text
.env.local
```

`.env.local` is protected by `.gitignore` and is not committed to Git.

Secrets should remain server-side and should not be exposed through Client Components or unnecessary `NEXT_PUBLIC_` variables.

---

# Security Rules

Day 39 demonstrates:

* Never trust client-side validation.
* Validate request data on the server.
* Treat route parameters as user input.
* Return appropriate HTTP status codes.
* Avoid exposing internal server errors.
* Keep secrets server-side.
* Perform authorization inside Server Actions.
* Do not rely on hiding UI controls for security.

---

# Project Structure

```text
addis-eats/
├── app/
│   ├── api/
│   │   ├── dishes/
│   │   │   ├── [id]/
│   │   │   │   └── route.js
│   │   │   └── route.js
│   │   └── orders/
│   │       └── route.js
│   ├── actions.js
│   ├── checkout/
│   │   ├── CheckoutForm.jsx
│   │   └── page.js
│   ├── menu/
│   ├── cart/
│   ├── Providers.jsx
│   ├── layout.js
│   └── page.js
│
├── lib/
│   ├── dishes.js
│   ├── orders.js
│   └── schema.js
│
├── .env.local
├── .gitignore
└── README.md
```

---

# Testing

The API endpoints were tested independently.

### Dishes

```text
GET /api/dishes       → 200
GET /api/dishes/1     → 200
GET /api/dishes/999   → 404
```

### Orders

```text
Invalid POST /api/orders → 422
Valid POST /api/orders   → 201
```

The final checkout implementation uses the Server Action rather than `fetch()`.

---

# Build Verification

The project was verified with:

```bash
npm run build
```

Build environment:

```text
Next.js 16.3.6
Turbopack
```

The production build completed successfully.

---

# Day 39 Checklist

* [x] `GET /api/dishes`
* [x] `GET /api/dishes/[id]`
* [x] 404 response for unknown dish
* [x] `POST /api/orders`
* [x] Server-side validation
* [x] 201 successful order response
* [x] 422 validation response
* [x] Checkout submission
* [x] Server Action
* [x] `useActionState`
* [x] Pending state
* [x] `revalidatePath()`
* [x] `cancelOrder` authorization
* [x] Session check
* [x] Order ownership check
* [x] `.env.local` protected by `.gitignore`
* [x] API documentation
* [x] Production build verified

---

# What Day 39 Demonstrates

Day 39 moves Addis Eats from UI-focused React work into server-side Next.js architecture.

```text
Server Components
       +
Client Components
       +
Route Handlers
       +
Server Validation
       +
Server Actions
       +
useActionState
       +
Authorization
       +
Revalidation
```

| Need                   | Approach           |
| ---------------------- | ------------------ |
| Render server data     | Server Component   |
| Interactive UI         | Client Component   |
| Public/API endpoint    | Route Handler      |
| Own UI form mutation   | Server Action      |
| Security/authorization | Server-side check  |
| Refresh after mutation | `revalidatePath()` |
