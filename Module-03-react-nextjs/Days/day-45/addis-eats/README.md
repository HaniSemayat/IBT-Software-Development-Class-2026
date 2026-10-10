# Addis Eats — Next.js Learning Project

Addis Eats is a food-ordering application built with Next.js App Router and React as part of the IBT Full-Stack Software Development and QA training.

The project brings together file-based routing, rendering strategies, Server and Client Components, authentication, authorization, data validation, Route Handlers, Server Actions, SEO, and performance measurement.

## Project Highlights

### Authentication and Authorization — Day 42

- Sign in and sign out with server-side sessions
- HTTP-only session cookies
- Protected routes and safe post-login redirects
- User-specific order access and ownership checks
- Staff-only kitchen dashboard
- Authorization checks inside protected operations
- Server-side order validation

See [`AUTH.md`](./AUTH.md) for authentication flows, security checks, and implementation limitations.

### Performance and Architecture — Day 43

- Next.js `Image` with explicit dimensions, responsive sizing, and alternative text
- Local WebP food images
- Priority loading for the first menu image
- `next/font` for font optimization
- Server-rendered initial menu data
- SWR for subsequent search and pagination requests
- Production Lighthouse measurements documented in [`PERF.md`](./PERF.md)
- Environment variable template in `.env.example`

### SEO and Metadata — Day 44

- Root metadata configuration with a title template and default title
- Page-specific titles and descriptions
- Dish metadata generated from shared dish data
- Open Graph metadata and generated dish social-preview images
- `MenuItem` JSON-LD structured data
- Generated `sitemap.xml` containing public pages and dishes
- `robots.txt` with a sitemap reference and private-route exclusions
- Canonical URLs for pages that support query parameters

Local verification confirmed valid sitemap XML with 11 URLs, expected robots rules, distinct metadata for the homepage, menu, and dish pages, and working dish social-preview image routes. Production-domain metadata and live social previews still require deployment verification.

### Integration and Security — Day 45

- Protected checkout, order, and kitchen routes
- Session and ownership checks for sensitive operations
- Server-side validation of order data
- Server-derived order ownership and trusted dish prices
- Debounced menu search
- Server-provided initial order data with periodic status polling
- Documented data flow, authorization boundaries, and performance limitations

The current application uses in-memory demo storage. It is not production-ready authentication or durable order storage.

## Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Home page |
| `/menu` | Public | Browse and search dishes |
| `/menu/[id]` | Public | View a dish |
| `/cart` | Public | Manage cart items |
| `/signin` | Public | Sign in |
| `/checkout` | Signed in | Submit an order |
| `/orders` | Signed in | View your orders |
| `/orders/[id]` | Signed in + owner | View an individual order |
| `/kitchen` | Staff only | Kitchen dashboard |

The application also provides dish and order API endpoints under `app/api/`.

## Technology Stack

- Next.js App Router
- React
- JavaScript
- Server Components and Client Components
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

Create `.env.local` if local configuration is needed. Use `.env.example` as a reference for the expected variable names.

```powershell
Copy-Item .env.example .env.local
```

Fill in the values required by your environment. Do not commit `.env.local` or expose server secrets through variables prefixed with `NEXT_PUBLIC_`.

Some environment variables may be optional for the current in-memory learning implementation. Check the relevant code before configuring external services.

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

Start the production server:

```powershell
npm run start
```

Then open [http://localhost:3000](http://localhost:3000).

The Day 45 application build completed successfully during local verification. Re-run the build after subsequent code changes to confirm the current state.

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
| POST | `/api/orders` | Create an authenticated order |
| GET | `/api/orders/[id]` | Retrieve an order owned by the current user |

Protected operations must enforce authentication, authorization, ownership, and server-side validation.

Expected responses include:

- `200 OK` — successful retrieval
- `201 Created` — successful order creation
- `400 Bad Request` — malformed request
- `401 Unauthorized` — authentication required
- `404 Not Found` — resource does not exist or is unavailable to the requester
- `422 Unprocessable Entity` — validation failure

### Security verification

A signed-out request to `POST /api/orders` returned `401 Unauthorized` during local verification.

The safe redirect scenario was also checked: an external URL supplied through the sign-in `next` parameter must not redirect the user outside the application.

Order ownership must additionally be verified with two distinct users to confirm that one user cannot read or cancel another user's order.

## Authentication and Security

The application demonstrates:

- Server-side session lookup
- HTTP-only session cookies
- Protected pages and API operations
- User-specific order ownership
- Role checks for staff functionality
- Safe internal redirects after sign-in
- Server-side validation and trusted price calculations

The proxy provides a navigation guard; it is not a replacement for authorization checks inside Server Actions and Route Handlers.

This is a learning project, not a production-ready authentication service. Review [`AUTH.md`](./AUTH.md) before reusing the authentication code.

## Performance Report

See [`PERF.md`](./PERF.md) for the baseline, follow-up Lighthouse measurements, optimization experiments, and remaining bottlenecks.

The latest recorded local `/menu` run scored 73, with:

- First Contentful Paint: 0.9 s
- Largest Contentful Paint: 3.4 s
- Total Blocking Time: 800 ms
- Cumulative Layout Shift: 0

Results varied between runs. Image-loading changes reduced the observed resource-load delay in one run, but overall performance improvement was not conclusive.

The latest local LCP remains above the 2.5-second target, and the Lighthouse score remains below 90. Deployed performance measurements and some bundle/image-size checks are still outstanding.

## Project Documentation

| File | Description |
|---|---|
| `README.md` | Project overview and setup |
| `AUTH.md` | Authentication and authorization |
| `BOUNDARY.md` | Server/Client Component boundaries |
| `DATA.md` | Data, session, and order flow |
| `STRATEGY.md` | Architecture and rendering decisions |
| `PERF.md` | Performance measurements and optimization findings |

## Current Limitations

This project is designed for learning and demonstration.

- Sessions, users, and orders use in-memory storage where implemented that way.
- In-memory data may disappear when the server restarts and is not shared across multiple instances.
- Demo credentials and plain-text passwords are not suitable for real users.
- Production authentication requires secure password hashing, persistent storage, rate limiting, and appropriate session management.
- Deployed SEO and performance behavior must be verified against the real production domain.

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
Image and Font Optimization
        +
SEO and Metadata
        +
Production Measurement
```

The central security principle is that the browser controls the interface, but the server controls access.

The central performance principle is to measure actual behavior before claiming an optimization has worked.