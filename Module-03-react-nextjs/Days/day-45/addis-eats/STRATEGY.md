# Addis Eats — Rendering, Authentication & Authorization Strategy

## Overview

Day 45 integrates the architecture developed throughout Days 42–44.

- **Day 42:** Authentication, sessions, authorization, protected routes, and order ownership.
- **Day 43:** Server-rendered menu data, image optimization, and Lighthouse measurement.
- **Day 44:** Metadata, social previews, structured data, sitemap, and crawler directives.
- **Day 45:** Integration, security verification, data flow, live updates, and performance reporting.

The central principle is to enforce each concern at the correct boundary. User identity, authorization, validation, and trusted data belong on the server. Interactive behavior belongs in Client Components where needed.

## 1. Authentication Strategy

Addis Eats uses a server-side session model.

When a user signs in:

1. The server checks the submitted credentials.
2. It creates a random session identifier.
3. The identifier is associated with the user's session on the server.
4. The browser receives the session identifier in an HTTP-only cookie.
5. The user is redirected to an appropriate internal destination.

```text
Credentials
    |
    v
Verify user
    |
    v
Create session
    |
    v
Set session cookie
    |
    v
Identify user on later requests
```

The browser stores the session identifier, not the authoritative session data.

The current learning implementation uses in-memory session storage. This demonstrates the authentication flow but is not sufficient for a reliable production deployment.

## 2. Session Cookie Strategy

The session cookie uses settings similar to:

```js
{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
}
```

- `httpOnly` prevents ordinary browser JavaScript from reading the cookie.
- `secure` restricts cookie transmission to HTTPS in production.
- `sameSite` helps mitigate certain cross-site request scenarios.
- `maxAge` sets a seven-day lifetime.
- `path` makes the cookie available across application routes.

Cookie settings help protect the session, but they do not replace server-side authentication, authorization, or appropriate CSRF protections.

## 3. Authentication and Authorization

Authentication answers:

**Who is the current user?**

Authorization answers:

**What is that user allowed to do?**

The server retrieves the current session with the project's session helper:

```js
const session = await getSession();
```

The application uses the session to identify the current user and determine their role.

Customer access and staff access are different. Being signed in does not automatically grant permission to access staff-only features.

## 4. Route Protection Strategy

Public routes include:

```text
/
/menu
/menu/[id]
/signin
```

Protected routes include:

```text
/checkout
/orders
/orders/[id]
```

The staff-only route is:

```text
/kitchen
```

The root `proxy.js` provides an early navigation guard for selected routes. Its configured matcher includes:

```js
export const config = {
  matcher: ["/checkout", "/orders/:path*", "/kitchen"],
};
```

The proxy can redirect visitors who lack a session cookie to the sign-in page with a `next` parameter.

However, cookie presence does not prove that the session is valid or that the user is authorized to perform an operation.

**The proxy is a navigation guard, not the final security boundary.**

Protected pages, Server Actions, and Route Handlers must perform their own appropriate server-side checks.

## 5. Order Ownership

A signed-in user must only be able to access orders they are authorized to view or modify.

The application uses helpers such as:

```js
getOrderForUser(orderId, userId)
```

The server checks the requested order against the authenticated user's ID.

```text
Request order
     |
     v
Get current session
     |
     v
Identify current user
     |
     v
Find order and verify ownership
     |
     v
Return authorized data or reject
```

Changing an order ID in a URL must not reveal another customer's order.

When creating an order, the server derives ownership from the authenticated session instead of trusting a user ID supplied by the browser.

```js
userId: session.id
```

Ownership must also be verified before sensitive operations such as cancellation.

## 6. Staff Authorization

The `/kitchen` route requires staff authorization.

The server checks the authenticated user's role:

```js
session.role === "staff"
```

A customer must not gain access by entering the route directly or modifying browser-side state.

Hiding a navigation link is not authorization. The server must enforce the permission check.

## 7. Safe Redirect Strategy

The sign-in flow can accept an internal destination such as:

```text
/signin?next=/checkout
```

After successful authentication, the application can return the user to the requested page.

The redirect target must be validated. External URLs, protocol-relative URLs such as `//evil.com`, and other unsafe destinations must not be accepted as internal redirects.

Invalid destinations should fall back to a safe internal route to prevent open redirects.

## 8. Rendering Strategy

Rendering behavior is selected according to each route's data and interaction requirements.

### Public landing page

The landing page can use static rendering because it does not depend on the current user's session.

### Menu

