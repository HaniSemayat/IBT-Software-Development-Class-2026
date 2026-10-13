# Day 45 — Data Architecture

## Overview

Addis Eats uses shared server-side data modules for dishes, users, sessions, and orders. Server Components, Route Handlers, and Server Actions use these modules to access or update data.

The application demonstrates authenticated data access, order ownership, server-side validation, and client-side updates. Its current in-memory storage is for learning and demonstration, not production persistence.

## Data Modules

| Module | Responsibility |
|---|---|
| `lib/dishes.js` | Dish catalogue and menu data |
| `lib/users.js` | Demo users and user lookup |
| `lib/session.js` | Session creation, lookup, and deletion |
| `lib/orders.js` | Order creation, retrieval, and updates |
| `lib/schema.js` | Server-side input validation |

## Data Flow

### Menu

```text
Menu Server Component
        ↓
    lib/dishes.js
        ↓
   Rendered menu
        ↓
Client search and filtering
        ↓
   GET /api/dishes
```

The initial menu is rendered on the server. Client-side search requests updated results through the dishes API. Search input is debounced so requests are sent after the user pauses typing.

### Authentication

```text
Sign-in form
     ↓
  signIn()
     ↓
User lookup and credential check
     ↓
Session creation
     ↓
HTTP-only session cookie
```

Signing out removes the active session and clears its cookie.

The current demo uses an in-memory session store. Sessions are not persisted across process restarts and are not shared across separate application instances.

### Orders

```text
Authenticated checkout
        ↓
   placeOrder()
        ↓
Server-side validation
        ↓
Trusted dish prices and total
        ↓
Order creation
        ↓
Orders stored in memory
```

The server derives the order's user ID from the authenticated session. It must never trust a user ID supplied by the browser.

## Data Models

### User

A user record includes:

- `id`
- `name`
- `email`
- `password`
- `role`

The current demo user data is stored in `lib/users.js`. Demo credentials and plain-text passwords are suitable only for local learning; production authentication must use securely hashed passwords and a persistent user database.

### Dish

A dish contains the fields required to display and identify a menu item, including its ID, name, price, category, and available image or description fields.

Dish prices used for order totals must come from trusted server-side data, not client-submitted prices.

### Order

An order contains its identifier, owning user ID, items, total, delivery details, and status.

The server validates incoming items and calculates the total using trusted dish prices. The client must not be allowed to choose another user's identity or set an arbitrary order total.

## API Endpoints

| Endpoint | Purpose | Expected responses |
|---|---|---|
| `GET /api/dishes` | Retrieve or search dishes | `200 OK` |
| `GET /api/dishes/[id]` | Retrieve one dish | `200 OK`, `404 Not Found` |
| `POST /api/orders` | Create an authenticated order | `201 Created`, `400 Bad Request`, `401 Unauthorized`, `422 Unprocessable Entity` |
| `GET /api/orders/[id]` | Retrieve an owned order | `200 OK`, `401 Unauthorized`, `404 Not Found` |

Exact response behavior should be confirmed against the current Route Handler implementations.

## Authentication and Ownership

All private order access must be scoped to the authenticated session.

- `/orders` returns only the current user's orders.
- `/orders/[id]` checks ownership before rendering an order.
- `GET /api/orders/[id]` checks authentication and ownership.
- `cancelOrder()` verifies that the order belongs to the current user before changing its status.
- `POST /api/orders` derives ownership from the session rather than submitted data.
- Staff-only pages must verify the user's role on the server.

A guessed or copied order ID must not grant access to another user's order. Return a not-found response when an order does not exist or does not belong to the authenticated user.

## Live Data and Client Updates

### Debounced menu search

The menu search waits briefly after the user stops typing before requesting results. This reduces unnecessary API calls compared with sending a request for every keystroke.

Verify this in the browser Network panel by typing several characters and confirming that requests occur after pauses.

### Order status polling

The order detail page fetches the order on the server before rendering and passes that data to the client status component as initial data.

The client then polls the order API every five seconds using SWR. This provides periodic status updates without requiring the user to reload the page.

## Storage Limitations

The current implementation uses process-local memory for sessions, users, and orders.

This creates important limitations:

- Data can disappear when the server process restarts.
- Multiple server instances do not share the same data.
- Changes are not durable.
- In-memory session storage is not suitable for reliable production authentication.
- Demo credentials must not be used for real accounts.

A production implementation should use a persistent database, securely hashed passwords, and a suitable shared session store or established authentication provider.

## Environment Variables

Use `.env.local` for local secrets and environment-specific configuration. Keep it out of version control.

`.env.example` should document the required variable names without containing real secrets. Never expose server secrets through `NEXT_PUBLIC_` variables.

## Verification Checklist

- [ ] Dish endpoints return the expected data and status codes.
- [ ] Invalid order data is rejected by server-side validation.
- [ ] Signed-out order creation is rejected.
- [ ] Order ownership is derived from the session.
- [ ] User A cannot access or cancel User B's order.
- [ ] Menu search is debounced.
- [ ] Order details render with server-provided initial data.
- [ ] Order status polling works after initial rendering.
- [ ] Production persistence limitations are documented.

## Summary

Day 45 brings the data flow together across Server Components, Client Components, Route Handlers, and Server Actions.

The key rule is that **authentication, authorization, validation, order ownership, and price calculation must be enforced on the server**. Client-side controls improve usability but do not replace server-side security.
---

## Day 46 — Cart and Dashboard Data Flow

### Cart State

The cart uses shared client-side React state provided through `app/Providers.jsx`.

Important components:

- `components/AddToCartButton.jsx` — adds a dish to the cart.
- `components/CartNavLink.jsx` — displays the total quantity of cart items.
- `app/menu/SearchBox.jsx` — renders the active menu search interface and Add to Cart controls.
- `app/cart/page.js` — provides the cart interface.

When a user adds a dish, the shared cart state updates and the navbar count reflects the total quantity across all cart items.

For example, two dishes with quantities of 2 and 3 produce a navbar count of 5.

The current cart state is held in client-side memory and resets when the page is reloaded.

### Cart and Order Separation

The cart is temporary client-side state; an order is a separate server-side record.

```text
Menu
  |
  v
Add to Cart
  |
  v
Shared React cart state
  |
  v
Review cart
  |
  v
Submit checkout
  |
  v
Server-side validation
  |
  v
Trusted dish prices and total
  |
  v
Create order
````

The server must not trust prices, totals, or ownership information supplied by the browser. It should validate submitted dish IDs and quantities against trusted server-side data before creating an order.

### Dashboard Analytics

The Day 46 admin dashboard presents summaries derived from order data, including:

- Order counts
- Revenue summaries
- Revenue grouped by neighbourhood
- Daily order counts
- A sortable and paginated order table

These analytics depend on the application's current order records. Because the demo uses in-memory order storage, data is not durable across server restarts and may differ between separate application instances.

Dashboard analytics must be protected by server-side authorization. Customers must not be able to retrieve staff-only data by directly requesting a dashboard route or data endpoint.

Verify the current dashboard implementation before treating specific authorization rules or analytics calculations as tested guarantees.

### Day 46 Verification Checklist

- Adding a dish updates shared cart state.
- The navbar count reflects total item quantities.
- Cart changes are reflected in the cart interface.
- Reloading the page resets the cart as expected.
- Checkout validates submitted dish IDs and quantities on the server.
- Order totals are calculated using trusted dish prices.
- Dashboard analytics match the available order records.
- Unauthorized users cannot access protected dashboard data.
- In-memory storage limitations remain documented.

