# Day 40 — Next.js Foundations Project

## Addis Eats — Next.js

This project brings together the Next.js concepts from Days 36–39 into one application.

The original Addis Eats application was built with React. This version rebuilds the same food-ordering domain using Next.js App Router, file-based routing, nested layouts, Server Components, Client Components, Route Handlers, Server Actions, server-side validation, and deliberate rendering strategies.

---

## Routes

| Route        | Strategy     | Purpose                                   |
| ------------ | ------------ | ----------------------------------------- |
| `/`          | Static       | Landing page                              |
| `/menu`      | ISR — 1 hour | Menu with categories and dishes           |
| `/menu/[id]` | Static / SSG | Individual dish                           |
| `/cart`      | Client       | Interactive cart quantities and ETB total |
| `/checkout`  | Dynamic      | Validated checkout using Server Action    |

Special files:

```text
app/menu/loading.js
app/menu/error.js
app/not-found.js
```

---

## Rendering Strategy

### `/`

Static because the landing page does not depend on request-specific data.

### `/menu`

ISR using:

```js
export const revalidate = 3600;
```

Menu data is fetched directly by the Server Component.

### `/menu/[id]`

Static generation using:

```js
generateStaticParams()
```

Unknown dishes call:

```js
notFound()
```

### `/cart`

Client Component because the cart contains browser interaction:

* quantity changes
* item removal
* running ETB total

### `/checkout`

Dynamic route with a Server Action for order submission and server-side validation.

The full reasoning is documented in:

```text
STRATEGY.md
```

---

## Server / Client Boundary

Server Components are the default.

Client Components are used only where browser interaction or client state is required.

Current Client Components include:

```text
app/Providers.jsx
app/menu/CategoryBar.jsx
app/menu/FilterShell.jsx
app/menu/MenuCounter.jsx
app/menu/error.js
app/cart/page.js
app/checkout/CheckoutForm.jsx
```

The complete boundary map is documented in:

```text
BOUNDARY.md
```

---

## Data Flow

### Menu

```text
Server Component
      ↓
lib/dishes.js
      ↓
DishList
      ↓
Rendered menu
```

The menu Server Component reads the shared server data directly instead of making a request to its own API.

### Cart

```text
Client Component
      ↓
React state
      ↓
Quantity changes
      ↓
Running ETB total
```

### Checkout

```text
CheckoutForm
      ↓
useActionState
      ↓
placeOrder Server Action
      ↓
Server validation
      ↓
createOrder()
      ↓
revalidatePath()
```

---

# API Route Handlers

## GET `/api/dishes`

Returns all dishes.

**Success:** `200 OK`

Implementation:

```text
app/api/dishes/route.js
```

---

## GET `/api/dishes/[id]`

Returns one dish.

Example:

```text
GET /api/dishes/1
```

**Success:** `200 OK`

Unknown dish:

**Status:** `404 Not Found`

Response:

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

## POST `/api/orders`

Accepts an order and validates it on the server.

**Success:** `201 Created`

**Validation failure:** `422 Unprocessable Entity`

Example validation response:

```json
{
  "error": "Validation failed",
  "fieldErrors": {
    "phone": "Enter a valid Ethiopian phone number."
  }
}
```

Validation includes:

* name required
* minimum name length
* Ethiopian phone format
* delivery area required
* unavailable phone rejection

Implementation:

```text
app/api/orders/route.js
```

---

## HTTP Status Codes

| Status | Meaning                 |
| -----: | ----------------------- |
|    200 | Successful request      |
|    201 | Resource created        |
|    404 | Resource not found      |
|    422 | Validation failed       |
|    500 | Unexpected server error |

---

# Server-Side Validation

Validation is shared in:

```text
lib/schema.js
```

The server validates requests independently of the browser.

This prevents users from bypassing validation by sending requests directly with tools such as `curl`.

---

# Server Actions

Checkout uses:

```text
app/actions.js
```

with:

```js
"use server";
```

The `placeOrder()` action:

1. receives form data
2. builds the order
3. validates the data on the server
4. returns field errors when invalid
5. creates the order when valid
6. revalidates the affected route

The checkout UI uses `useActionState()` to handle:

* action state
* validation errors
* pending state
* success state

---

# Authorization

The `cancelOrder()` Server Action demonstrates server-side authorization.

It checks:

1. a session exists
2. the order exists
3. the order belongs to the current user

Authorization is performed inside the Server Action rather than relying on a hidden or disabled client button.

---

# Environment Variables

Server-side environment variables belong in:

```text
.env.local
```

`.env.local` is ignored by Git.

No server secret is intentionally exposed to Client Components or browser JavaScript.

---

# Production Verification

The project was built with:

```text
npm run build
```

Build environment:

```text
Next.js 16.3.6
Turbopack
```

The production build completed successfully.

Current build route categories:

```text
/             Static
/menu         Static + 1 hour revalidation
/menu/[id]    SSG
/cart         Static route containing Client Component state
/checkout     Dynamic
/api/dishes   Route Handler
/api/orders   Route Handler
```

---

# API Verification

The following endpoint behaviors are required:

```text
GET /api/dishes       → 200
GET /api/dishes/1     → 200
GET /api/dishes/999   → 404
POST /api/orders      → 201 for valid input
POST /api/orders      → 422 for invalid input
```

---

# Project Structure

```text
addis-eats/
├── app/
│   ├── api/
│   │   ├── dishes/
│   │   │   └── route.js
│   │   └── orders/
│   │       └── route.js
│   ├── actions.js
│   ├── cart/
│   │   └── page.js
│   ├── checkout/
│   │   ├── CheckoutForm.jsx
│   │   └── page.js
│   ├── menu/
│   │   ├── [id]/
│   │   │   └── page.js
│   │   ├── CategoryBar.jsx
│   │   ├── DishList.jsx
│   │   ├── FilterShell.jsx
│   │   ├── MenuCounter.jsx
│   │   ├── error.js
│   │   ├── layout.js
│   │   ├── loading.js
│   │   └── page.js
│   ├── not-found.js
│   ├── page.js
│   ├── layout.js
│   └── Providers.jsx
│
├── lib/
│   ├── dishes.js
│   ├── orders.js
│   └── schema.js
│
├── BOUNDARY.md
├── STRATEGY.md
└── README.md
```

---

# Day 40 Verification Checklist

* [x] App Router folder routing
* [x] Dynamic `/menu/[id]` route
* [x] `loading.js`
* [x] `error.js`
* [x] `not-found.js`
* [x] Nested menu layout
* [x] Static home page
* [x] ISR menu
* [x] Static dish pages with `generateStaticParams`
* [x] Client-side cart
* [x] Dynamic checkout
* [x] Server Components
* [x] Client Components only where interaction requires them
* [x] Route Handler
* [x] Server-side validation
* [x] Server Action
* [x] `useActionState`
* [x] Pending state
* [x] Authorization check
* [x] `revalidatePath()`
* [x] `STRATEGY.md`
* [x] `BOUNDARY.md`
* [x] Production build

## Final Goal

Day 40 combines the week's architecture into one Next.js application:

```text
Routing
   +
Layouts
   +
Rendering Strategies
   +
Server Components
   +
Client Components
   +
Route Handlers
   +
Server Actions
   +
Server Validation
   +
Authorization
   +
Revalidation
```