The menu Server Component reads initial dish data directly from the shared server-side data source.

```text
Menu Server Component
          |
          v
Read initial dishes
          |
          v
Pass initial data as props
          |
          v
Render initial menu
          |
          v
Client-side interactions
```

This avoids an unnecessary request from a Server Component to the application's own API for its initial data.

Client-side behavior supports interactive search and pagination through API requests. Search input is debounced to avoid sending a request for every keystroke.

### Individual dish pages

The `/menu/[id]` route uses the project's static-generation strategy where applicable. Unknown dishes use the not-found behavior.

### Cart

The cart uses client-side state for quantity changes, item removal, and the running ETB total.

### Checkout and user-specific pages

These pages depend on the current session or other request-specific information and must be protected accordingly.

The objective is not to make every route static. It is to choose an appropriate rendering strategy while preserving correct behavior and security.

## 9. Server and Client Boundaries

Server Components are the default.

Client Components are used when browser interaction, event handlers, or client-side state is needed.

```text
Server Components
    |
    +-- Read initial data
    +-- Access server-side resources
    +-- Render request-dependent content
    +-- Enforce page-level checks
    |
    v
Client Components
    |
    +-- Handle interaction
    +-- Manage interactive state
    +-- Display pending and error states
    +-- Update the interface
```

Client Components should not receive private server secrets or become the authority for user identity and permissions.

Sensitive Server Actions and Route Handlers must independently enforce authorization.

## 10. Data and Order Strategy

The application separates dish, user, session, order, and validation logic into shared modules under `lib/`.

The primary responsibilities are:

| Module | Responsibility |
|---|---|
| `lib/dishes.js` | Dish catalogue and menu data |
| `lib/users.js` | Demo user lookup |
| `lib/session.js` | Session creation, lookup, and deletion |
| `lib/orders.js` | Order creation, retrieval, and updates |
| `lib/schema.js` | Server-side input validation |

### Trusted order calculation

Order data received from the browser is untrusted.

The server must validate submitted items, retrieve trusted dish prices, calculate the total, and associate the order with the current session.

Client-submitted prices and user IDs must not determine the authoritative order total or ownership.

### In-memory limitations

The current learning implementation uses process-local in-memory storage for users, sessions, and orders where implemented that way.

This means:

- Data can be lost when the server process restarts.
- Separate application instances do not automatically share state.
- Changes are not durably persisted.
- In-memory storage is not suitable for reliable production orders or sessions.

A production application requires persistent storage, secure credential handling, and appropriate session management.

## 11. Live Data Strategy

### Debounced menu search

The menu's initial data is rendered on the server. Subsequent searches and pagination use the API through the client-side data-fetching layer.

Debouncing waits briefly after the user stops typing before sending the search request.

The browser Network panel should be used to verify that requests occur after pauses rather than on every keystroke.

### Order status polling

The order detail page retrieves the authorized order on the server and supplies it as initial data to the client status component.

The client uses SWR to poll the order endpoint periodically, with a five-second refresh interval.

This allows periodic status updates without making the initial page depend on an empty client-side loading state.

The order API must still authenticate the request and enforce ownership on every poll.

## 12. Performance Strategy

The project measures actual loading behavior instead of assuming that an optimization is successful.

The work includes:

- Rendering initial menu data on the server.
- Passing initial data into the interactive interface.
- Using local WebP images with Next.js `Image`.
- Providing image dimensions and responsive sizing.
- Prioritizing the first appropriate menu image.
- Using `next/font` for font optimization.
- Recording production-build Lighthouse measurements.
- Documenting findings and outstanding work in `PERF.md`.

### Latest recorded local results

| Metric | Baseline | Latest recorded run |
|---|---:|---:|
| Performance score | 88 | 73 |
| First Contentful Paint | 0.8 s | 0.9 s |
| Largest Contentful Paint | 2.6 s | 3.4 s |
| Total Blocking Time | 350 ms | 800 ms |
| Cumulative Layout Shift | 0 | 0 |
| Speed Index | 1.3 s | 1.8 s |

The measurements show mixed results, not a consistent overall improvement. The latest recorded LCP remains above 2.5 seconds, and the performance score remains below the Day 45 target of 90.

The observed resource-load delay decreased in one image-priority experiment, but that alone does not establish a better overall user experience.

### Day 45 targets

- Mobile throttled LCP under 2.5 seconds.
- CLS below 0.1.
- First Load JS for `/menu` below 120 kB.
- Largest delivered image below 150 kB.
- Lighthouse Performance score of at least 90.

