# Addis Eats — Next.js Learning Project

Addis Eats is a food-ordering application built with Next.js App Router and React as part of the IBT Full-Stack Software Development and QA training.

Day 47 integrates the concepts covered throughout Days 36–47, including routing, rendering strategies, Server and Client Components, authentication, authorization, validation, Route Handlers, Server Actions, SEO, performance measurement, and a role-based administrative workspace.

## Project Highlights

### Authentication and Authorization — Day 42

- Server-side session lookup and HTTP-only session cookies
- Protected routes and safe post-login redirects
- User-specific order access and ownership checks
- Staff-only functionality
- Server-side authorization and order validation

See [AUTH.md](./AUTH.md) for authentication flows, security checks, and implementation limitations.

### Performance and Architecture — Day 43

- Next.js `Image` with explicit dimensions, responsive sizing, and alternative text
- Local WebP food images and priority loading for the first menu image
- `next/font` for font optimization
- Server-rendered initial menu data
- SWR for subsequent search and pagination requests
- Environment variable template in `.env.example`

See [PERF.md](./PERF.md) for Lighthouse measurements and optimization findings.

### SEO and Metadata — Day 44

- Root metadata configuration and title templates
- Page-specific titles and descriptions
- Dish metadata generated from shared dish data
- Open Graph metadata and generated dish social-preview images
- `MenuItem` JSON-LD structured data
- Generated `sitemap.xml` and `robots.txt`
- Canonical URLs for supported query-parameter pages

Production-domain metadata and live social previews require deployment verification.

### Integration and Security — Day 45

- Protected checkout, order, and kitchen routes
- Session, ownership, and role checks
- Server-side validation and trusted dish prices
- Server-derived order ownership
- Debounced menu search
- Server-provided initial order data with periodic status polling

### Dashboard and UI Improvements — Day 46

- Administrative dashboard with order analytics
- Order table with sorting and pagination
- Revenue summaries and breakdowns by neighbourhood and day
- Centered menu content with responsive spacing
- Add to Cart buttons on menu dish cards
- Temporary "Added to Cart" confirmation
- Navbar cart count based on total item quantities
- Shared cart state through React Context

The menu uses `SearchBox.jsx` to render searchable, paginated dish cards. `DishList.jsx` is separate and is not the active renderer for those cards.

The cart uses client-side React state and currently resets when the application reloads.

### Next.js Integration and Role-Based Workspace — Day 47

Day 47 brings the application's routing, rendering, data handling, and security concepts together in one Next.js application.

- App Router and file-based routing
- Nested layouts and special route files
- Static rendering, Static Site Generation (SSG), and Incremental Static Regeneration (ISR)
- Server Components by default
- Client Components for browser interaction and client state
- Route Handlers for API operations
- Server Actions for supported mutations
- Server-side validation and authorization
- Loading, error, and not-found UI
- Revalidation after supported mutations
- Role-based administrative and kitchen functionality

See [BOUNDARY.md](./BOUNDARY.md) for Server/Client boundaries and [STRATEGY.md](./STRATEGY.md) for rendering decisions.

## Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Home page |
| `/menu` | Public | Browse and search dishes |
| `/menu/[id]` | Public | View an individual dish |
| `/cart` | Public | Manage cart items |
| `/signin` | Public | Sign in |
| `/signup` | Public | Register an account |
| `/checkout` | Signed in | Submit an order |
| `/orders` | Signed in | View personal orders |
| `/orders/[id]` | Signed in + owner | View an individual order |
| `/dashboard` | Authorized staff | View dashboard analytics |
| `/admin` | Authorized staff | Administrative workspace |
| `/kitchen` | Authorized staff | Kitchen dashboard |

The application also provides dish and order API endpoints under `app/api/`.

Actual route availability and access rules should be confirmed against the implementation.

## Rendering Strategy

| Route | Intended strategy | Purpose |
|---|---|---|
| `/` | Static | Landing page |
| `/menu` | Revalidated | Menu data with periodic revalidation |
| `/menu/[id]` | SSG | Individual dish pages |
| `/cart` | Client interaction | Quantities and running ETB total |
| `/checkout` | Dynamic | Checkout and order submission |

Rendering behavior depends on the implementation and its data dependencies. Use the production build output to verify the actual route classifications.

## Technology Stack

- Next.js App Router
- React and JavaScript
- Server Components and Client Components
- React Context for cart state
- Server Actions
- Route Handlers
- Next.js Image and Font optimization
- SWR
- Tailwind CSS
- Git and GitHub

## Getting Started

### Requirements

- Node.js compatible with the project's Next.js version
- npm

### Install dependencies

```powershell
npm install
```

### Configure environment variables

If local configuration is needed, create `.env.local` from `.env.example`:

```powershell
Copy-Item .env.example .env.local
```

Fill in any required values. Do not commit `.env.local` or expose server secrets through variables prefixed with `NEXT_PUBLIC_`.

Check the relevant implementation to determine which environment variables are required.

### Start development

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Verification

Build the application:

```powershell
npm run build
```

Start the production server after a successful build:

```powershell
npm run start
```

