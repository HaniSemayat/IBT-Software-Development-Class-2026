# Addis Eats — Next.js Learning Project

Addis Eats is a food-ordering application built with React and Next.js App Router as part of the IBT Full-Stack Software Development and QA training.

The project combines authentication, authorization, data validation, API routes, Server Actions, and performance optimization.

## Project Highlights

### Authentication and Authorization — Day 42

- Sign in and sign out with server-side sessions
- HTTP-only session cookies
- Protected routes and safe post-login redirects
- User-specific order access and ownership checks
- Staff-only kitchen dashboard
- Server-side authorization in protected operations
- Server-side order validation

### Performance and Architecture — Day 43

- Next.js `Image` with explicit dimensions, responsive sizing, and alternative text
- Local WebP food images
- Priority loading for the first menu image
- `next/font` for font optimization
- Server-rendered initial menu data
- SWR for subsequent search and pagination requests
- Production Lighthouse measurements documented in `PERF.md`
- Environment variable template in `.env.example`

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

The application also provides dish and order API endpoints. See the implementation under `app/api/`.

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

- Node.js version compatible with the project's Next.js version
- npm

### Install dependencies

```powershell
npm install
```

### Configure environment variables

Create `.env.local` for local configuration if needed. Use `.env.example` as a reference for the expected variable names.

```powershell
Copy-Item .env.example .env.local
```

Fill in only the values needed for your environment. Do not commit `.env.local` or place server secrets in variables prefixed with `NEXT_PUBLIC_`.

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

The Day 43 production build completed successfully during project verification.

## API Overview

### Dishes

| Method | Endpoint | Expected behavior |
|---|---|---|
| GET | `/api/dishes` | Return dishes |
| GET | `/api/dishes/[id]` | Return one dish or `404 Not Found` |

Verified production responses:

- `GET /api/dishes` — `200 OK`
- `GET /api/dishes/1` — `200 OK`
- `GET /api/dishes/999` — `404 Not Found`

### Orders

The application also provides order endpoints for creating, retrieving, and managing orders. Protected operations must enforce authentication, authorization, ownership, and server-side validation.

Expected responses depend on the endpoint and request:

- `200 OK` — successful retrieval
- `201 Created` — successful creation
- `401 Unauthorized` — authentication required
- `404 Not Found` — resource unavailable to the requester
- `422 Unprocessable Entity` — validation failure

## Authentication and Security

The application demonstrates:

- Server-side session lookup
- HTTP-only cookies
- Protected pages and API operations
- User-specific order ownership
- Role checks for staff functionality
- Safe internal redirects after sign-in

The proxy provides a navigation guard; it is not a replacement for authorization checks inside Server Actions and Route Handlers.

This is a learning project, not a production-ready authentication service. Review `AUTH.md` for implementation details and limitations before reusing the authentication code.

## Performance Report

See [`PERF.md`](./PERF.md) for the Day 43 baseline, follow-up Lighthouse measurements, optimization experiments, and remaining bottlenecks.

The latest recorded `/menu` Lighthouse run scored 73, with:

- First Contentful Paint: 0.9 s
- Largest Contentful Paint: 3.4 s
- Total Blocking Time: 800 ms
- Cumulative Layout Shift: 0

The results vary between runs. Image-loading changes reduced the observed resource-load delay in one run, but overall performance improvement was not conclusive. The report records the remaining work rather than claiming all performance targets have been met.

## Project Documentation

| File | Description |
|---|---|
| `AUTH.md` | Authentication and authorization |
| `BOUNDARY.md` | Server/Client Component boundaries |
| `DATA.md` | Data, session, and order flow |
| `STRATEGY.md` | Architecture and rendering decisions |
| `PERF.md` | Day 43 performance measurements |

## Current Limitations

This project is designed for learning. Depending on the implementation, data may be stored in memory and lost when the server process restarts. Demo authentication also requires production-grade improvements before real-world use, including password hashing, persistent storage, rate limiting, and secure secret management.

## Learning Goal

Addis Eats brings together:

```text
Routing and Layouts
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
Production Measurement
```

The central security principle is that the browser controls the interface, but the server controls access. The central performance principle is to measure actual behavior before claiming an optimization has worked.
