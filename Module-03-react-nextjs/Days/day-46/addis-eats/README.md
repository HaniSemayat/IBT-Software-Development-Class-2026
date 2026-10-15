# Addis Eats — Next.js Learning Project

Addis Eats is a food-ordering application built with Next.js App Router and React as part of the IBT Full-Stack Software Development and QA training.

The project brings together file-based routing, rendering strategies, Server and Client Components, authentication, authorization, data validation, Route Handlers, Server Actions, SEO, performance measurement, and an administrative dashboard.

## Project Highlights

### Authentication and Authorization — Day 42

- Server-side sessions and HTTP-only session cookies
- Protected routes and safe post-login redirects
- User-specific order access and ownership checks
- Staff-only kitchen dashboard
- Authorization checks inside protected operations
- Server-side order validation

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
- Canonical URLs for pages that support query parameters

Local checks previously confirmed sitemap XML, expected robots rules, page metadata, and dish social-preview routes. Production-domain metadata and live social previews still require deployment verification.

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
- Menu layout without a redundant category sidebar
- Centered menu content with responsive horizontal spacing
- Add to Cart buttons on menu dish cards
- Temporary "Added to Cart" confirmation after clicking
- Live navbar cart count based on total item quantities
- Shared cart state through a React Context provider

The menu uses `SearchBox.jsx` to render searchable, paginated dish cards. `DishList.jsx` is a separate component and is not the active renderer for those cards.

The cart currently uses client-side React state. Its contents reset when the application reloads.

## Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Home page |
| `/menu` | Public | Browse and search dishes |
| `/menu/[id]` | Public | View a dish |
| `/cart` | Public | Manage cart items |
| `/signin` | Public | Sign in |
| `/signup` | Public | Register an account |
| `/checkout` | Signed in | Submit an order |
| `/orders` | Signed in | View your orders |
| `/orders/[id]` | Signed in + owner | View an individual order |
| `/dashboard` | Authorized staff | View dashboard analytics |
| `/kitchen` | Authorized staff | Kitchen dashboard |

The application also provides dish and order API endpoints under `app/api/`.

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

If local configuration is needed, create `.env.local` using `.env.example` as a reference:

```powershell
Copy-Item .env.example .env.local
```

Fill in the values required by your environment. Do not commit `.env.local` or expose server secrets through variables prefixed with `NEXT_PUBLIC_`.

Check the relevant code to determine which variables are required for the current implementation.

### Start development

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Verification

Run the production build:

```powershell
npm run build
```

To run the production server after a successful build:

```powershell
npm run start
```

Open [http://localhost:3000](http://localhost:3000).

The Day 46 build completed successfully during local verification. Re-run the build after subsequent changes to verify the current state.

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
| GET | `/api/orders/[id]` | Retrieve an order subject to access checks |

Protected operations must enforce authentication, authorization, ownership, and server-side validation.

Expected responses include:

- `200 OK` — successful retrieval
- `201 Created` — successful order creation
- `400 Bad Request` — malformed request
- `401 Unauthorized` — authentication required
- `404 Not Found` — resource does not exist or is unavailable to the requester
- `422 Unprocessable Entity` — validation failure

A signed-out request to `POST /api/orders` previously returned `401 Unauthorized` during local verification.

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

This is a learning project, not a production-ready authentication service. Review [AUTH.md](./AUTH.md) before reusing the authentication code.

## Performance Report

See [PERF.md](./PERF.md) for the baseline, follow-up Lighthouse measurements, optimization experiments, and remaining bottlenecks.

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

## Current Limitations

This project is designed for learning and demonstration.

- Users, sessions, and orders use in-memory storage where implemented that way.
- In-memory data may disappear when the server restarts and is not shared across multiple instances.
- Cart state is held in client-side React state and is not persisted across reloads.
- Demo credentials and plain-text passwords are not suitable for real users.
- Production authentication requires secure password hashing, persistent storage, rate limiting, and appropriate session management.
- Production SEO and performance behavior must be verified against the deployed domain.

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
