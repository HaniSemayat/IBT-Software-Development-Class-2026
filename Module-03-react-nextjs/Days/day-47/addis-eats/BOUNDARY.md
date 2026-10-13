# Addis Eats — Server / Client Boundary

## Purpose

This document explains how Addis Eats separates server-side operations from browser interaction.

Day 45 integrates the application's rendering architecture with authentication, authorization, data ownership, live updates, and performance measurement.

Core principles:

- Server Components are the default.
- Client Components handle browser interaction and client-side state.
- Sensitive operations must be authorized on the server.
- Only necessary data should cross the Server/Client boundary.
- Client-side UI restrictions are not security controls.

## Server Components

Examples include:

- `app/page.js`
- `app/layout.js`
- `app/menu/page.js`
- `app/menu/[id]/page.js`
- `app/checkout/page.js`
- `app/orders/page.js`
- `app/orders/[id]/page.js`
- `app/kitchen/page.js`
- `app/signin/page.js`

Server Components can retrieve server-side data and render HTML without shipping their component implementation as client-side JavaScript.

They can use server-side helpers such as `getSession()` to check authentication before rendering protected content. Only the data required by the interface should be passed to Client Components.

The menu Server Component retrieves its initial dish data directly instead of making an HTTP request to its own API for the initial render.

## Client Components

Examples include:

- `app/Providers.jsx`
- `app/menu/CategoryBar.jsx`
- `app/menu/FilterShell.jsx`
- `app/menu/MenuCounter.jsx`
- `app/menu/SearchBox.jsx`
- `app/menu/error.js`
- `app/cart/page.js`
- `app/checkout/CheckoutForm.jsx`
- `app/orders/[id]/OrderStatus.jsx`
- `app/signin/SignInForm.jsx`

These components support forms, event handlers, React state, pending and error states, cart updates, search, and interactive status updates.

The `"use client"` directive should be used where browser capabilities are required. A Client Component can still receive server-rendered initial HTML.

Verify component paths against the current source tree when updating this document.

## Server-Side Authentication

Important files include:

- `lib/session.js`
- `lib/users.js`
- `lib/orders.js`
- `app/actions.js`
- `app/api/orders/route.js`
- `app/api/orders/[id]/route.js`
- `proxy.js`

The session helper resolves the current user from the session cookie and server-side session store.

The browser must not receive the session store or be trusted to determine a user's permissions.

The `httpOnly` cookie setting prevents browser JavaScript from reading the cookie directly. It does not replace server-side authorization.

## The Security Boundary

A Client Component can initiate an action, but it cannot decide whether that action is allowed.

For order cancellation, the server must:

1. Retrieve the current session.
2. Check authentication.
3. Verify that the requested order belongs to the current user.
4. Perform the cancellation only if authorization succeeds.

Route Handlers must apply the appropriate authentication, validation, and ownership checks before returning or modifying private data.

Changing an order ID in a URL must not grant access to another user's order.

## Three Layers of Protection

### 1. Proxy

The root `proxy.js` provides an early navigation guard.

The configured matcher includes protected routes such as:

```js
export const config = {
  matcher: ["/checkout", "/orders/:path*", "/kitchen"],
};
```

The proxy can redirect signed-out users to the sign-in page with a `next` parameter.

However, checking whether a cookie exists does not establish that the session is valid or that the user has permission to perform an operation.

The proxy is an additional navigation guard, not the application's authorization system.

### 2. Page-Level Protection

Protected pages should check the current session on the server.

For example:

```js
const session = await getSession();

if (!session) {
  redirect("/signin");
}
```

Staff-only pages must also check the user's role. A customer must not gain access to `/kitchen` by typing the URL manually.

### 3. Server Actions and Route Handlers

Sensitive operations must check authentication, permissions, and resource ownership on the server.

The intended flow is:

```text
Untrusted request
       |
       v
Get session
       |
       v
Authenticate user
       |
       v
Check permissions and ownership
       |
       v
Validate input
       |
       v
Perform operation or reject request
```

These checks protect operations even when a request bypasses the normal interface.

## Authentication vs. Authorization

Authentication answers: "Who are you?"

Authorization answers: "What are you allowed to do?"

Examples:

- Customers can access their own orders.
- Customers cannot access another customer's order.
- Customers cannot access staff-only functionality.
- Authorized staff can access the kitchen.

Being signed in does not grant unrestricted access.

## Session Data and Storage

The session contains basic user information, such as:

```js
{
  id,
  name,
  email,
  role
}
```

The browser sends the session ID through a cookie. The server uses it to look up the session.

The session store remains on the server.

The current demonstration uses process-local in-memory storage. Sessions are not durable across server restarts and are not shared across separate application instances. A production deployment requires appropriate persistent storage or a shared session solution.

## Safe Redirects

The sign-in flow supports internal destinations such as:

`/signin?next=/checkout`

External destinations such as `https://example.com` and protocol-relative URLs such as `//example.com` must be rejected.

Invalid destinations should fall back to a safe internal route to prevent open redirects.

Test with an external `next` URL and confirm that a successful sign-in does not send the user to an external site.

## Day 45 — Rendering and Data Flow

### Initial menu rendering

The menu Server Component retrieves the initial dish data and passes it to the client-side search interface.

```text
Menu Server Component
        |
        v
Server-side dish data
        |
        v
Initial dish props
        |
        v
Interactive search interface
        |
        v
Debounced search and pagination API requests
```