Open [http://localhost:3000](http://localhost:3000).

The Day 47 production build completed successfully during local verification. Re-run the build after subsequent changes to verify the current state.

A successful build does not by itself verify authentication, authorization, data persistence, or deployed behavior.

## API Overview

### Dishes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/dishes` | Retrieve or search dishes |
| GET | `/api/dishes/[id]` | Retrieve one dish |

Previously verified responses:

- `GET /api/dishes` — `200 OK`
- `GET /api/dishes/1` — `200 OK`
- `GET /api/dishes/999` — `404 Not Found`

### Orders

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/orders` | Create an order subject to authentication and validation |
| GET | `/api/orders/[id]` | Retrieve an order subject to access checks |

Protected operations must enforce authentication, authorization, ownership, and server-side validation.

Expected responses include:

- `200 OK` — successful retrieval
- `201 Created` — successful order creation
- `400 Bad Request` — malformed request
- `401 Unauthorized` — authentication required
- `404 Not Found` — resource does not exist or is unavailable to the requester
- `422 Unprocessable Entity` — validation failure

A signed-out request to `POST /api/orders` previously returned `401 Unauthorized` during local verification. Re-test endpoints after changes.

## Authentication and Security

The application demonstrates:

- Session lookup and HTTP-only cookies
- Protected pages and API operations
- User-specific order ownership
- Role checks for staff functionality
- Safe internal redirects after sign-in
- Server-side validation and trusted price calculations

The proxy provides a navigation guard; it does not replace authorization checks inside Server Actions and Route Handlers.

**Important limitations:**

- Users, sessions, and orders currently use in-memory storage where implemented that way.
- In-memory state may disappear after restarts and may not be shared across server instances.
- Passwords are not yet stored using a production-ready password-hashing strategy.
- Production sign-in has not yet been verified as reliable.
- Persistent storage, secure password hashing, rate limiting, and production session management remain necessary before real-world use.

This is a learning project, not a production-ready authentication service. See [AUTH.md](./AUTH.md) before reusing the authentication code.

## Performance Report

See [PERF.md](./PERF.md) for baseline and follow-up Lighthouse measurements, optimization experiments, and remaining bottlenecks.

The latest recorded local `/menu` run scored 73, with:

- First Contentful Paint: 0.9 s
- Largest Contentful Paint: 3.4 s
- Total Blocking Time: 800 ms
- Cumulative Layout Shift: 0

Results varied between runs. Image-loading changes reduced the observed resource-load delay in one run, but overall performance improvement was not conclusive.

The recorded LCP remains above the 2.5-second target, and the Lighthouse score remains below 90. Deployed performance and some bundle/image-size checks remain outstanding.

## Project Documentation

| File | Description |
|---|---|
| `README.md` | Project overview, setup, routes, and features |
| `AUTH.md` | Authentication and authorization |
| `BOUNDARY.md` | Server/Client Component boundaries |
| `DATA.md` | Data, session, and order flow |
| `STRATEGY.md` | Architecture and rendering decisions |
| `PERF.md` | Performance measurements and optimization findings |

## Learning Goal

Addis Eats brings together:

```text
Routing and Layouts
       +
Rendering Strategies
       +
Server and Client Components
       +
Authentication and Sessions
       +
Authorization and Ownership
       +
Route Handlers and Server Actions
       +
Server-Side Validation
       +
Dashboard Analytics
       +
Interactive Cart and Navigation
       +
Image and Font Optimization
       +
SEO and Metadata
       +
Production Measurement
```

The central security principle is that the browser controls the interface, but the server controls access.

The central performance principle is to measure actual behavior before claiming an optimization has worked.

## Interaction Quality and Submission Safety — Day 48

Day 48 focuses on accessible interactions, correct event handling, and safe form submissions.

### Event Handling and Accessibility

- Use semantic buttons for actions and links for navigation.
- Handle submissions with the form's `onSubmit` behavior rather than relying only on button clicks.
- Use `preventDefault()` to prevent browser defaults when necessary.
- Use `stopPropagation()` only when event bubbling must be stopped.
- Understand the difference between `target` and `currentTarget`.
- Provide keyboard-accessible interactions and visible focus indicators.
- Do not rely on hover-only interactions.
- Aim for interactive touch targets of approximately 44 × 44 CSS pixels where practical.

### Form Submission Safety

- Display pending feedback while submissions are running.
- Disable submit buttons while pending or when submission is unavailable.
- Display validation errors clearly and associate field errors with their inputs.
- Treat client-side validation as a usability feature, not a security boundary.
- Validate submitted data on the server and derive trusted prices and ownership from server-side data.
- Protect order creation against duplicate submissions.

### Idempotency Limitations

Checkout uses a submission identifier and server-side idempotency helper to prevent repeated submissions from creating duplicate orders within the same running server process.

The current in-memory implementation is a learning example, not production-ready idempotency. Records may disappear after restarts and are not shared across multiple server instances. Production use requires persistent, atomic idempotency storage and safe handling of concurrent requests.

### Verification

Run the relevant checks after interaction or form changes:

- `npm run lint`
- `git diff --check`

Run `npm run build` when changes warrant a production-build check. Test important keyboard and form flows in the browser; a successful build alone does not prove every interaction works correctly.

Deployment and live-environment verification remain separate follow-up tasks.