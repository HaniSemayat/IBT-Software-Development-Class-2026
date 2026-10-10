# Addis Eats — Rendering, Authentication & Authorization Strategy

## Overview

Days 42–43 combine two important parts of the Addis Eats architecture:

- **Day 42:** Authentication, authorization, sessions, protected routes, and order ownership.
- **Day 43:** Server-rendered initial menu data and performance measurement.

The main principle is to make each security and rendering decision at the correct boundary. User identity and authorization belong on the server, while interactive features belong in Client Components where needed.

---

## 1. Authentication Strategy

Addis Eats uses a server-side session model.

When a user signs in:

1. The server checks the submitted credentials.
2. It creates a random session identifier.
3. The identifier is associated with the user's session on the server.
4. The browser receives the session identifier in an `httpOnly` cookie.
5. The user is redirected to the appropriate page.

Conceptually:

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

The current learning implementation uses an in-memory session store. This is useful for demonstrating the flow but is not sufficient for a production deployment.

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
- `sameSite` helps limit certain cross-site cookie requests.
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

The application uses that session to identify the current user and determine their role.

Customer access and staff access are different. Being signed in does not automatically grant permission to access staff-only features.

## 4. Route Protection Strategy

The application has public and protected routes.

Public pages include:

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

The proxy provides an early navigation guard for selected routes. When the required session cookie is missing, it redirects the visitor to sign in and can preserve the intended destination.

The proxy matcher is deliberately narrow:

```js
export const config = {
  matcher: ["/checkout", "/orders/:path*"],
};
```

The proxy checks for the cookie; it does not replace a complete session lookup or authorization check.

**The proxy is a navigation guard, not the final security boundary.**

Protected pages, Server Actions, and Route Handlers must perform their own appropriate server-side checks.

## 5. Order Ownership

A signed-in user must only be able to access orders they are authorized to view or modify.

The application uses helpers such as:

```js
getOrderForUser(orderId, userId)
```

The server checks both the requested order and the authenticated user's ID.

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

Changing an order ID in the URL must not reveal another customer's order.

When creating an order, the server derives the owner from the authenticated session instead of trusting a user ID supplied by the browser.

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

A customer must not gain access simply by entering the route directly or modifying browser-side state.

Hiding a navigation link is not authorization. The server must enforce the permission check.

## 7. Safe Redirect Strategy

The sign-in flow can accept an internal destination such as:

```text
/signin?next=/checkout
```

After successful authentication, the application can return the user to the requested page.

The redirect target must be validated. External URLs and protocol-relative URLs such as `//evil.com` must not be accepted as internal destinations.

This prevents the sign-in flow from becoming an open redirect.

## 8. Rendering Strategy

The application chooses rendering behavior according to each route's data requirements.

### Public landing page

The landing page can use static rendering because it does not need to depend on the current user's session.

### Menu

The menu Server Component reads the initial dish data directly from the shared server-side data source.

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

This avoids making an unnecessary request from a Server Component to the application's own API for its initial data.

Client-side behavior can still handle interactive features such as search, filtering, and pagination where implemented.

### Individual dish pages

The dynamic `/menu/[id]` route uses the project's static-generation strategy where applicable. Unknown dishes use the not-found behavior.

### Cart

The cart needs client-side state for quantity changes, item removal, and the running ETB total.

### Checkout and user-specific pages

These pages depend on request-specific data, such as the current session, and must be designed with that requirement in mind.

The objective is not to make every route static. It is to choose the appropriate rendering strategy while preserving correct behavior and security.

## 9. Server and Client Boundaries

Server Components are the default.

Client Components are used when browser interaction, event handlers, or client-side state is needed.

The intended separation is:

```text
Server Components
    |
    +-- Read initial data
    +-- Access server-side resources
    +-- Render request-dependent content
    +-- Enforce server-side checks
    |
    v
Client Components
    |
    +-- Handle interaction
    +-- Manage interactive state
    +-- Display pending and error states
```

Client Components should not receive private server secrets or become the authority for user identity and permissions.

## 10. Performance Strategy

Day 43 investigates the initial menu rendering path and measures the effect of performance changes.

The work includes:

- Rendering initial menu data on the server.
- Passing initial data into the interactive interface.
- Limiting priority loading to the first menu image.
- Measuring the page with Lighthouse.
- Recording the results in `PERF.md`.

The objective is to improve initial rendering without removing useful client-side interactions.

### Measurement results

The recorded Lighthouse runs show mixed results rather than a consistent improvement across every metric.

The measurements include:

- Performance score
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)
- JavaScript execution and main-thread work

LCP and TBT remain areas for improvement. A single score is not enough to establish that a change improved the page overall.