This avoids making the initial menu render depend entirely on a client-side request to the application's own API. Subsequent search and pagination requests remain available through the API.

### Order detail rendering

The order detail page retrieves the authenticated user's order on the server and passes that initial data to the client status component.

The client uses SWR to poll the order endpoint periodically. This allows status updates without making the initial page depend on an empty client-side loading state.

### Server Actions

Server Actions are not automatically safe merely because they execute on the server. Each sensitive action must verify the session, permissions, and resource ownership before changing data.

Order totals must be calculated from trusted server-side dish prices rather than prices supplied by the browser.

## Performance Findings

The menu uses local WebP images, Next.js `Image`, responsive sizing, and priority loading for the first appropriate image.

These changes are intended to improve loading behavior but do not guarantee better results in every Lighthouse run.

The latest recorded local Day 43 run showed:

| Metric | Result |
|---|---:|
| Performance score | 73 |
| First Contentful Paint | 0.9 s |
| Largest Contentful Paint | 3.4 s |
| Total Blocking Time | 800 ms |
| Cumulative Layout Shift | 0 |

LCP remains above the commonly used good threshold of 2.5 seconds, and the Lighthouse score remains below the Day 45 target of 90.

These are local measurements, not deployed performance results. See `PERF.md` for the full report and outstanding checks.

## Day 44 — Metadata and Search Visibility

Metadata and search-discovery files complement the Server/Client architecture.

- The root layout defines shared metadata, including the title template and `metadataBase`.
- Individual routes provide appropriate titles and descriptions.
- Dish pages generate metadata from shared dish data.
- Open Graph metadata and generated dish preview images support social sharing.
- `MenuItem` JSON-LD describes dish information for structured-data consumers.
- `sitemap.xml` lists public pages and dishes.
- `robots.txt` guides compliant crawlers and references the sitemap.
- Canonical URLs identify the preferred URL for pages that may accept query parameters.

These features do not replace authentication or authorization. Excluding a route from a sitemap or disallowing crawling in `robots.txt` does not make that route private. Sensitive data and operations must remain protected on the server.

Local verification confirmed valid sitemap XML with 11 URLs, expected crawler rules, distinct metadata for the homepage, menu, and sampled dish pages, and working dish preview-image routes. Production-domain metadata and live social previews still require deployment verification.

## Key Takeaways

The security boundary is not simply Client vs. Server.

It is:

```text
Untrusted request
        |
        v
Server authentication
        |
        v
Server authorization
        |
        v
Validated protected operation
```

The rendering principle is to serve initial data efficiently and use client-side interaction only where needed.

The performance principle is to measure actual behavior before claiming an optimization has worked.
---

## Day 46 — Cart and Admin Dashboard Boundaries

### Root Layout and Shared Providers

`app/layout.js` remains the root layout and establishes the shared application structure.

`app/Providers.jsx` provides client-side React context to components that need shared state.

The layout wraps the application content with the provider so components such as the navbar can access cart state without turning the entire application into a Client Component.

### Cart Interaction

The cart feature uses Client Components for browser interaction and shared React state.

Important files:

- `app/Providers.jsx` — provides shared client-side state.
- `components/CartNavLink.jsx` — reads cart state and displays the total item quantity in the navbar.
- `components/AddToCartButton.jsx` — adds a dish to the cart and shows temporary confirmation feedback.
- `app/menu/SearchBox.jsx` — renders the active interactive menu and its Add to Cart controls.
- `app/cart/page.js` — provides the cart interface.

The cart count represents the sum of item quantities, not simply the number of distinct dishes.

### Menu Rendering

The menu uses server-rendered initial data together with client-side interaction.

`app/menu/SearchBox.jsx` is the active menu renderer for the search interface and Add to Cart controls. `app/menu/DishList.jsx` also exists, but it should not be documented as the active renderer without verifying its current usage.

Only components that require browser interaction or client-side state should need the client boundary.

### Admin Dashboard

The Day 46 dashboard adds order analytics and an interactive order table.

The documented features include:

- Order counts and status summaries
- Revenue summaries
- Revenue grouped by neighbourhood
- Daily order counts
- Sorting and pagination

The dashboard's rendering boundary and access-control behavior must be verified against the current `app/dashboard` source files and the server-side data-access helpers.

If the dashboard is a Server Component, it can retrieve data and perform authorization checks on the server before rendering. If it contains interactive controls, those controls can be isolated into Client Components.

Dashboard analytics must not be exposed to unauthorized users merely because the interface hides a navigation link. Protected data must be authorized on the server.

### State and Persistence

The cart currently uses in-memory React state.

- Cart quantities update the navbar count.
- Adding an item updates the shared cart state.
- Cart state resets when the page is reloaded.
- Cart state is not a persistent order record.
- Order persistence depends on the application's separate order-storage implementation.

Client-side cart state must not be treated as trusted input for checkout. The server must validate submitted items and calculate order totals from trusted dish data.

### Day 46 Boundary Summary

```text
Server-rendered application
          |
          v
Shared Providers
          |
          +---- Navbar cart count
          |
          +---- Interactive menu
          |          |
          |          v
          |     Add to Cart
          |
          +---- Cart interface
          |
          +---- Admin dashboard
                     |
                     v
             Server-side data
             and authorization
```

This diagram describes the architectural responsibilities. Verify the dashboard's actual component boundaries and authorization checks in source before treating them as tested guarantees.