These are targets, not achieved results. Bundle-size checks, image-size verification, and deployed Lighthouse measurements must be recorded separately when completed.

See `PERF.md` for the complete measurements and verification plan.

## 13. Environment Configuration

Local configuration belongs in:

```text
.env.local
```

The repository includes:

```text
.env.example
```

as a template for environment variables.

Example placeholders may include:

```text
DATABASE_URL=
TELEBIRR_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MAP_KEY=
```

These placeholders do not by themselves mean every integration is implemented or active.

The local environment file must remain untracked. Server secrets must not be exposed to the browser or committed to Git. Variables prefixed with `NEXT_PUBLIC_` are intended to be exposed to browser code and must not contain secrets.

## 14. SEO and Metadata Strategy

Day 44 adds search metadata and social-sharing support while keeping metadata generation connected to the application's actual content.

### Root metadata and dish metadata

The root layout defines shared metadata, including the title template and `metadataBase`.

Individual routes provide appropriate titles and descriptions. Dish pages generate metadata from shared dish data to keep the page content and metadata consistent.

### Social sharing and structured data

The application includes:

- Open Graph metadata for social sharing.
- Generated Open Graph images for individual dish pages.
- `MenuItem` JSON-LD structured data based on dish content.

Structured data should describe the actual page content rather than introduce information users cannot see.

### Sitemap, robots, and canonical URLs

The generated `sitemap.xml` lists public pages and available dishes.

The `robots.txt` file references the sitemap and guides compliant crawlers away from selected private paths.

Canonical URLs identify preferred URLs for pages that may accept query parameters or alternate URL forms.

Robots rules are crawler guidance, not access control. Authentication and authorization must continue to protect private pages and data.

Local verification confirmed valid sitemap XML with 11 URLs, expected crawler rules, distinct metadata for the homepage, menu, and sampled dish pages, and working dish preview-image routes. Production-domain metadata and live social previews still require verification.

## 15. Security Verification Strategy

Security verification must test both the interface and the underlying server operations.

### Test 1 — Signed-out order creation

Send a `POST /api/orders` request without an authenticated session.

Expected behavior: the server rejects the request with `401 Unauthorized`.

A signed-out order-creation request returned `401` during local verification.

### Test 2 — Order ownership

Sign in as one customer and attempt to access or cancel another customer's order.

Expected behavior: the server does not disclose or modify the other customer's order.

The cross-user scenario still requires verification with two distinct users.

### Test 3 — Open redirect

Try an external or protocol-relative `next` value.

Expected behavior: the unsafe destination is rejected and the user remains on a safe internal route.

The external redirect scenario was checked locally.

### Test 4 — Customer accessing the kitchen

Sign in as a customer and visit `/kitchen`.

Expected behavior: the server-side role check denies access.

### Test 5 — Server-side validation

Submit invalid order data directly to the API or Server Action.

Expected behavior: the server rejects invalid input even when browser-side validation is bypassed.

### Test 6 — Live data

Verify that menu search sends requests after typing pauses and that the order page initially renders its server-provided order data before polling begins.

Only mark a scenario complete after the relevant behavior has been tested.

## 16. Final Architecture

```text
Browser
   |
   v
Next.js application
   |
   +-------------------------+
   |                         |
   v                         v
Public menu              Authentication
   |                         |
   v                         v
Server-side dishes      Session cookie
   |                         |
   v                         v
Initial menu            getSession()
   |                         |
   v                         v
Client interactions     Authorization checks
   |                         |
   |                +--------+--------+
   |                |                 |
   |                v                 v
   |          Customer orders    Staff features
   |                |
   |                v
   |          Ownership checks
   |
   v
Search and pagination API

Order detail page
   |
   v
Server-side authorized order
   |
   v
Initial client data
   |
   v
Periodic status polling

All sensitive operations
   |
   v
Server validation and authorization
```

## Final Principles

1. Authentication identifies the user; authorization determines their permissions.
2. The server, not the browser, decides who owns an order.
3. Route guards improve navigation but do not replace server-side checks.
4. Server Components can read initial data directly without calling the application's own API unnecessarily.
5. Client Components should be used where interaction requires them.
6. Sensitive Server Actions and Route Handlers must enforce authorization independently.
7. Performance changes must be evaluated using measured results, not assumptions.
8. In-memory stores are learning tools, not a substitute for production persistence.
9. SEO directives do not protect private data.
10. Production claims must be supported by production verification.