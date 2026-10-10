# Addis Eats — Server / Client Boundary

## Purpose

This document explains how Addis Eats separates server-side operations from browser interaction.

Day 42 introduced authentication and authorization. Day 43 builds on that architecture by rendering initial menu data on the server and using Client Components where interaction is needed.

Core principles:

- Server Components are the default.
- Client Components handle browser interaction and client-side state.
- Sensitive operations must be authorized on the server.
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

They may use server-side authentication helpers such as `getSession()`. Only the data required by the interface should be passed to Client Components.

## Client Components

Examples include:

- `app/Providers.jsx`
- `app/menu/CategoryBar.jsx`
- `app/menu/FilterShell.jsx`
- `app/menu/MenuCounter.jsx`
- `app/menu/error.js`
- `app/cart/page.js`
- `app/checkout/CheckoutForm.jsx`
- `app/orders/[id]/OrderStatus.js`
- `app/signin/SignInForm.jsx`

These components support forms, event handlers, React state, loading states, cart updates, and interactive menu features.

The `"use client"` directive should be used where client-side capabilities are required. A Client Component can still receive server-rendered initial HTML.

Verify component paths against the current source code when updating this document.

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

A Client Component can initiate an action, but it cannot decide whether the action is allowed.

For order cancellation, the server should:

1. Retrieve the current session.
2. Check authentication.
3. Verify that the requested order belongs to the current user.
4. Perform the cancellation only if authorization succeeds.

Route Handlers must apply appropriate checks before returning or modifying private data.

Changing an order ID in a URL must not grant access to another user's order.

## Three Layers of Protection

### 1. Proxy

The root `proxy.js` provides an early navigation guard.

The configured matcher includes protected routes such as:

```js
export const config = {
  matcher: ["/checkout", "/orders/:path*"],
};
```

The proxy can redirect signed-out users to the sign-in page with a `next` parameter.

However, checking whether a cookie exists does not establish that the session is valid or that the user has permission to perform an operation.

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

Conceptually:

```text
Request
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

## Session Data

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

## Safe Redirects

The sign-in flow supports internal destinations such as:

`/signin?next=/checkout`

External destinations such as `https://example.com` and protocol-relative URLs such as `//example.com` must be rejected.

Invalid destinations should fall back to a safe internal route to prevent open redirects.

## Day 43 — Rendering and Performance

The menu Server Component retrieves the initial dish data directly and passes it to the client-side search interface.

The flow is:

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
```

This avoids making the initial menu render depend entirely on a client-side request to the application's own API. API requests remain useful for search and pagination.

The menu image implementation uses image dimensions, responsive sizing, and priority loading for the first appropriate image. Other images can load lazily.

These changes are intended to improve loading behavior but do not guarantee better results in every Lighthouse run.

The latest recorded Day 43 run showed:

| Metric | Result |
|---|---:|
| Performance score | 73 |
| First Contentful Paint | 0.9 s |
| Largest Contentful Paint | 3.4 s |
| Total Blocking Time | 800 ms |
| Cumulative Layout Shift | 0 |

LCP remains above the commonly used good threshold of 2.5 seconds, and TBT remains elevated. Further measurement and optimization are needed. See `PERF.md` for the recorded results.

## Key Takeaway

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
Protected operation
```

The rendering principle is to serve initial data efficiently and use client-side interaction only where needed. Performance changes must be verified through measurement.


## Day 44 — Metadata and Search Visibility

Metadata and search-discovery files complement the server/client architecture.

- The root layout defines the shared metadata configuration, including the title template and `metadataBase`.
- Individual routes provide appropriate titles and descriptions.
- Dish pages generate metadata from the shared dish data.
- Open Graph metadata and generated dish preview images support social sharing.
- `MenuItem` JSON-LD describes dish information for structured-data consumers.
- `sitemap.xml` lists public pages and dishes.
- `robots.txt` guides compliant crawlers and references the sitemap.
- Canonical URLs identify the preferred URL for pages that may accept query parameters.

These features do not replace authentication or authorization. Excluding a route from a sitemap or disallowing crawling in `robots.txt` does not make that route private. Sensitive operations and data must remain protected on the server.

Local verification confirmed valid sitemap XML with 11 URLs, expected crawler rules, distinct metadata for the homepage, menu, and sampled dish pages, and working dish preview-image routes. Production-domain metadata and live social previews still require deployment verification.