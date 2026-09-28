# Addis Eats — Server / Client Boundary

## Boundary Principle

Next.js Server Components are the default.

A component becomes a Client Component only when it needs browser-side behavior such as:

* `useState`
* event handlers
* `useActionState`
* browser APIs
* interactive UI state

The goal is to keep client boundaries as small as practical.

---

## Component Boundary Map

| Component                       | Side   | Reason                                                               |
| ------------------------------- | ------ | -------------------------------------------------------------------- |
| `app/layout.js`                 | Server | Provides the application shell and does not require browser state.   |
| `app/Providers.jsx`             | Client | Defines the client boundary for future shared client state.          |
| `app/page.js`                   | Server | Static landing page with no browser interaction.                     |
| `app/menu/layout.js`            | Server | Provides menu navigation and layout structure.                       |
| `app/menu/page.js`              | Server | Fetches menu data and composes the menu UI on the server.            |
| `app/menu/DishList.jsx`         | Server | Only renders dish data; no state or event handlers are required.     |
| `app/menu/CategoryBar.jsx`      | Client | Uses interactive category state.                                     |
| `app/menu/FilterShell.jsx`      | Client | Uses state to show or hide menu content.                             |
| `app/menu/MenuCounter.jsx`      | Client | Uses `useState` and a click handler.                                 |
| `app/menu/loading.js`           | Server | Displays the loading UI.                                             |
| `app/menu/error.js`             | Client | Next.js error boundaries require client-side behavior and `reset()`. |
| `app/menu/[id]/page.js`         | Server | Renders dish data and uses `generateStaticParams`.                   |
| `app/cart/page.js`              | Client | Manages quantities and the running ETB total with React state.       |
| `app/checkout/page.js`          | Server | Provides the checkout page shell and dynamic route configuration.    |
| `app/checkout/CheckoutForm.jsx` | Client | Uses `useActionState` and form interaction.                          |
| `app/actions.js`                | Server | Contains Server Actions and server-side validation/mutations.        |
| `app/api/dishes/route.js`       | Server | Route Handler for the dishes API.                                    |
| `app/api/dishes/[id]/route.js`  | Server | Route Handler for one dish.                                          |
| `app/api/orders/route.js`       | Server | Route Handler with server-side order validation.                     |

---

## Client Components

The current Client Component boundaries are:

```text
app/Providers.jsx
app/menu/CategoryBar.jsx
app/menu/FilterShell.jsx
app/menu/MenuCounter.jsx
app/menu/error.js
app/cart/page.js
app/checkout/CheckoutForm.jsx
```

Each has a specific reason for being client-side.

There is no need to make the root layout or menu data-fetching components Client Components.

---

## Server Components

The main Server Components include:

```text
app/layout.js
app/page.js
app/menu/layout.js
app/menu/page.js
app/menu/DishList.jsx
app/menu/[id]/page.js
app/checkout/page.js
```

These components can execute on the server and keep data fetching and rendering away from the browser where client interaction is not required.

---

## Data Flow

### Menu

```text
app/menu/page.js
       ↓
Server-side menu data
       ↓
DishList
       ↓
Rendered HTML
```

The menu does not fetch its own `/api/dishes` endpoint.

The Server Component uses the shared server-side data directly.

### Cart

```text
/menu
  ↓
Client interaction
  ↓
/cart
  ↓
useState
  ↓
quantity changes
  ↓
running ETB total
```

The cart is client-side because its state belongs to the current browser interaction.

### Checkout

```text
Checkout Page
      ↓
CheckoutForm
      ↓
useActionState
      ↓
Server Action
      ↓
Server validation
      ↓
createOrder()
      ↓
revalidatePath()
```

The form is Client Component code, but the actual order mutation and validation remain on the server.

---

## Security Boundary

Client-side validation is not trusted.

The following validation is performed on the server:

```text
lib/schema.js
```

The Server Action validates submitted form data before creating an order.

The Route Handler also validates JSON requests independently.

This means a user cannot bypass validation simply by avoiding the browser UI and sending a request directly.

---

## Authorization Boundary

The `cancelOrder()` Server Action performs authorization checks on the server.

The action verifies:

1. A session exists.
2. The requested order exists.
3. The order belongs to the current user.

Authorization therefore cannot be bypassed by simply modifying the client UI.

---

## Route Handler Boundary

Route Handlers are server-only HTTP boundaries:

```text
app/api/dishes/route.js
app/api/dishes/[id]/route.js
app/api/orders/route.js
```

They use the standard `Request` and `Response` APIs.

They validate incoming user-controlled data before performing server-side operations.

---

## Boundary Rules Used

1. Server Components are the default.
2. Use `"use client"` only when client behavior is required.
3. Keep interactive components small.
4. Keep data fetching on the server when possible.
5. Keep mutations and validation on the server.
6. Never rely on client-side validation for security.
7. Never expose server secrets to Client Components.
8. Do not pass server-only secrets or functions into Client Components.
9. Route Handlers remain server-side HTTP boundaries.
10. Server Actions remain server-side mutation boundaries.

---

## Day 40 Boundary Summary

The project separates responsibilities as follows:

```text
                 ADDIS EATS
                     │
        ┌────────────┴────────────┐
        │                         │
     SERVER                    CLIENT
        │                         │
  Data fetching              Cart state
  Validation                 Category state
  Route Handlers             Form state
  Server Actions             Interactive UI
  Authorization              Pending UI
        │                         │
        └────────────┬────────────┘
                     │
              Server / Client
                boundary
```

The architecture keeps server responsibilities on the server while limiting Client Components to the parts of the application that actually need browser interaction.