The measurements should be compared across repeated runs under reasonably consistent conditions.

The detailed measurements and observations are recorded in:

```text
PERF.md
```

## 11. Data Storage Strategy

The learning project uses in-memory storage for sessions and orders.

This makes the data flow easier to understand but has important limitations:

- Data can be lost when the server process restarts.
- Data is not automatically shared between server instances.
- It does not provide the durability or concurrency guarantees expected from production storage.

A production application would normally use persistent storage and suitable session management.

## 12. Environment Configuration

Local configuration belongs in:

```text
.env.local
```

The repository includes:

```text
.env.example
```

as a template for environment variables.

Examples include:

```text
DATABASE_URL=
TELEBIRR_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MAP_KEY=
```

These placeholders do not by themselves mean that every integration is implemented or active.

The local environment file must remain untracked. Server secrets must not be exposed to the browser or committed to Git. Variables prefixed with `NEXT_PUBLIC_` are intended to be exposed to browser code and must not contain secrets.

## 13. Security Verification Strategy

The authentication and authorization flow should be checked with deliberate tests.

### Test 1 — Signed-out access

Request a protected page or action without a valid session.

Expected behavior: access is rejected or the browser is redirected to sign in, according to the route's design.

### Test 2 — Order ownership

Sign in as one customer and try to access another customer's order.

Expected behavior: the server does not return the other customer's order.

### Test 3 — Open redirect

Try an external or protocol-relative `next` value.

Expected behavior: the unsafe redirect is rejected.

### Test 4 — Customer accessing the kitchen

Sign in as a customer and visit `/kitchen`.

Expected behavior: access is denied by the server-side role check.

### Test 5 — Server-side validation

Submit invalid order data directly to the API or action.

Expected behavior: the server rejects invalid data even if browser-side validation is bypassed.

## 14. Final Architecture

```text
Browser
   |
   v
Server-rendered pages
   |
   +------------------------+
   |                        |
   v                        v
Public menu data       Authentication flow
                            |
                            v
                       Session cookie
                            |
                            v
                        getSession()
                            |
                            v
                     Authorization checks
                            |
                 +----------+----------+
                 |                     |
                 v                     v
          Customer orders         Staff features
                 |
                 v
          Ownership checks

Menu Server Component
          |
          v
Read initial dish data
          |
          v
Render initial menu
          |
          v
Client-side interactions
          |
          v
Measure and optimize performance
```

## Final Principles

1. Authentication identifies the user; authorization determines their permissions.
2. The server, not the browser, decides who owns an order.
3. Route guards improve navigation but do not replace server-side checks.
4. Server Components can read initial data directly without calling the application's own API unnecessarily.
5. Client Components should be used where interaction requires them.
6. Performance changes must be evaluated using measured results, not assumptions.
7. In-memory stores are learning tools, not a substitute for production persistence.


## 15. Day 44 — Metadata and SEO Strategy

Day 44 adds search-engine metadata and social-sharing previews while keeping metadata generation connected to the application's actual dish data.

### Root Metadata

The root layout defines the site's metadata base, default title, and title template. Individual routes provide their own titles and descriptions so that pages have meaningful, distinct search snippets.

### Dish Metadata

Individual dish pages use `generateMetadata()` to derive metadata from the shared dish data source.

This keeps the dish name, price, and description consistent with the content displayed on the page.

### Social Sharing and Structured Data

The application includes:

- Site-wide Open Graph metadata for social sharing.
- Generated Open Graph images for individual dish pages.
- `MenuItem` JSON-LD structured data based on the visible dish name and ETB price.

Structured data should describe the actual page content rather than introduce information that users cannot see.

### Sitemap, Robots, and Canonical URLs

The generated `sitemap.xml` lists public pages and available dishes while excluding private routes.

The `robots.txt` file identifies the sitemap and discourages crawlers from visiting private paths such as `/cart`, `/checkout`, `/orders`, and `/kitchen`.

Robots rules are crawler guidance, not access control. Authentication and authorization must continue to protect private pages and data.

Canonical URLs identify the preferred URL for pages that may otherwise be accessible through query parameters or alternate URL forms.

### Verification

Local verification confirmed that:

- `sitemap.xml` parses as valid XML and contains 11 URLs.
- `robots.txt` includes the expected sitemap and disallow rules.
- Sampled routes return distinct titles, descriptions, and canonical URLs.
- Dish-specific Open Graph image routes return images.

Production-domain metadata and deployed social-sharing previews still require verification after deployment.

The SEO work complements the rendering strategy: metadata and public dish data are generated at the appropriate server boundary, while interactive features remain in Client Components where necessary.